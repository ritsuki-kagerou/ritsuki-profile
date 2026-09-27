<script lang="ts">
	import { ARCHIVE, UI } from '$lib/data/content';
	import { Typed } from '@ritsuki.kagerou/crt-ui';

	type Props = {
		entryId: string | null;
		onopen: (id: string) => void;
	};

	let { entryId, onopen }: Props = $props();

	let cursor = $state(0);
	let entry = $derived(ARCHIVE.find((e) => e.id === entryId) ?? null);

	function onkeydown(event: KeyboardEvent) {
		if (entry) return;
		const key = event.key;
		if (key === 'ArrowDown' || key === 'j') {
			event.preventDefault();
			cursor = (cursor + 1) % ARCHIVE.length;
		} else if (key === 'ArrowUp' || key === 'k') {
			event.preventDefault();
			cursor = (cursor - 1 + ARCHIVE.length) % ARCHIVE.length;
		} else if (key === 'Enter' || key === ' ') {
			event.preventDefault();
			onopen(ARCHIVE[cursor].id);
		}
	}
</script>

<svelte:window {onkeydown} />

{#if entry}
	<article class="detail">
		<div class="detail__head">
			<p class="u-dim">{entry.code} / {entry.year} / {entry.role}</p>
			<h2 class="detail__title u-hot">
				<Typed text={entry.title} speed={20} />
			</h2>
		</div>

		<div class="detail__grid">
			<div class="detail__body">
				{#each entry.body as para, i (i)}
					<p><Typed text={para} speed={3} delay={360 + i * 400} /></p>
				{/each}
			</div>

			<aside class="detail__side">
				<div class="side__block">
					<h3 class="u-label u-dim">{UI.archive.metrics}</h3>
					<ul>
						{#each entry.metrics as m (m.key)}
							<li><span class="u-dim">{m.key}</span><span class="u-hot">{m.value}</span></li>
						{/each}
					</ul>
				</div>
				<div class="side__block">
					<h3 class="u-label u-dim">{UI.archive.stack}</h3>
					<ul class="side__chips">
						{#each entry.stack as s (s)}
							<li>{s}</li>
						{/each}
					</ul>
				</div>
				<div class="side__block">
					<h3 class="u-label u-dim">{UI.archive.status}</h3>
					<p class:u-amber={entry.status === 'ACTIVE'} class:u-hot={entry.status !== 'ACTIVE'}>
						[{entry.status}]
					</p>
				</div>
				{#if entry.href}
					<div class="side__block">
						<h3 class="u-label u-dim">{UI.archive.demo}</h3>
						<!-- leaves the terminal, so it leaves in its own tab -->
						<a class="side__link u-hot" href={entry.href} target="_blank" rel="noopener noreferrer">
							{entry.href.replace(/^https?:\/\//, '')} ›
						</a>
					</div>
				{/if}
			</aside>
		</div>
	</article>
{:else}
	<div class="list">
		<div class="list__head u-dim">
			{#each UI.archive.columns as col (col)}<span>{col}</span>{/each}
		</div>
		<ul>
			{#each ARCHIVE as item, i (item.id)}
				<li>
					<button
						class="entry"
						class:entry--on={i === cursor}
						onmouseenter={() => (cursor = i)}
						onfocus={() => (cursor = i)}
						onclick={() => onopen(item.id)}
					>
						<span class="entry__code">{item.code}</span>
						<span class="entry__name">
							<Typed text={item.title} speed={16} delay={120 + i * 100} />
							<em class="entry__sum">{item.summary}</em>
						</span>
						<span class="entry__year">{item.year}</span>
						<span class="entry__status">[{item.status}]</span>
					</button>
				</li>
			{/each}
		</ul>
		<p class="list__hint u-dim">{UI.listHint}</p>
	</div>
{/if}

<style>
	/* --- index ------------------------------------------------------- */
	.list {
		display: grid;
		gap: 0.75rem;
	}

	.list__head,
	.entry {
		display: grid;
		grid-template-columns: 5rem minmax(0, 1fr) 6.5rem 8rem;
		gap: 1rem;
		align-items: baseline;
	}

	.list__head {
		padding: 0 0.9rem 0.4rem;
		font-family: var(--display);
		font-size: 0.78em;
		letter-spacing: 0.16em;
		border-bottom: 1px solid var(--rule);
	}

	.entry {
		width: 100%;
		padding: 0.7rem 0.9rem;
		border-bottom: 1px solid rgba(74, 222, 128, 0.1);
		transition: background 90ms linear;
	}

	.entry--on {
		background: var(--bar);
		color: #04170c;
		text-shadow: none;
	}

	.entry__code,
	.entry__year,
	.entry__status {
		font-size: 0.88em;
		letter-spacing: 0.12em;
		color: var(--phos-mid);
	}

	.entry--on .entry__code,
	.entry--on .entry__year,
	.entry--on .entry__status {
		color: rgba(4, 23, 12, 0.72);
	}

	.entry__name {
		display: grid;
		gap: 0.1rem;
		font-family: var(--display);
		font-weight: 700;
		font-size: 0.95em;
		letter-spacing: 0.08em;
		color: var(--phos-hot);
	}

	.entry--on .entry__name {
		color: #04170c;
	}

	.entry__sum {
		font-family: var(--mono);
		font-weight: 400;
		font-style: normal;
		font-size: 0.88em;
		letter-spacing: 0.03em;
		color: var(--phos-dim);
	}

	.entry--on .entry__sum {
		color: rgba(4, 23, 12, 0.66);
	}

	.list__hint {
		font-size: 0.86em;
		letter-spacing: 0.18em;
	}

	/* --- detail ------------------------------------------------------ */
	.detail {
		display: grid;
		gap: 1.6rem;
	}

	.detail__head {
		display: grid;
		gap: 0.35rem;
	}

	.detail__title {
		font-family: var(--display);
		font-weight: 800;
		font-size: clamp(1.1rem, 2.2vw, 1.5rem);
		letter-spacing: 0.04em;
	}

	.detail__grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(220px, 18rem);
		gap: clamp(1.5rem, 5vw, 3rem);
		align-items: start;
	}

	.detail__body {
		display: grid;
		gap: 1.1rem;
		max-width: 66ch;
		color: var(--phos-mid);
	}

	.detail__side {
		display: grid;
		gap: 1.3rem;
		padding: 1.1rem 1.2rem;
		border: 1px solid var(--rule);
		background: rgba(74, 222, 128, 0.025);
	}

	.side__block {
		display: grid;
		gap: 0.45rem;
	}

	.side__link {
		letter-spacing: 0.06em;
		transition: opacity 120ms linear;
	}

	.side__link:hover,
	.side__link:focus-visible {
		opacity: 0.7;
	}

	.side__block ul {
		display: grid;
		gap: 0.25rem;
	}

	.side__block li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-size: 0.9em;
		letter-spacing: 0.08em;
	}

	.side__block ul.side__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.side__block ul.side__chips li {
		padding: 0.15rem 0.5rem;
		border: 1px solid var(--rule);
		font-size: 0.82em;
		letter-spacing: 0.12em;
		color: var(--phos-mid);
	}

	@media (max-width: 860px) {
		.detail__grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.list__head,
		.entry {
			grid-template-columns: 4.5rem minmax(0, 1fr);
		}
		.list__head span:nth-child(3),
		.list__head span:nth-child(4),
		.entry__year,
		.entry__status {
			display: none;
		}
	}
</style>
