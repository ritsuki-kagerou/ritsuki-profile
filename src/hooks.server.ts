import type { Handle } from '@sveltejs/kit';

// Headers the CSP in vite.config.ts does not cover. HSTS lives at Cloudflare.
const HEADERS: Record<string, string> = {
	'Permissions-Policy':
		'accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()',
	'Cross-Origin-Opener-Policy': 'same-origin'
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	for (const [name, value] of Object.entries(HEADERS)) response.headers.set(name, value);
	return response;
};
