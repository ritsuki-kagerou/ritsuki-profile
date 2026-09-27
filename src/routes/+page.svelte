<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import { BOOT_LINES, MENU, SYSTEM, UI, type ScreenId } from '$lib/data/content';
	import { Boot, ScreenFrame, Typed } from '@ritsuki.kagerou/crt-ui';
	import { audio } from '$lib/audio.svelte';
	import { theme } from '$lib/theme.svelte';

	import Header from '$lib/components/Header.svelte';
	import Menu from '$lib/components/Menu.svelte';

	import Identity from '$lib/screens/Identity.svelte';
	import Capabilities from '$lib/screens/Capabilities.svelte';
	import Archive from '$lib/screens/Archive.svelte';
	import Transmission from '$lib/screens/Transmission.svelte';
	import Status from '$lib/screens/Status.svelte';

	const IDS = MENU.map((m) => m.id);

	let screenParam = $derived(page.url.searchParams.get('screen'));
	let entryParam = $derived(page.url.searchParams.get('entry'));

	let current = $derived(IDS.includes(screenParam as ScreenId) ? (screenParam as ScreenId) : null);

	let booted = $state(false);
	let showBoot = $derived(!booted && screenParam === null);

	let cursor = $state(0);

	// Runs after hydration, so SSR and the first client render agree that the
	// speaker is off; a remembered "on" is applied a tick later.
	$effect(() => {
		audio.restore();
		theme.restore();
	});

	// Keyboard and mouse both move the cursor, so it lives here, not in Menu.
	function moveCursor(next: number) {
		if (next === cursor) return;
		cursor = next;
		audio.move();
	}

	let active = $derived(MENU.find((m) => m.id === current) ?? null);
	let title = $derived(
		active ? `${active.label} — ${SYSTEM.unit}` : `${SYSTEM.unit} — ${SYSTEM.wordmark}`
	);

	function navigate(query: string) {
		goto(`?${query}`, { noScroll: true, keepFocus: true });
	}

	function open(id: ScreenId) {
		cursor = IDS.indexOf(id);
		audio.select();
		navigate(`screen=${id}`);
	}

	function toMenu() {
		navigate('screen=menu');
	}

	function openEntry(id: string) {
		navigate(`screen=archive&entry=${id}`);
	}

	function back() {
		if (current === 'archive' && entryParam) {
			audio.back();
			navigate('screen=archive');
		} else if (current) {
			audio.back();
			toMenu();
		}
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.metaKey || event.ctrlKey || event.altKey) return;

		const target = event.target as HTMLElement | null;
		if (target?.closest('input, textarea, [contenteditable="true"]')) return;

		const key = event.key;

		// Global, even during boot, where the log advertises it. Boot still
		// treats it as "any key", so it both enables the speaker and moves on.
		if (key === 's' || key === 'S') {
			event.preventDefault();
			audio.toggle();
			return;
		}

		if (key === 't' || key === 'T') {
			event.preventDefault();
			theme.cycle();
			audio.select();
			return;
		}

		if (showBoot) return;

		if (current) {
			if (key === 'Escape' || key === 'Backspace' || key === 'ArrowLeft') {
				event.preventDefault();
				back();
			}
			return;
		}

		if (key === 'ArrowDown' || key === 'j') {
			event.preventDefault();
			moveCursor((cursor + 1) % MENU.length);
		} else if (key === 'ArrowUp' || key === 'k') {
			event.preventDefault();
			moveCursor((cursor - 1 + MENU.length) % MENU.length);
		} else if (key === 'Enter' || key === ' ') {
			event.preventDefault();
			open(MENU[cursor].id);
		} else if (/^[1-9]$/.test(key)) {
			const index = Number(key) - 1;
			if (index < MENU.length) {
				event.preventDefault();
				open(MENU[index].id);
			}
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={SYSTEM.description} />
</svelte:head>

<svelte:window {onkeydown} />

<main class="u-shell">
	{#if showBoot}
		<Boot
			lines={BOOT_LINES}
			unit={SYSTEM.unit}
			ontick={audio.type}
			ondone={() => {
				booted = true;
			}}
		/>
	{:else if current}
		{#key `${current}:${entryParam ?? ''}`}
			<div class="flick">
				<ScreenFrame
					title={active?.label ?? ''}
					code={`${UI.sector} ${String(IDS.indexOf(current) + 1).padStart(2, '0')}/${String(MENU.length).padStart(2, '0')}`}
					hint={current === 'archive' && entryParam ? UI.backToIndex : UI.back}
					footer={SYSTEM.footer}
					ontick={audio.type}
					onback={back}
				>
					{#if current === 'identity'}
						<Identity />
					{:else if current === 'capabilities'}
						<Capabilities />
					{:else if current === 'archive'}
						<Archive entryId={entryParam} onopen={openEntry} />
					{:else if current === 'transmission'}
						<Transmission />
					{:else if current === 'status'}
						<Status />
					{/if}
				</ScreenFrame>
			</div>
		{/key}
	{:else}
		<div class="flick">
			<Header />
			<Menu selected={cursor} onselect={open} onhover={moveCursor} />
			<p class="hint u-dim">
				<Typed text={UI.menuHint} speed={22} delay={900} ontick={audio.type} hold />
			</p>
		</div>
	{/if}
</main>

<style>
	.hint {
		margin-top: clamp(1.5rem, 5vh, 3rem);
		font-size: 0.9em;
		letter-spacing: 0.2em;
	}

	/* tube re-sync when a new screen is drawn */
	.flick {
		animation: sync 260ms ease-out;
	}

	@keyframes sync {
		0% {
			opacity: 0.1;
			filter: brightness(2.4) blur(1px);
			scale: 1 0.985;
		}
		40% {
			opacity: 1;
			filter: brightness(1.1);
		}
		100% {
			filter: none;
			scale: 1 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.flick {
			animation: none;
		}
	}
</style>
