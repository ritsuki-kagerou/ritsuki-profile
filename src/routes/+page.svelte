<script lang="ts">
	import {
		PROFILE,
		SYSTEM,
		MENU,
		BOOT_LINES,
		IDENTITY,
		CAPABILITIES,
		TOOLCHAIN,
		ARCHIVE,
		TRANSMISSION,
		STATUS,
		UI
	} from '$lib/data/content';
	import { Meter, ScreenFrame, Typed } from '@ritsuki.kagerou/crt-ui';

	// uji dependency Typed
	let lineIdx = $state(0);
</script>

<svelte:head>
	<title>{SYSTEM.unit} — debug content.ts</title>
	<meta name="description" content={SYSTEM.description} />
</svelte:head>

<main class="u-shell">
	<ScreenFrame
		title="CRT-UI SMOKE TEST"
		code={`${UI.sector} 00/0${MENU.length}`}
		footer={SYSTEM.footer}
	>
		<p>
			<Typed text={BOOT_LINES[lineIdx]} speed={24} hold />
		</p>
		<button onclick={() => (lineIdx = (lineIdx + 1) % BOOT_LINES.length)}>[NEXT LINE]</button>
		{#each CAPABILITIES.slice(0, 3) as cap, i (cap.code)}
			<Meter value={[1, 0.6, 0.3][i]} label={cap.label} delay={300 + i * 120} />
		{/each}
	</ScreenFrame>

	<h1>{SYSTEM.wordmarkTop} {SYSTEM.wordmark}</h1>
	<p>{SYSTEM.unit} // {SYSTEM.line}</p>
	<p>{SYSTEM.manifest}</p>

	<h2>PROFILE</h2>
	<dl>
		{#each Object.entries(PROFILE) as [key, value] (key)}
			<dt>{key}</dt>
			<dd>{value}</dd>
		{/each}
	</dl>

	<h2>BOOT_LINES</h2>
	<ol>
		{#each BOOT_LINES as line, i (i)}
			<li>{line || '(baris kosong)'}</li>
		{/each}
	</ol>

	<h2>MENU</h2>
	<p>{UI.menuHint}</p>
	<ol>
		{#each MENU as item (item.id)}
			<li><code>?screen={item.id}</code> — {item.label} — {item.blurb}</li>
		{/each}
	</ol>

	<h2>[1] {IDENTITY.title}</h2>
	<dl>
		{#each IDENTITY.records as record (record.key)}
			<dt>{record.key}</dt>
			<dd>{record.value}{record.tone ? ` (tone: ${record.tone})` : ''}</dd>
		{/each}
	</dl>
	{#each IDENTITY.body as para, i (i)}
		<p>{para}</p>
	{/each}
	<ul>
		{#each IDENTITY.marks as mark (mark.label)}
			<li>{mark.label} — {mark.detail}</li>
		{/each}
	</ul>

	<h2>[2] CAPABILITIES</h2>
	<ul>
		{#each CAPABILITIES as cap (cap.code)}
			<li>{cap.code} {cap.label} [{cap.tier}] — {cap.spec}</li>
		{/each}
	</ul>
	<p>{UI.capabilities.toolchain}: {TOOLCHAIN.join(' / ')}</p>

	<h2>[3] ARCHIVE</h2>
	<p>{UI.archive.columns.join(' | ')}</p>
	<ul>
		{#each ARCHIVE as entry (entry.id)}
			<li>
				<code>?screen=archive&entry={entry.id}</code> — {entry.code}
				{entry.title} / {entry.year} / {entry.status}
				<br />{UI.archive.stack}: {entry.stack.join(', ')}
				<br />{UI.archive.metrics}: {entry.metrics.map((m) => `${m.key} = ${m.value}`).join(' · ')}
			</li>
		{/each}
	</ul>

	<h2>[4] {TRANSMISSION.title}</h2>
	<ul>
		{#each [...TRANSMISSION.channels, ...TRANSMISSION.offDuty.channels] as ch (ch.code)}
			<li>{ch.code} {ch.label} — <a href={ch.href}>{ch.handle}</a> ({ch.note})</li>
		{/each}
	</ul>
	{#if TRANSMISSION.terminal}
		<p>{TRANSMISSION.terminal.label}: <code>$ {TRANSMISSION.terminal.command}</code></p>
	{:else}
		<p>(terminal: null — seksinya disembunyikan)</p>
	{/if}
	<p>{TRANSMISSION.outro}</p>

	<h2>[5] {STATUS.title}</h2>
	<p>{STATUS.loopLabel}: {STATUS.stages.map((s) => s.label).join(' → ')} ↺</p>
	<dl>
		{#each [...STATUS.readouts, ...STATUS.credits] as row (row.key)}
			<dt>{row.key}</dt>
			<dd>{row.value}</dd>
		{/each}
	</dl>

	<h2>UI</h2>
	<p>{UI.back} · {UI.backToIndex} · {UI.listHint} · {UI.sector} 01/0{MENU.length}</p>
	<p>{UI.speaker.label}: {UI.speaker.on} / {UI.speaker.off}</p>

	<footer>{SYSTEM.footer}</footer>
</main>
