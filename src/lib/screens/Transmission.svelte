<script lang="ts">
	import { TRANSMISSION, UI } from '$lib/data/content';
	import ChannelRow from '$lib/components/ChannelRow.svelte';
	import { Typed } from '@ritsuki.kagerou/crt-ui';

	let root = $state<HTMLDivElement | null>(null);

	function step(delta: number) {
		const links = [...(root?.querySelectorAll('a') ?? [])];
		if (!links.length) return;

		const here = links.indexOf(document.activeElement as HTMLAnchorElement);
		const next =
			here === -1
				? delta > 0
					? 0
					: links.length - 1
				: (here + delta + links.length) % links.length;

		links[next].focus();
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.metaKey || event.ctrlKey || event.altKey) return;

		const key = event.key;
		if (key === 'ArrowDown' || key === 'j') {
			event.preventDefault();
			step(1);
		} else if (key === 'ArrowUp' || key === 'k') {
			event.preventDefault();
			step(-1);
		}
	}
</script>

<svelte:window {onkeydown} />

<div class="tx" bind:this={root}>
	<div class="tx__intro">
		{#each TRANSMISSION.intro as para, i (i)}
			<p><Typed text={para} speed={4} delay={200 + i * 400} /></p>
		{/each}
	</div>

	<ul class="tx__list">
		{#each TRANSMISSION.channels as ch, i (ch.label)}
			<li><ChannelRow channel={ch} delay={260 + i * 110} /></li>
		{/each}
	</ul>

	<section class="off">
		<header class="off__head">
			<h2 class="u-label u-dim">{TRANSMISSION.offDuty.label}</h2>
			<span class="off__note u-dim">{TRANSMISSION.offDuty.note}</span>
		</header>
		<ul class="tx__list tx__list--dashed">
			{#each TRANSMISSION.offDuty.channels as ch, i (ch.label)}
				<li><ChannelRow channel={ch} delay={700 + i * 110} muted /></li>
			{/each}
		</ul>
	</section>

	{#if TRANSMISSION.terminal}
		{@const card = TRANSMISSION.terminal}
		<section class="card">
			<header class="card__head">
				<h2 class="u-label u-dim">{card.label}</h2>
				<span class="card__note u-dim">{card.note}</span>
			</header>
			<a class="card__cmd" href={card.href} target="_blank" rel="me noopener noreferrer">
				<span class="card__prompt u-dim" aria-hidden="true">$</span>
				<code class="u-hot"><Typed text={card.command} speed={40} delay={900} hold /></code>
			</a>
		</section>
	{/if}

	<p class="tx__hint u-dim">{UI.listHint}</p>

	<p class="tx__outro u-dim">{TRANSMISSION.outro}</p>
</div>

<style>
	.card {
		display: grid;
		gap: 0.6rem;
		padding: 1rem 1.1rem 1.15rem;
		border: 1px solid var(--rule);
	}

	.card__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem 1rem;
		justify-content: space-between;
	}

	.card__note {
		font-size: 0.9em;
		letter-spacing: 0.08em;
	}

	.card__cmd {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		font-size: 1.02em;
		letter-spacing: 0.1em;
		transition: opacity 120ms linear;
	}

	.card__cmd:hover,
	.card__cmd:focus-visible {
		opacity: 0.7;
	}

	.card__prompt {
		color: var(--bar);
	}

	.tx {
		display: grid;
		gap: 1.75rem;
	}

	.tx__intro p {
		max-width: 72ch;
		color: var(--phos-mid);
		text-wrap: pretty;
	}

	.tx__list {
		display: grid;
		border-top: 1px solid var(--rule);
	}

	.tx__list--dashed {
		border-top-style: dashed;
	}

	.off {
		display: grid;
		gap: 0.7rem;
		margin-top: 0.25rem;
	}

	.off__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.9rem;
	}

	.off__note {
		font-size: 0.85em;
		letter-spacing: 0.1em;
	}

	.tx__hint {
		margin-top: -0.9rem;
		font-size: 0.85em;
		letter-spacing: 0.18em;
	}

	.tx__outro {
		font-size: 0.92em;
		letter-spacing: 0.06em;
	}
</style>
