<script lang="ts">
	import { STATUS, UI } from '$lib/data/content';
	import { Typed } from '@ritsuki.kagerou/crt-ui';
</script>

<div class="st">
	<section class="st__loop">
		<h2 class="u-label u-dim">{STATUS.loopLabel}</h2>
		<ol class="st__stages">
			{#each STATUS.stages as stage, i (stage.label)}
				<li class="stage" style:--i={i}>
					<span class="stage__n u-dim">{String(i + 1).padStart(2, '0')}</span>
					<span class="stage__rail" aria-hidden="true"><span class="stage__node"></span></span>
					<span class="stage__label u-hot">
						<Typed text={stage.label} speed={16} delay={140 + i * 90} />
					</span>
					<span class="stage__note u-dim">{stage.note}</span>
				</li>
			{/each}
		</ol>
		<p class="st__return">
			<span class="st__elbow" aria-hidden="true"></span>
			<span class="st__back">
				<span class="st__arrow" aria-hidden="true">↺</span>{STATUS.loopNote}
			</span>
		</p>
	</section>

	<div class="st__panes">
		<section class="pane">
			<h2 class="u-label u-dim">{UI.status.readout}</h2>
			<ul>
				{#each STATUS.readouts as r (r.key)}
					<li><span class="u-dim">{r.key}</span><span class="u-hot">{r.value}</span></li>
				{/each}
				<!-- TODO bab 13: baris SPEAKER (ENABLED / MUTED) -->
			</ul>
		</section>

		<section class="pane">
			<h2 class="u-label u-dim">{UI.status.manifest}</h2>
			<ul>
				{#each STATUS.credits as c (c.key)}
					<li><span class="u-dim">{c.key}</span><span class="u-hot">{c.value}</span></li>
				{/each}
			</ul>
		</section>
	</div>
</div>

<style>
	.st {
		display: grid;
		gap: 2.25rem;
	}

	.st__loop {
		display: grid;
		--rail: 1.25rem;
	}

	.st__loop h2 {
		margin-bottom: 0.9rem;
	}

	.st__stages {
		display: grid;
	}

	.stage {
		display: grid;
		grid-template-columns: 2.5rem var(--rail) minmax(0, 11rem) minmax(0, 1fr);
		gap: 1rem;
		align-items: center;
		padding-block: 0.28rem;
		font-size: 0.95em;
		letter-spacing: 0.1em;
	}

	.stage__n {
		font-variant-numeric: tabular-nums;
	}

	.stage__rail {
		position: relative;
		grid-column: 2;
		grid-row: 1 / -1;
		align-self: stretch;
		display: grid;
		place-items: center;
	}

	.stage__rail::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 1px;
		translate: -0.5px 0;
		background: var(--rule);
		transform-origin: top center;
		animation: rail-draw 420ms ease-out backwards;
		animation-delay: calc(140ms + var(--i) * 90ms);
	}

	.stage:first-child .stage__rail::before {
		top: 50%;
	}

	.stage__node {
		position: relative;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--bar);
		box-shadow: 0 0 9px rgba(30, 224, 124, 0.45);
		animation: node-in 420ms ease-out backwards;
		animation-delay: calc(140ms + var(--i) * 90ms);
	}

	@keyframes rail-draw {
		from {
			scale: 1 0;
		}
	}

	@keyframes node-in {
		from {
			scale: 0;
		}
	}

	.stage__label {
		font-family: var(--display);
		font-weight: 700;
		font-size: 0.9em;
		letter-spacing: 0.12em;
	}

	.stage__note {
		font-size: 0.9em;
		letter-spacing: 0.04em;
	}

	.st__return {
		display: grid;
		grid-template-columns: 2.5rem var(--rail) minmax(0, 1fr);
		gap: 1rem;
		align-items: center;
		min-height: 2.1rem;
		font-size: 0.88em;
		letter-spacing: 0.14em;
		color: var(--phos-mid);
	}

	.st__elbow {
		grid-column: 2;
		align-self: stretch;
		position: relative;
	}

	.st__elbow::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 50%;
		right: -0.9rem;
		border-left: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		border-bottom-left-radius: 8px;
		translate: -0.5px 0;
		transform-origin: top center;
		animation: rail-draw 420ms ease-out backwards;
		animation-delay: 680ms;
	}

	.st__back {
		grid-column: 3;
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
	}

	.st__arrow {
		color: var(--bar);
		font-size: 1.15em;
		animation: spin-hint 3.4s ease-in-out infinite;
	}

	@keyframes spin-hint {
		0%,
		70%,
		100% {
			opacity: 0.45;
		}
		80% {
			opacity: 1;
		}
	}

	.st__panes {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	.pane {
		display: grid;
		gap: 0.7rem;
		padding: 1.1rem 1.2rem 1.3rem;
		background: #000;
	}

	.pane ul {
		display: grid;
		gap: 0.3rem;
	}

	.pane li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-size: 0.9em;
		letter-spacing: 0.08em;
	}

	@media (max-width: 860px) {
		.st__loop {
			--rail: 1rem;
		}
		.stage {
			grid-template-columns: 2.2rem var(--rail) minmax(0, 1fr);
			gap: 0.15rem 0.7rem;
			align-items: baseline;
			padding-block: 0.4rem;
		}
		.stage__rail {
			grid-row: 1 / span 2;
		}
		.stage__note {
			grid-column: 3;
		}
		.st__return {
			grid-template-columns: 2.2rem var(--rail) minmax(0, 1fr);
			gap: 0.7rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stage__rail::before,
		.stage__node,
		.st__elbow::before,
		.st__arrow {
			animation: none;
		}
	}
</style>
