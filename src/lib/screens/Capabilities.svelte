<script lang="ts">
	import { CAPABILITIES, TOOLCHAIN, UI, type Tier } from '$lib/data/content';
	import { Meter, Typed } from '@ritsuki.kagerou/crt-ui';
	import { audio } from '$lib/audio.svelte';

	const FILL: Record<Tier, number> = {
		PRIMARY: 1,
		WORKING: 0.6,
		LEARNING: 0.3
	};
</script>

<div class="cap">
	<div class="cap__grid">
		{#each CAPABILITIES as cap, i (cap.code)}
			<article class="card" style:--i={i}>
				<span class="card__code u-dim">{cap.code}</span>
				<h2 class="card__label u-hot">
					<Typed text={cap.label} speed={18} delay={100 + i * 120} ontick={audio.type} />
				</h2>
				<p class="card__spec u-dim">{cap.spec}</p>
				<Meter
					value={FILL[cap.tier]}
					label={cap.tier}
					muted={cap.tier !== 'PRIMARY'}
					delay={400 + i * 120}
				/>
			</article>
		{/each}
	</div>

	<section class="chain">
		<h2 class="u-label u-dim">{UI.capabilities.toolchain}</h2>
		<ul>
			{#each TOOLCHAIN as tool, i (tool)}
				<li style:--i={i}>{tool}</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.cap {
		display: grid;
		gap: 2rem;
	}

	.cap__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 21rem), 1fr));
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	.card {
		display: grid;
		gap: 0.6rem;
		padding: 1.1rem 1.2rem 1.3rem;
		background: #000;
		transition: background 140ms linear;
	}

	.card:hover {
		background: rgba(74, 222, 128, 0.05);
	}

	.card__code {
		font-size: 0.82em;
		letter-spacing: 0.16em;
	}

	.card__label {
		font-family: var(--display);
		font-weight: 700;
		font-size: 1em;
		letter-spacing: 0.1em;
	}

	.card__spec {
		font-size: 0.92em;
		min-height: 3.2em;
		text-wrap: pretty;
	}

	.chain {
		display: grid;
		gap: 0.8rem;
	}

	.chain ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chain li {
		padding: 0.22rem 0.65rem;
		border: 1px solid var(--rule);
		font-size: 0.86em;
		letter-spacing: 0.14em;
		color: var(--phos-mid);
		animation: chip-in 240ms ease-out backwards;
		animation-delay: calc(700ms + var(--i) * 45ms);
	}

	@keyframes chip-in {
		from {
			opacity: 0;
			translate: 0 4px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.chain li {
			animation: none;
		}
	}
</style>
