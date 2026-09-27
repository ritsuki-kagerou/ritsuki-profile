<script lang="ts">
	import { SYSTEM } from '$lib/data/content';
	import { Typed } from '@ritsuki.kagerou/crt-ui';
	import Wordmark from './Wordmark.svelte';
</script>

<header class="head">
	<div class="head__row">
		<p class="head__sys">
			<Typed text={`${SYSTEM.unit} // ${SYSTEM.line}`} speed={16} />
		</p>
		<div class="head__mark"><Wordmark /></div>
	</div>
	<div class="head__meta">
		<p class="head__manifest u-dim">{SYSTEM.manifest}</p>
		<!-- TODO bab 13: tombol speaker [S] -->
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
