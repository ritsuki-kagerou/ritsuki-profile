import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// SSR is needed at request time: the screen lives in the query string
			// (`?screen=identity`), which a prerendered page cannot read.
			adapter: adapter(),

			// Nonce per request (SSR only), also applied to the theme script in app.html.
			// Styles need 'unsafe-inline' for Svelte's style: directives and style attributes.
			csp: {
				mode: 'nonce',
				directives: {
					'default-src': ['none'],
					'script-src': ['self'],
					'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
					'font-src': ['self', 'https://fonts.gstatic.com'],
					'img-src': ['self', 'data:'],
					'connect-src': ['self'],
					'media-src': ['self', 'data:', 'blob:'],
					'manifest-src': ['self'],
					'object-src': ['none'],
					'base-uri': ['none'],
					'form-action': ['self'],
					'frame-ancestors': ['none']
				}
			}
		})
	]
});
