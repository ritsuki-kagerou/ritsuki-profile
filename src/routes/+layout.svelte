<script lang="ts">
	import '@ritsuki.kagerou/crt-ui/tokens.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Crt } from '@ritsuki.kagerou/crt-ui';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<Crt />
