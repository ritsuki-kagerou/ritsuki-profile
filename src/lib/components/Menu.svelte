<script lang="ts">
	import { MENU, type ScreenId } from '$lib/data/content';
	import { Typed } from '@ritsuki.kagerou/crt-ui';

	type Props = {
		selected: number;
		onselect: (id: ScreenId) => void;
		onhover: (index: number) => void;
	};

	let { selected, onselect, onhover }: Props = $props();
</script>

<nav class="menu" aria-label="Main menu">
	<ul>
		{#each MENU as item, i (item.id)}
			<li>
				<button
					class="row"
					class:row--on={i === selected}
					aria-current={i === selected ? 'true' : undefined}
					onmouseenter={() => onhover(i)}
					onfocus={() => onhover(i)}
					onclick={() => onselect(item.id)}
				>
					<span class="row__caret">{i === selected ? '›' : ''}</span>
					<span class="row__num">[{i + 1}]</span>
					<span class="row__label">
						<Typed text={item.label} speed={22} delay={180 + i * 110} />
					</span>
					<span class="row__leader"></span>
					<span class="row__blurb">{item.blurb}</span>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.menu {
		margin-top: clamp(1.5rem, 4vh, 2.5rem);
	}

	.menu ul {
		display: grid;
		gap: 0.15rem;
	}

	.row {
		display: grid;
		grid-template-columns: 1.6rem 2.6rem minmax(0, auto) minmax(1.5rem, 1fr) minmax(0, auto);
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.55rem 0.9rem;
		font-family: var(--display);
		font-weight: 700;
		font-size: 0.95em;
		letter-spacing: 0.1em;
		transition: background 90ms linear;
	}

	.row--on {
		background: var(--bar);
		color: #04170c;
		text-shadow: none;
		box-shadow: 0 0 22px rgba(30, 224, 124, 0.35);
	}

	.row__caret {
		font-size: 1.1em;
	}

	.row__num {
		color: var(--phos-mid);
	}

	.row--on .row__num {
		color: rgba(4, 23, 12, 0.7);
	}

	.row__leader {
		height: 1px;
		background: repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 6px);
		opacity: 0.35;
	}

	.row__blurb {
		font-family: var(--mono);
		font-weight: 400;
		font-size: 0.92em;
		letter-spacing: 0.04em;
		color: var(--phos-dim);
		white-space: nowrap;
	}

	.row--on .row__blurb {
		color: rgba(4, 23, 12, 0.72);
	}

	@media (max-width: 720px) {
		.row {
			grid-template-columns: 1.2rem 2.4rem minmax(0, 1fr);
			gap: 0.5rem;
		}
		.row__leader,
		.row__blurb {
			display: none;
		}
	}
</style>
