<script lang="ts">
	import { SYSTEM } from '$lib/data/content';
</script>

<div class="mark">
	<span class="mark__over">{SYSTEM.wordmarkTop}</span>
	<span class="mark__name" data-text={SYSTEM.wordmark}>{SYSTEM.wordmark}</span>
</div>

<style>
	.mark {
		position: relative;
		display: inline-block;
		padding-top: 1.15em;
		user-select: none;
	}

	.mark__over {
		position: absolute;
		top: 0;
		left: 0.1em;
		font-family: var(--display);
		font-weight: 400;
		font-size: 0.82em;
		letter-spacing: 0.36em;
		color: rgba(190, 200, 195, 0.55);
		text-shadow: none;
	}

	.mark__name {
		position: relative;
		display: block;
		font-family: var(--display);
		font-weight: 800;
		font-size: clamp(1.7rem, 3.4vw, 2.6rem);
		line-height: 0.9;
		letter-spacing: -0.02em;
		color: var(--mark);
		text-shadow:
			0 0 12px color-mix(in srgb, var(--mark) 45%, transparent),
			2px 0 0 color-mix(in srgb, var(--mark) 35%, transparent);
	}

	/* chromatic fringe, the way a shadow mask smears a misconverged channel */
	.mark__name::before {
		content: attr(data-text);
		position: absolute;
		inset: 0;
		color: rgba(255, 140, 110, 0.26);
		translate: -2px 0;
		mix-blend-mode: screen;
		pointer-events: none;
	}
</style>
