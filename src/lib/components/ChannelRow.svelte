<script lang="ts">
	import type { Channel } from '$lib/data/content';
	import { Typed } from '@ritsuki.kagerou/crt-ui';
	import { audio } from '$lib/audio.svelte';

	type Props = { channel: Channel; delay?: number; muted?: boolean };
	let { channel, delay = 0, muted = false }: Props = $props();

	let external = $derived(channel.href.startsWith('http'));
</script>

<a
	class="ch"
	class:ch--muted={muted}
	href={channel.href}
	target={external ? '_blank' : undefined}
	rel={external ? 'me noopener noreferrer' : undefined}
	onclick={audio.select}
>
	<span class="ch__code u-dim">{channel.code}</span>
	<span class="ch__label">
		<Typed text={channel.label} speed={18} {delay} ontick={audio.type} />
	</span>
	<span class="ch__handle">{channel.handle}</span>
	<span class="ch__note u-dim">{channel.note}</span>
	<span class="ch__go">›</span>
</a>

<style>
	.ch {
		display: grid;
		grid-template-columns: 5rem minmax(8rem, 14rem) minmax(0, 1fr) minmax(0, auto) 1.5rem;
		gap: 1rem;
		align-items: baseline;
		padding: 0.85rem 0.9rem;
		border-bottom: 1px solid color-mix(in srgb, var(--phos) 12%, transparent);
		transition:
			background 90ms linear,
			padding-left 140ms ease,
			opacity 140ms linear;
	}

	.ch:hover,
	.ch:focus-visible {
		background: color-mix(in srgb, var(--phos) 7%, transparent);
		padding-left: 1.5rem;
	}

	.ch--muted {
		opacity: 0.72;
	}

	.ch--muted:hover,
	.ch--muted:focus-visible {
		opacity: 1;
	}

	.ch__code,
	.ch__note {
		font-size: 0.85em;
		letter-spacing: 0.12em;
	}

	.ch__label {
		font-family: var(--display);
		font-weight: 700;
		font-size: 0.95em;
		letter-spacing: 0.14em;
	}

	.ch__handle {
		letter-spacing: 0.04em;
		color: var(--phos-hot);
	}

	.ch--muted .ch__handle {
		color: var(--phos);
	}

	.ch__go {
		text-align: right;
		color: var(--phos-dim);
		transition: translate 140ms ease;
	}

	.ch:hover .ch__go {
		color: var(--phos-hot);
		translate: 4px 0;
	}

	@media (max-width: 860px) {
		.ch {
			grid-template-columns: 4.5rem minmax(0, 1fr) 1.2rem;
		}
		.ch__handle {
			grid-column: 2;
		}
		.ch__note {
			display: none;
		}
	}
</style>
