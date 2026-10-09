import portrait from '$lib/assets/portrait.webp';

export const PROFILE = {
	name: 'Ritsuki',
	role: 'Full stack developer',
	city: 'Malang',
	country: 'Indonesia',
	timezone: 'UTC+07:00',
	email: 'ritsuki.kagerou@gmail.com',
	github: 'ritsuki-kagerou',
	x: 'RitsukiKagerou'
} as const;

const NAME = PROFILE.name.toUpperCase();
const BASE = `${PROFILE.city}, ${PROFILE.country}`.toUpperCase();
const TZ_SHORT = PROFILE.timezone.replace(/:00$/, '');

const SYSTEM_UNIT = 'RK/OS 9000';

export type ScreenId = 'identity' | 'capabilities' | 'archive' | 'transmission' | 'status';

export type MenuEntry = {
	id: ScreenId;
	label: string;
	blurb: string;
};

export const SYSTEM = {
	unit: SYSTEM_UNIT,
	line: `${PROFILE.city.toUpperCase()} ${TZ_SHORT} // LINK ACTIVE`,
	wordmarkTop: 'PERSONAL',
	wordmark: NAME,
	manifest: `CARRIER ${NAME} // MANIFEST 001`,
	footer: `${SYSTEM_UNIT} SERIES / PERSONAL BROADCAST UNIT`,
	description: `${PROFILE.name} — ${PROFILE.role.toLowerCase()} in ${PROFILE.city}, ${PROFILE.country}. Backend, infrastructure and self-hosted systems. Open for freelance work.`,
	site: 'ritsuki.dev',
	// search results show the title first: lead with who, then the terminal
	heading: `${PROFILE.name} — ${PROFILE.role}`,
	title: `${PROFILE.name} — ${PROFILE.role} · ${SYSTEM_UNIT}`,
	screenTitle: (label: string) => `${label} — ${PROFILE.name} · ${SYSTEM_UNIT}`,
	ogImageAlt: `${PROFILE.name}, ${PROFILE.role.toLowerCase()}: the ${SYSTEM_UNIT} terminal showing the wordmark, role and avatar in green phosphor.`
} as const;

export const MENU: MenuEntry[] = [
	{ id: 'identity', label: 'IDENTITY', blurb: 'Who is running this thing' },
	{ id: 'capabilities', label: 'CAPABILITY MATRIX', blurb: 'Where the depth actually is' },
	{ id: 'archive', label: 'WORK ARCHIVE', blurb: 'Systems built and kept running' },
	{ id: 'transmission', label: 'TRANSMISSION', blurb: 'Open for freelance work' },
	{ id: 'status', label: 'SYSTEM STATUS', blurb: 'How the work actually goes' }
];

export const BOOT_LINES = [
	`${SYSTEM_UNIT} SERIES — BIOS 04.71`,
	'MEMORY CHECK ............ 65536 KB OK',
	'PHOSPHOR ARRAY .......... CALIBRATED',
	'MOUNTING /DEV/MANIFEST .. OK',
	'DECRYPTING PERSONAL LOG . OK',
	'OPERATOR HANDSHAKE ...... ACCEPTED',
	'AUDIO SUBSYSTEM ......... [S] TO TOGGLE',
	'',
	'LOADING MANIFEST 001'
];

/* --- [1] IDENTITY ---------------------------------------------------- */

export const IDENTITY = {
	title: 'IDENTITY',
	portrait: {
		src: portrait,
		alt: `${PROFILE.name}'s avatar: an anime character with dark blue hair and wolf ears, looking back over one shoulder.`,
		label: 'OPERATOR IMAGE'
	},
	records: [
		{ key: 'DESIGNATION', value: NAME },
		{ key: 'ROLE', value: PROFILE.role.toUpperCase() },
		{ key: 'BASE', value: BASE },
		{ key: 'ACTIVE SINCE', value: '2026' },
		{ key: 'UPLINK', value: PROFILE.timezone },
		{ key: 'STATUS', value: 'OPEN FOR CONTRACT', tone: 'ok' as const }
	],
	body: [
		'Full stack developer. Builds applications, APIs and the systems that carry them — then keeps them running. Most of the work is solo: architecture, implementation, deployment, and the maintenance nobody volunteers for.',
		'Prefers to understand how a thing works before using it, then find the plainest way to make it work. Self-taught by habit — reads the source, traces a fault to its root, and distrusts complexity that exists only to look advanced. Would rather build the thing than sit in a meeting about building the thing.',
		'Got here out of curiosity about how computers actually work. That has not changed; only the scale has. Code, then servers, then Linux, then the whole machine and how its parts talk to each other.'
	],
	marks: [
		{ label: 'LINUX & SELF-HOSTING', detail: 'runs its own infrastructure' },
		{ label: 'HOMELAB TINKERER', detail: 'production is a bigger homelab' },
		{ label: 'CURIOUS BY DEFAULT', detail: 'reads the source, not the summary' }
	]
};

/* --- [2] CAPABILITY MATRIX ------------------------------------------- */

export type Tier = 'PRIMARY' | 'WORKING' | 'LEARNING';

export type Capability = {
	code: string;
	label: string;
	spec: string;
	tier: Tier;
};

export const CAPABILITIES: Capability[] = [
	{
		code: 'C-01',
		label: 'BACKEND & API',
		spec: 'REST APIs, authentication, business logic, service integration, and the shape of the backend itself.',
		tier: 'PRIMARY'
	},
	{
		code: 'C-02',
		label: 'INFRASTRUCTURE & SELF-HOSTING',
		spec: 'Docker and Compose, VPS, reverse proxies, Cloudflare, deployment, and a homelab that stays up.',
		tier: 'PRIMARY'
	},
	{
		code: 'C-03',
		label: 'DATABASE & DATA SYSTEMS',
		spec: 'PostgreSQL as the spine, Valkey for cache, ClickHouse for analytics. Schema, indexing, access paths.',
		tier: 'PRIMARY'
	},
	{
		code: 'C-04',
		label: 'LINUX & SYSTEM ADMIN',
		spec: 'Desktop and server: packages, services, storage, networking, permissions, logs, process management.',
		tier: 'PRIMARY'
	},
	{
		code: 'C-05',
		label: 'AUTOMATION & TROUBLESHOOTING',
		spec: 'Automating repeat work, and reading errors until the real root cause surfaces — not the first symptom.',
		tier: 'PRIMARY'
	},
	{
		code: 'C-06',
		label: 'FRONTEND DEVELOPMENT',
		spec: 'Web UI wired to APIs: state, data flow, responsive layout, and an architecture no larger than needed.',
		tier: 'WORKING'
	}
];

export const TOOLCHAIN = [
	'GO',
	'TYPESCRIPT',
	'JAVASCRIPT',
	'SVELTE',
	'POSTGRESQL',
	'CLICKHOUSE',
	'DOCKER',
	'DOCKER COMPOSE',
	'LINUX',
	'GIT',
	'CLOUDFLARE',
	'TRUENAS'
];

/* --- [3] WORK ARCHIVE ------------------------------------------------ */

export type ArchiveEntry = {
	id: string;
	code: string;
	title: string;
	year: string;
	role: string;
	status: 'SHIPPED' | 'ACTIVE' | 'ARCHIVED';
	summary: string;
	body: string[];
	stack: string[];
	metrics: { key: string; value: string }[];
	/** A live demo or docs site. Omit when there is nothing public to open. */
	href?: string;
};

export const ARCHIVE: ArchiveEntry[] = [
	{
		id: 'pilih-in',
		code: 'AR-01',
		title: 'PILIH-IN — VOTING PLATFORM',
		year: 'SEP 2026',
		role: 'FULL STACK, SOLO',
		status: 'ACTIVE',
		summary: 'Vote, compare, rank, argue — a public platform for Indonesian users.',
		body: [
			'A voting, comparison and ranking platform: see a question, vote, see the result, read the argument, add to it. SvelteKit on the surface, Go and Gin behind it, PostgreSQL and Valkey underneath, and Garage for S3-compatible image storage.',
			'One rule shapes the whole codebase — the server is authoritative, and no vote, identity or count is ever trusted from the client. Architectural decisions are written down before they are coded, and the documentation carries a hard size budget enforced by make: exceed it and you cut or merge, you do not raise the number.'
		],
		stack: ['GO', 'GIN', 'SVELTEKIT', 'POSTGRESQL', 'VALKEY'],
		metrics: [
			{ key: 'SERVICES', value: '6 IN COMPOSE' },
			{ key: 'CREW', value: 'SOLO' },
			{ key: 'STATE', value: 'PRE-LAUNCH' }
		]
	},
	{
		id: 'keuangan',
		code: 'AR-02',
		title: 'KEUANGAN — RECEIPT LEDGER',
		year: 'AUG 2026',
		role: 'FULL STACK, SOLO',
		status: 'ACTIVE',
		summary: 'Photograph a receipt in Telegram; local OCR and a local LLM do the rest.',
		body: [
			'Self-hosted personal finance with Telegram as the primary input. Photograph a receipt, a local OCR sidecar reads it, a local LLM extracts the fields against a JSON schema, and the bot asks for confirmation before anything reaches the ledger. No third-party AI service is involved at any step.',
			'Go and Gin behind SvelteKit, with PostgreSQL doing triple duty as database, job queue and session store — no Redis in the stack. Every receipt-derived transaction requires a human yes; nothing is auto-saved on a confidence score. Currently at foundation stage: the full stack comes up healthy on one command, domain features are the next phase.'
		],
		stack: ['GO', 'SVELTEKIT', 'POSTGRESQL', 'LLAMA.CPP', 'TELEGRAM'],
		metrics: [
			{ key: 'SERVICES', value: '9 IN COMPOSE' },
			{ key: 'AI PATH', value: 'FULLY LOCAL' },
			{ key: 'STAGE', value: 'FOUNDATION' }
		]
	},
	{
		id: 'subtitle-live',
		code: 'AR-03',
		title: 'SUBTITLE LIVE — JA → ID',
		year: 'JUL 2026',
		role: 'FULL STACK, SOLO',
		status: 'SHIPPED',
		summary: 'Live Japanese audio in, Indonesian subtitles out, all on one machine.',
		body: [
			'ffmpeg taps the PipeWire loopback and cuts roughly five-second chunks; a local speech model transcribes them; a local LLM translates, summarises on an interval, and explains cultural terms. The result streams to the browser over WebSocket as live subtitles.',
			'The interesting work is around the pipeline: silence-based cutting so sentences are not sliced in half, a queue so chunks cannot collide, searchable history with transcript export, furigana and romaji, click-a-word lookup, Anki export, a transparent theatre overlay, and speaker filtering so only one voice gets translated. Eleven phases, about 2,200 lines, three models sharing 8 GB of VRAM.'
		],
		stack: ['PYTHON', 'FASTAPI', 'WHISPER.CPP', 'LLAMA.CPP', 'SQLITE'],
		metrics: [
			{ key: 'PHASES', value: '11 SHIPPED' },
			{ key: 'APP CODE', value: '~2 200 LINES' },
			{ key: 'BUDGET', value: '3 MODELS / 8 GB' }
		]
	},
	{
		id: 'vault-index',
		code: 'AR-04',
		title: 'VAULT-INDEX — HYBRID SEARCH',
		year: 'AUG 2026',
		role: 'BACKEND, SOLO',
		status: 'SHIPPED',
		summary: 'Full-text and vector search over a note vault, exposed to an agent via MCP.',
		body: [
			'A search index over a personal Obsidian vault: full-text, metadata and vector similarity merged into a single hybrid ranking, then exposed to an AI agent through an MCP server with four tools.',
			'The Markdown files remain the only source of truth — the Postgres table is a mirror that can be dropped and rebuilt at any time, and nothing in the repo ever writes back into the vault. Indexing is incremental by content hash; embeddings come from a local llama.cpp server. Small, but it runs every day.'
		],
		stack: ['PYTHON', 'POSTGRESQL', 'PGVECTOR', 'MCP'],
		metrics: [
			{ key: 'GRANULARITY', value: '1 NOTE = 1 ROW' },
			{ key: 'RANKING', value: 'FTS + VECTOR' },
			{ key: 'EXPOSED', value: '4 MCP TOOLS' }
		]
	},
	{
		id: 'crt-ui',
		code: 'AR-05',
		title: 'CRT-UI — SVELTE 5 COMPONENTS',
		year: 'SEP 2026',
		role: 'LIBRARY, SOLO',
		status: 'SHIPPED',
		summary:
			'The five pieces every retro-terminal UI rewrites, plus the controls around them, published to npm.',
		body: [
			'A typewriter line, a CRT overlay, a segmented meter, a boot log and the frame around a screen — pulled out of this site once they stopped knowing anything about it, given an API, and published as @ritsuki.kagerou/crt-ui. This site is its first consumer. Since then it has grown the controls a terminal UI needs around them — button, input, select, table, dialog, tabs, dropdown and toasts — built on native elements and the WAI-ARIA patterns.',
			'The typewriter server-renders the finished line and only starts typing after hydration, so the server and the first client render agree by construction. That is tested rather than claimed: CI renders every component on the server, mounts its browser build and fails if the markup differs, then hydrates a real SvelteKit app in Chromium. Theming is --crt-* custom properties, and every animation respects reduced motion — or one data-crt-motion attribute, which is what [M] on this site flips.'
		],
		stack: ['SVELTE 5', 'TYPESCRIPT', 'VITEST', 'PLAYWRIGHT'],
		metrics: [
			{ key: 'COMPONENTS', value: '13' },
			{ key: 'RUNTIME DEPS', value: '0' },
			{ key: 'HYDRATION', value: 'TESTED IN CI' }
		],
		href: 'https://crt-ui.ritsuki.dev'
	}
];

/* --- [4] TRANSMISSION ------------------------------------------------ */

export type TerminalCard = {
	label: string;
	command: string;
	note: string;
	href: string;
};

export type Channel = {
	code: string;
	label: string;
	handle: string;
	href: string;
	note: string;
};

export const TRANSMISSION = {
	title: 'TRANSMISSION',
	intro: [
		'Open for freelance work — backend, infrastructure, or the whole stack when it is better handled by one person who understands all of it. Mail is the fastest route; the other channels are open too.'
	],
	channels: [
		{
			code: 'TX-01',
			label: 'MAIL',
			handle: PROFILE.email,
			href: `mailto:${PROFILE.email}`,
			note: 'Primary relay'
		},
		{
			code: 'TX-02',
			label: 'GITHUB',
			handle: `@${PROFILE.github}`,
			href: `https://github.com/${PROFILE.github}`,
			note: 'Source manifest'
		},
		{
			code: 'TX-03',
			label: 'X',
			handle: `@${PROFILE.x}`,
			href: `https://x.com/${PROFILE.x}`,
			note: 'Short burst'
		}
	] satisfies Channel[],
	offDuty: {
		label: 'OFF-DUTY',
		note: 'Not a work channel.',
		channels: [
			{
				code: 'OD-01',
				label: 'STEAM',
				handle: '/id/_Ritsuki_',
				href: 'https://steamcommunity.com/id/_Ritsuki_/',
				note: 'Co-op welcome'
			}
		] satisfies Channel[]
	},
	terminal: {
		label: 'TERMINAL CARD',
		command: 'npx ritsuki',
		note: 'The same manifest, printed in your shell.',
		href: `https://github.com/${PROFILE.github}/ritsuki-card`
	} as TerminalCard | null,
	outro: `Based in ${PROFILE.city}, ${PROFILE.timezone}. Remote by default.`
};

/* --- [5] SYSTEM STATUS ----------------------------------------------- */

export const STATUS = {
	title: 'SYSTEM STATUS',
	loopLabel: 'OPERATING LOOP',
	loopNote: '06 RETURNS TO 01 — THAT IS THE WHOLE METHOD',
	stages: [
		{ label: 'UNDERSTAND', note: 'read the source, not the summary' },
		{ label: 'BUILD', note: 'smallest thing that can work' },
		{ label: 'BREAK', note: 'on purpose, before production does' },
		{ label: 'DEBUG', note: 'read the logs, follow the trace' },
		{ label: 'FIX', note: 'the root cause, not the symptom' },
		{ label: 'OPTIMIZE', note: 'only once there are numbers' }
	],
	readouts: [
		{ key: 'AVAILABILITY', value: 'OPEN — FREELANCE' },
		{ key: 'WORK MODE', value: 'REMOTE / SOLO' },
		{ key: 'LOCATION', value: BASE },
		{ key: 'TIMEZONE', value: PROFILE.timezone }
	],
	credits: [
		{ key: 'INTERFACE', value: 'SVELTEKIT 2 / SVELTE 5' },
		{ key: 'COMPONENTS', value: '@RITSUKI.KAGEROU/CRT-UI' },
		{ key: 'TYPEFACE', value: 'GEIST MONO / MARTIAN MONO' },
		{ key: 'PALETTE', value: 'PHOSPHOR 4ADE80' },
		{ key: 'VISUAL DEBT', value: 'NOSTROMO.DESIGN' }
	]
};

/* --- INTERFACE ------------------------------------------------------- */

export const UI = {
	menuHint: `[1-${MENU.length}] / [UP-DN] / [ENTER] / [S] SPEAKER`,
	listHint: '[UP-DN] SELECT / [ENTER] OPEN',
	back: '[ESC] BACK',
	backToIndex: '[ESC] INDEX',
	sector: 'SECTOR',
	siteIndex: 'Site index',
	speaker: {
		label: 'SPEAKER',
		on: 'ON',
		off: 'OFF',
		enabled: 'ENABLED — [S]',
		muted: 'MUTED — [S]'
	},
	theme: {
		label: 'THEME',
		names: { amber: 'AMBER', green: 'GREEN', white: 'WHITE' }
	},
	motion: {
		label: 'MOTION',
		on: 'ON',
		off: 'OFF'
	},
	capabilities: { toolchain: 'SUBSYSTEMS' },
	archive: {
		metrics: 'METRICS',
		stack: 'STACK',
		status: 'STATUS',
		demo: 'LIVE DEMO',
		columns: ['CODE', 'DESIGNATION', 'BUILT', 'STATUS']
	},
	status: { readout: 'READOUT', manifest: 'BUILD MANIFEST' }
} as const;
