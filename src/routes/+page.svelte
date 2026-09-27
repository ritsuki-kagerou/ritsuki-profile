<script lang="ts">
	import { BOOT_LINES, MENU, SYSTEM, type ScreenId } from '$lib/data/content';
</script>

<p>{BOOT_LINES}</p>

<h1>{SYSTEM.wordmark}</h1>
<ul>
	{#each MENU as item (item.id)}
		<li>{item.label} — {item.blurb}</li>
	{/each}
</ul>
