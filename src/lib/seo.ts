import { ARCHIVE, MENU, PROFILE, SYSTEM, TRANSMISSION } from '$lib/data/content';

/** Fixed, so canonical URLs never depend on how the request reached the server. */
export const ORIGIN = `https://${SYSTEM.site}`;

/**
 * The one URL each view is indexed under. The menu (`?screen=menu`) is the
 * home page without the boot, and unknown screens or entries fall back to
 * their parent, so crawlers never see duplicates.
 */
export function canonicalPath(screen: string | null, entry: string | null): string {
	if (!MENU.some((m) => m.id === screen)) return '/';
	if (screen === 'archive' && ARCHIVE.some((a) => a.id === entry)) {
		return `/?screen=archive&entry=${entry}`;
	}
	return `/?screen=${screen}`;
}

/** Every indexable view, for sitemap.xml. */
export function sitemapPaths(): string[] {
	return [
		'/',
		...MENU.map((m) => canonicalPath(m.id, null)),
		...ARCHIVE.map((a) => canonicalPath('archive', a.id))
	];
}

/** schema.org Person, so a search for the name can resolve to this site. */
export function personJsonLd(): string {
	const sameAs = TRANSMISSION.channels
		.map((c) => c.href)
		.filter((href) => href.startsWith('https://'));

	const data = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: PROFILE.name,
		jobTitle: PROFILE.role,
		url: `${ORIGIN}/`,
		address: {
			'@type': 'PostalAddress',
			addressLocality: PROFILE.city,
			addressCountry: PROFILE.country
		},
		sameAs
	};

	// `<` escaped so the payload can never close its own <script>
	return JSON.stringify(data).replace(/</g, '\\u003c');
}
