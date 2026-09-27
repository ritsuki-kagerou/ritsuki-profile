<script lang="ts" module>
	let hinted = false;
</script>

<script lang="ts">
	import { SYSTEM, UI } from '$lib/data/content';
	import { Typed } from '@ritsuki.kagerou/crt-ui';
	import { audio } from '$lib/audio.svelte';
	import Wordmark from './Wordmark.svelte';

	let hint = $state(false);

	$effect(() => {
		if (hinted) return;
		hinted = true;
		hint = true;
	});
</script>

<header class="head">
	<div class="head__row">
		<p class="head__sys">
			<Typed text={`${SYSTEM.unit} // ${SYSTEM.line}`} speed={16} ontick={audio.type} />
		</p>
		<div class="head__mark"><Wordmark /></div>
	</div>
	<div class="head__meta">
		<p class="head__manifest u-dim">{SYSTEM.manifest}</p>
		<button
			class="head__audio"
			class:head__audio--on={audio.enabled}
			class:u-beacon={hint && !audio.enabled}
			style:--beacon-delay="1.2s"
			aria-pressed={audio.enabled}
			onclick={() => audio.toggle()}
		>
			<span class="u-dim">[S]</span>
			{UI.speaker.label}: {audio.enabled ? UI.speaker.on : UI.speaker.off}
		</button>
	</div>
	<hr class="u-rule" />
</header>

<style>
	.head {
		display: grid;
		gap: 0.6rem;
	}

	.head__row {
		display: flex;
		align-items: center;
		gap: clamp(1rem, 4vw, 2.5rem);
		min-height: 3.4rem;
	}

	.head__sys {
		font-family: var(--display);
		font-weight: 700;
		font-size: 0.92em;
		letter-spacing: 0.1em;
		color: var(--phos-hot);
	}

	.head__mark {
		padding-left: clamp(1rem, 3vw, 2rem);
		border-left: 1px solid var(--rule);
	}

	.head__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.4rem 1.5rem;
	}

	.head__manifest {
		font-size: 0.95em;
		letter-spacing: 0.12em;
	}

	.head__audio {
		font-size: 0.88em;
		letter-spacing: 0.16em;
		color: var(--phos-mid);
		transition: color 120ms linear;
	}

	.head__audio:hover {
		color: var(--phos-hot);
	}

	.head__audio--on {
		color: var(--bar);
		text-shadow: 0 0 6px color-mix(in srgb, var(--bar) 55%, transparent);
	}

	@media (max-width: 640px) {
		.head__row {
			flex-direction: column;
			align-items: flex-start;
			gap: 1.1rem;
		}
		.head__mark {
			padding-left: 0;
			border-left: 0;
		}
	}
</style>
