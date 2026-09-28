import { ORIGIN, sitemapPaths } from '$lib/seo';

export const prerender = true;

export function GET() {
	const urls = sitemapPaths()
		.map((path) => `\t<url><loc>${(ORIGIN + path).replace(/&/g, '&amp;')}</loc></url>`)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
