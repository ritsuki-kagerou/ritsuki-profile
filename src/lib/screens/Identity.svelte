<script lang="ts">
	import { IDENTITY } from '$lib/data/content';
	import { Typed } from '@ritsuki.kagerou/crt-ui';
	import { audio } from '$lib/audio.svelte';
</script>

<div class="id">
	<div class="id__side">
		<figure class="portrait">
			<div class="portrait__tube">
				<img
					src={IDENTITY.portrait.src}
					alt={IDENTITY.portrait.alt}
					width="640"
					height="640"
					loading="lazy"
				/>
			</div>
			<figcaption class="u-label u-dim">{IDENTITY.portrait.label}</figcaption>
		</figure>

		<div class="id__records">
			{#each IDENTITY.records as rec, i (rec.key)}
				<div class="rec">
					<span class="rec__key u-dim">{rec.key}</span>
					<span class="rec__dots"></span>
					<span class="rec__val" class:rec__val--ok={rec.tone === 'ok'}>
						<Typed text={rec.value} speed={16} delay={120 + i * 90} ontick={audio.type} />
					</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="id__body">
		{#each IDENTITY.body as para, i (i)}
			<p>
				<Typed text={para} speed={3} delay={500 + i * 420} ontick={audio.type} />
			</p>
		{/each}

		<ul class="id__marks">
			{#each IDENTITY.marks as mark, i (mark.label)}
				<li>
					<span class="u-label u-hot">{mark.label}</span>
					<span class="u-dim">{mark.detail}</span>
					<span class="id__marker" style:--i={i}></span>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.id {
		display: grid;
		grid-template-columns: minmax(240px, 22rem) minmax(0, 1fr);
		gap: clamp(1.5rem, 5vw, 3.5rem);
		align-items: start;
	}

	.id__side {
		display: grid;
		gap: 1rem;
	}

	.portrait {
		display: grid;
		gap: 0.5rem;
		margin: 0;
	}

	.portrait__tube {
		position: relative;
		aspect-ratio: 1;
		border: 1px solid var(--rule);
		background: var(--bg);
		overflow: hidden;
	}

	.portrait__tube img {
		display: block;
		width: 100%;
		height: 100%;
		filter: grayscale(1) contrast(1.35) brightness(1.25);
		transition: filter 240ms ease;
	}

	.portrait__tube::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--phos);
		mix-blend-mode: multiply;
		pointer-events: none;
		transition: opacity 240ms ease;
	}

	.portrait:hover .portrait__tube img {
		filter: none;
	}

	.portrait:hover .portrait__tube::after {
		opacity: 0;
	}

	.id__records {
		display: grid;
		gap: 0.35rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--rule);
		background: color-mix(in srgb, var(--phos) 2.5%, transparent);
	}

	.rec {
		display: grid;
		grid-template-columns: minmax(0, auto) minmax(0.75rem, 1fr) minmax(0, auto);
		align-items: center;
		gap: 0.5rem;
		font-size: 0.92em;
		letter-spacing: 0.08em;
	}

	.rec__key {
		font-family: var(--display);
		font-weight: 400;
		font-size: 0.86em;
		letter-spacing: 0.12em;
	}

	.rec__dots {
		height: 1px;
		background: repeating-linear-gradient(90deg, var(--phos-faint) 0 2px, transparent 2px 5px);
	}

	.rec__val {
		color: var(--phos-hot);
		font-weight: 500;
	}

	.rec__val--ok {
		color: var(--accent);
		text-shadow: 0 0 4px color-mix(in srgb, var(--accent) 45%, transparent);
	}

	.id__body {
		display: grid;
		gap: 1.15rem;
		max-width: 68ch;
	}

	.id__body p {
		color: var(--phos-mid);
		text-wrap: pretty;
	}

	.id__marks {
		display: grid;
		gap: 0.5rem;
		margin-top: 0.5rem;
		padding-top: 1.1rem;
		border-top: 1px solid var(--rule);
	}

	.id__marks li {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.9rem;
		padding-left: 1.4rem;
	}

	.id__marker {
		position: absolute;
		left: 0;
		top: 0.55em;
		width: 0.5rem;
		height: 0.5rem;
		background: var(--bar);
		box-shadow: 0 0 8px color-mix(in srgb, var(--bar) 60%, transparent);
		animation: mark-blink 2.6s steps(1, end) infinite;
		animation-delay: calc(var(--i) * 320ms);
	}

	@keyframes mark-blink {
		0%,
		72% {
			opacity: 1;
		}
		76%,
		100% {
			opacity: 0.25;
		}
	}

	@media (max-width: 860px) {
		.id {
			grid-template-columns: minmax(0, 1fr);
		}

		.portrait {
			max-width: 14rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.id__marker {
			animation: none;
		}

		.portrait__tube img,
		.portrait__tube::after {
			transition: none;
		}
	}

	:global([data-crt-motion='off']) .id__marker {
		animation: none;
	}

	:global([data-crt-motion='off']) .portrait__tube img,
	:global([data-crt-motion='off']) .portrait__tube::after {
		transition: none;
	}
</style>
