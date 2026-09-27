/**
 * The phosphor. Every colour on the site derives from a handful of tokens in
 * app.css; a theme is `<html data-theme="…">` swapping those tokens. Green is
 * the default and carries no attribute at all.
 *
 * The attribute is applied by an inline script in app.html before first
 * paint, so a remembered theme never flashes green first. This module only
 * mirrors that state for the UI and changes it on request.
 */

import { browser } from '$app/environment';

export const THEMES = ['green', 'amber', 'white'] as const;
export type Theme = (typeof THEMES)[number];

/** Keep in sync with the inline script in app.html. */
const STORAGE_KEY = 'rkos.theme';

let current = $state<Theme>('green');

function apply(value: Theme): void {
	if (!browser) return;
	const root = document.documentElement;
	if (value === 'green') delete root.dataset.theme;
	else root.dataset.theme = value;
	try {
		if (value === 'green') localStorage.removeItem(STORAGE_KEY);
		else localStorage.setItem(STORAGE_KEY, value);
	} catch {
		// Storage blocked: the theme still applies for this visit.
	}
}

export const theme = {
	get current(): Theme {
		return current;
	},

	/**
	 * Read back what app.html already applied. Called after mount, so SSR and
	 * the first client render agree on the default.
	 */
	restore(): void {
		if (!browser) return;
		const value = document.documentElement.dataset.theme;
		current = THEMES.includes(value as Theme) ? (value as Theme) : 'green';
	},

	cycle(): void {
		current = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
		apply(current);
	}
};
