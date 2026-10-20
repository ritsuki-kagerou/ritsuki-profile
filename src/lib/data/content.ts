import portrait from '$lib/assets/portrait.webp';

export const PROFILE = {
	name: 'Ritsuki',
	role: 'Independent developer',
	tagline: 'Understanding Systems. Building Software.',
	city: 'East Java',
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
	description: `${PROFILE.name} — ${PROFILE.role.toLowerCase()} in ${PROFILE.city}, ${PROFILE.country}, exploring software, systems and ideas. Backend, infrastructure and self-hosted systems.`,
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
	{ id: 'transmission', label: 'TRANSMISSION', blurb: 'Mail, code and other places' },
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
		{ key: 'ESTABLISHED', value: '2026' },
		{ key: 'UPLINK', value: PROFILE.timezone },
		{ key: 'STATUS', value: 'BUILDING', tone: 'ok' as const }
	],
	body: [
		`${PROFILE.tagline} Independent developer exploring software, systems, and ideas — turning concepts into working projects. Most projects are built solo, from architecture and implementation to deployment and the ongoing work of keeping things running.`,
		'Prefers to understand how things work before using them, then find a simple way to make them work. Self-taught by habit — reads the source, traces problems to their roots, and values simplicity over unnecessary complexity. More interested in building something useful than making it look complicated.',
		"I've always been curious about how computers work, from the code we write to the systems running underneath. That curiosity has led me through software development, Linux, self-hosting, and the infrastructure that connects everything."
	],
	marks: [
		{ label: 'LINUX & SELF-HOSTING', detail: 'runs its own infrastructure' },
		{ label: 'HOMELAB TINKERER', detail: 'experiments locally, deploys deliberately' },
		{ label: 'CURIOUS BY DEFAULT', detail: 'prefers understanding over assumptions' }
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
		spec: 'PostgreSQL for core data, Valkey for caching, ClickHouse for analytics. Schema design, indexing, and query optimization.',
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
		spec: 'Task automation, log analysis, debugging, and systematic root-cause investigation.',
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
		id: 'dochi-vote',
		code: 'AR-01',
		title: 'DOCHI VOTE — VOTING PLATFORM',
		year: 'OCT 2026',
		role: 'FULL STACK, SOLO',
		status: 'ACTIVE',
		summary:
			'Vote, compare, argue — a public voting platform for Indonesian users, live at vote.dochi.id.',
		body: [
			'A voting and comparison platform: see a question, vote, see the result, read the argument, add to it. Authors can attach images and a colour to each side, and a moderation queue keeps reported content in check. SvelteKit on the surface, Go and Gin behind it, PostgreSQL and Valkey underneath, with images stored on Cloudflare R2.',
			'Built for Indonesians who like to pick a side, from everyday either-or questions to head-to-head matchups. You can vote without an account, and signing up later keeps everything you already voted on. Results appear once you have voted, so nobody just follows the crowd, and every comparison comes with a thread to argue it out.',
			'Made to be easy to start and hard to cheat: one person gets one vote, and the numbers you see are always counted on the server. Reported content goes to a moderation queue. It is live at vote.dochi.id, part of the dochi.id family.'
		],
		stack: ['GO', 'GIN', 'SVELTEKIT', 'POSTGRESQL', 'VALKEY', 'CLOUDFLARE R2'],
		metrics: [
			{ key: 'SERVICES', value: '6 IN COMPOSE' },
			{ key: 'CREW', value: 'SOLO' },
			{ key: 'STATE', value: 'LIVE' }
		],
		href: 'https://vote.dochi.id'
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

export type ChannelIcon = 'mail' | 'github' | 'x' | 'steam';

export type Channel = {
	code: string;
	icon: ChannelIcon;
	label: string;
	handle: string;
	href: string;
	note: string;
};

export const TRANSMISSION = {
	title: 'TRANSMISSION',
	intro: ['Mail is the fastest route. Code lives on GitHub; shorter thoughts end up on X.'],
	channels: [
		{
			code: 'TX-01',
			icon: 'mail',
			label: 'MAIL',
			handle: PROFILE.email,
			href: `mailto:${PROFILE.email}`,
			note: 'Primary relay'
		},
		{
			code: 'TX-02',
			icon: 'github',
			label: 'GITHUB',
			handle: `@${PROFILE.github}`,
			href: `https://github.com/${PROFILE.github}`,
			note: 'Source manifest'
		},
		{
			code: 'TX-03',
			icon: 'x',
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
				icon: 'steam',
				label: 'STEAM',
				handle: '/id/_Ritsuki_',
				href: 'https://steamcommunity.com/id/_Ritsuki_/',
				note: 'Co-op welcome'
			}
		] satisfies Channel[]
	},
	terminal: null as TerminalCard | null,
	outro: `Based in ${PROFILE.city}, ${PROFILE.timezone}.`
};

/* --- [5] SYSTEM STATUS ----------------------------------------------- */

export const STATUS = {
	title: 'SYSTEM STATUS',
	loopLabel: 'OPERATING LOOP',
	loopNote: '06 RETURNS TO 01 — REPEAT WITH WHAT YOU LEARNED',
	stages: [
		{ label: 'UNDERSTAND', note: 'read the source, not the summary' },
		{ label: 'BUILD', note: 'smallest thing that can work' },
		{ label: 'BREAK', note: 'on purpose, before production does' },
		{ label: 'DEBUG', note: 'read the logs, follow the trace' },
		{ label: 'FIX', note: 'the root cause, not the symptom' },
		{ label: 'OPTIMIZE', note: 'only once there are numbers' }
	],
	readouts: [
		{ key: 'CURRENT FOCUS', value: 'DOCHI VOTE / KEUANGAN' },
		{ key: 'WORK MODE', value: 'SOLO' },
		{ key: 'LOCATION', value: BASE },
		{ key: 'TIMEZONE', value: PROFILE.timezone }
	],
	credits: [
		{ key: 'INTERFACE', value: 'SVELTEKIT 2 / SVELTE 5' },
		{ key: 'COMPONENTS', value: '@RITSUKI.KAGEROU/CRT-UI' },
		{ key: 'TYPEFACE', value: 'GEIST MONO / MARTIAN MONO' },
		{ key: 'PALETTE', value: 'PHOSPHOR 4ADE80' },
		{ key: 'DESIGN INFLUENCE', value: 'NOSTROMO.DESIGN' }
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
