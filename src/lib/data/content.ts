export const PROFILE = {
	name: 'Ritsuki',
	role: 'Full stack developer',
	city: 'Malang',
	country: 'Indonesia',
	timezone: 'UTC+07:00',
	email: 'ritsuki.kagerou@gmail.com',
	github: 'RitsukiKagerou',
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
	/** `<meta name="description">` — what search results and link previews show. */
	description: `${PROFILE.name} — ${PROFILE.role.toLowerCase()} in ${PROFILE.city}, ${PROFILE.country}. Backend, infrastructure and self-hosted systems. Open for freelance work.`
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
