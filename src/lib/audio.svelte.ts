/**
 * The speaker.
 *
 * Every sound is synthesised — one noise burst, one oscillator, no audio
 * files and no network request. The voicing is modelled on a Fallout 4
 * terminal: the reference clip was measured rather than guessed, and these
 * are the numbers it gave up.
 *
 *   keystroke click  attack instant, −6 dB in ~2–4 ms, audible ~12 ms
 *                    spectral centroid ~2.2 kHz, 85% rolloff ~4.6 kHz
 *                    body harmonics at 133 / 200 / 267 / 367 / 533 / 667 Hz
 *                    (a ~67 Hz fundamental — a low thump, not a beep)
 *   typing rate      69 ms between characters ≈ 14.5 chars/s
 *   UI clicks        the terminal's own menu clicks are the same family,
 *                    not a different one: a wide bandpass near 1.8 kHz
 *                    (Q ≈ 0.5), 26% of the energy in 2.4–4.8 kHz and only
 *                    4–6% below 300 Hz, gone within ~30 ms. Bright, dry,
 *                    and at a fixed pitch — a falling sweep with a heavy
 *                    body is a cartoon boing, which is exactly what the
 *                    first attempt sounded like.
 *
 * So each sound is a bandpassed noise burst (the click) over a sawtooth
 * (the thump), both with a very short exponential decay. The keystroke
 * sweeps its body down; the UI sounds hold a fixed pitch, because a
 * falling sweep under a heavy body is a cartoon boing.
 *
 * The gains are not guesses either: the graph below was rendered through
 * an `OfflineAudioContext` and measured back, because the body sits
 * *before* its filter and can quietly dominate a mix that looks balanced
 * on paper. Rendered band energy for the open-screen click lands at
 * 4.6 / 3.3 / 3.0 / 7.8 / 16.7 / 24.1 / 27.0 / 13.4 % against a reference
 * of 4.5 / 4.4 / 5.6 / 10.5 / 15.5 / 26.4 / 15.7 / 17.3 %.
 *
 * Three rules still hold:
 *
 * 1. Muted until asked. A portfolio that makes noise on arrival gets its
 *    tab closed. The preference is remembered; nothing plays until [S].
 * 2. Nothing touches `AudioContext` before a user gesture — it is created
 *    lazily on the first sound, which can only follow a key or a click.
 * 3. Short. Nothing runs past 110 ms and nothing is still ringing 120 ms
 *    in. The level is set once, on the master bus — see `LEVEL`.
 */

import { browser } from '$app/environment';

const STORAGE_KEY = 'rkos.audio';

/**
 * The reference types at 14.5 characters a second. This site types up to
 * five times faster than that, and several lines animate at once, so the
 * keystroke sound is gated globally to roughly that rate — a run of text
 * clatters like a terminal instead of buzzing like a wasp.
 */
const KEY_INTERVAL = 62;

/**
 * The one way these sounds can stack: a stalled clock.
 *
 * `AudioContext` is born suspended and `resume()` is asynchronous — on a
 * cold audio device that can be a few hundred milliseconds — and
 * `currentTime` does not advance until the context is actually running.
 * Everything scheduled in that window is scheduled at the *same instant*,
 * so the click of a screen opening arrives on top of every keystroke that
 * screen typed while the speaker was still waking up. The noise bursts
 * merely add up; the sawtooth bodies are worse, because they all start in
 * phase at the same pitch and so sum coherently. Seven quiet clicks
 * become one very loud one.
 *
 * `performance.now()` cannot see this — it keeps running while the audio
 * clock is frozen — so the schedule is gated on the audio clock as well:
 * nothing may start within 30 ms of whatever was scheduled last. Running
 * normally nothing comes that close anyway (the keystroke gate alone is
 * twice that), so this only bites during the stall, where it lets the
 * first sound through and drops the pile-up behind it.
 */
const MIN_GAP = 0.03;

/**
 * Everything goes through one fader.
 *
 * The gains further down are ratios measured against each other — the
 * balance of click against body, keystroke against open-screen — and the
 * absolute level they happened to land on was too quiet to hear over a
 * room. Raising them one at a time would mean re-measuring that balance
 * against the reference all over again; raising the bus they all share
 * leaves it exactly where it was. At 5x the loudest moment on the site
 * peaks near 0.34, which is audible and still a long way under clipping.
 */
const LEVEL = 5;

let enabled = $state(false);
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let lastKey = 0;
let lastStart = -Infinity;

type Ctor = typeof AudioContext;

function context(): AudioContext | null {
	if (!browser) return null;

	const Constructor: Ctor | undefined =
		window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
	if (!Constructor) return null;

	ctx ??= new Constructor();
	// Autoplay policy: the context is born suspended and only a gesture can
	// resume it. Every caller here is already inside one.
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

/** The single output stage; every voice lands here, nothing reaches the speakers around it. */
function bus(audio: AudioContext): GainNode {
	if (!master) {
		master = audio.createGain();
		master.gain.value = LEVEL;
		master.connect(audio.destination);
	}
	return master;
}

/** One second of white noise, generated once and re-read at random offsets. */
function noiseSource(audio: AudioContext): AudioBufferSourceNode {
	if (!noiseBuffer) {
		const length = audio.sampleRate;
		noiseBuffer = audio.createBuffer(1, length, audio.sampleRate);
		const data = noiseBuffer.getChannelData(0);
		for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
	}
	const source = audio.createBufferSource();
	source.buffer = noiseBuffer;
	source.loop = true;
	return source;
}

/**
 * Exponential decay with a time constant, the way the measurements are
 * expressed. `exponentialRampToValueAtTime` interpolates exponentially, so
 * ramping to `peak * e^(-dur/tau)` reproduces e^(-t/tau) exactly.
 */
function decay(param: AudioParam, peak: number, tau: number, dur: number, at: number): void {
	param.setValueAtTime(peak, at);
	param.exponentialRampToValueAtTime(Math.max(peak * Math.exp(-dur / tau), 1e-5), at + dur);
}

type Hit = {
	/** total scheduled length in seconds */
	dur: number;
	/** bandpass centre for the noise burst, Hz */
	noise: number;
	/** bandpass Q */
	q?: number;
	/** noise peak gain */
	noiseGain: number;
	/** noise decay time constant, seconds */
	noiseTau: number;
	/** body sweep, Hz */
	from: number;
	to: number;
	/** body peak gain */
	bodyGain: number;
	/** body decay time constant, seconds */
	bodyTau: number;
	/** seconds to wait before the hit starts */
	at?: number;
	/** ± fraction of random detune applied to every frequency */
	drift?: number;
};

function hit(shape: Hit): void {
	const audio = context();
	if (!audio) return;

	const {
		dur,
		noise,
		q = 1,
		noiseGain,
		noiseTau,
		from,
		to,
		bodyGain,
		bodyTau,
		at = 0,
		drift = 0
	} = shape;

	const start = audio.currentTime + at;
	// The audio clock stalls while the context is starting, so a hit landing
	// on top of the last one is not a rhythm — it is the queue unblocking.
	if (start < lastStart + MIN_GAP) return;
	lastStart = start;

	// A real keyboard never hits the same note twice.
	const wobble = 1 + (Math.random() * 2 - 1) * drift;
	const end = start + dur;

	const out = bus(audio);

	// the click
	const source = noiseSource(audio);
	const band = audio.createBiquadFilter();
	const noiseAmp = audio.createGain();
	band.type = 'bandpass';
	band.frequency.setValueAtTime(noise * wobble, start);
	band.Q.setValueAtTime(q, start);
	decay(noiseAmp.gain, noiseGain, noiseTau, dur, start);
	source.connect(band).connect(noiseAmp).connect(out);
	source.start(start, Math.random() * 0.9);
	source.stop(end);

	// the thump: a sawtooth carries every harmonic, which is what the
	// reference spectrum shows (133 / 200 / 267 / 367 Hz — all of them, not
	// just the odd ones).
	const osc = audio.createOscillator();
	const bodyAmp = audio.createGain();
	osc.type = 'sawtooth';
	osc.frequency.setValueAtTime(from * wobble, start);
	osc.frequency.exponentialRampToValueAtTime(to * wobble, end);
	decay(bodyAmp.gain, bodyGain, bodyTau, dur, start);
	osc.connect(bodyAmp).connect(out);
	osc.start(start);
	osc.stop(end);

	osc.onended = () => {
		source.disconnect();
		band.disconnect();
		noiseAmp.disconnect();
		osc.disconnect();
		bodyAmp.disconnect();
	};
}

function persist(value: boolean): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
	} catch {
		// Private mode, or storage blocked entirely. The toggle still works
		// for this visit; it just will not be remembered.
	}
}

export const audio = {
	get enabled(): boolean {
		return enabled;
	},

	/**
	 * Read the remembered preference. Called after mount, never during SSR,
	 * so the server and the first client render always agree on `false`.
	 */
	restore(): void {
		if (!browser) return;
		try {
			enabled = localStorage.getItem(STORAGE_KEY) === 'on';
		} catch {
			enabled = false;
		}
	},

	toggle(): void {
		enabled = !enabled;
		persist(enabled);
		// Confirm by ear, not just by label — and this is also the gesture
		// that unlocks the context for everything after it.
		if (enabled) this.select();
	},

	/**
	 * A character appeared. Rate-gated: several lines can be typing at once
	 * and each runs far faster than a real terminal, so the gate is what
	 * turns that into one machine typing.
	 */
	type(): void {
		if (!enabled) return;
		const now = performance.now();
		if (now - lastKey < KEY_INTERVAL) return;
		lastKey = now;

		hit({
			dur: 0.03,
			noise: 1900,
			q: 1,
			noiseGain: 0.03,
			noiseTau: 0.003,
			from: 150,
			to: 70,
			bodyGain: 0.027,
			bodyTau: 0.004,
			drift: 0.07
		});
	},

	/** cursor moved to another menu row — the same key, struck harder */
	move(): void {
		if (!enabled) return;
		lastKey = performance.now();
		hit({
			dur: 0.04,
			noise: 2400,
			q: 0.9,
			noiseGain: 0.05,
			noiseTau: 0.004,
			from: 220,
			to: 90,
			bodyGain: 0.04,
			bodyTau: 0.006,
			drift: 0.04
		});
	},

	/**
	 * A screen was opened: a switch throwing, then the contact landing.
	 *
	 * Two dry ticks, the second brighter and quieter. Nothing glides — the
	 * terminal's own UI clicks were measured at a wide bandpass around
	 * 1.8 kHz with barely any bass under them, and a falling pitch is what
	 * makes a sound cartoon rather than mechanical.
	 */
	select(): void {
		if (!enabled) return;
		lastKey = performance.now();
		hit({
			dur: 0.05,
			noise: 1800,
			q: 0.5,
			noiseGain: 0.055,
			noiseTau: 0.004,
			from: 130,
			to: 130,
			bodyGain: 0.012,
			bodyTau: 0.008
		});
		hit({
			at: 0.055,
			dur: 0.05,
			noise: 3800,
			q: 0.35,
			noiseGain: 0.035,
			noiseTau: 0.005,
			from: 130,
			to: 130,
			bodyGain: 0.005,
			bodyTau: 0.006
		});
	},

	/** back out of a screen: one tick, the same switch released — duller */
	back(): void {
		if (!enabled) return;
		lastKey = performance.now();
		hit({
			dur: 0.07,
			noise: 1000,
			q: 0.5,
			noiseGain: 0.055,
			noiseTau: 0.007,
			from: 110,
			to: 110,
			bodyGain: 0.013,
			bodyTau: 0.012
		});
	}
};
