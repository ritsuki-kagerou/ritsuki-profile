/**
 * Motion. On by default; [M] turns it off for this site, on top of whatever
 * the OS says — never the other way round. Off is `<html data-crt-motion="off">`,
 * the switch crt-ui reads: the tube stops sweeping and flickering, lines
 * arrive whole, meters fill at once. The site's own animations read the same
 * attribute in their styles.
 *
 * Like the theme, the attribute is applied by an inline script in app.html
 * before first paint, so a remembered "off" never starts moving first. This
 * module only mirrors that state for the UI and changes it on request.
 */

import { browser } from '$app/environment';

/** Keep in sync with the inline script in app.html. */
const STORAGE_KEY = 'rkos.motion';

let enabled = $state(true);

function apply(value: boolean): void {
	if (!browser) return;
	const root = document.documentElement;
	if (value) delete root.dataset.crtMotion;
	else root.dataset.crtMotion = 'off';
	try {
		if (value) localStorage.removeItem(STORAGE_KEY);
		else localStorage.setItem(STORAGE_KEY, 'off');
	} catch {
		// Storage blocked: the setting still applies for this visit.
	}
}

export const motion = {
	get enabled(): boolean {
		return enabled;
	},

	/**
	 * Read back what app.html already applied. Called after mount, so SSR and
	 * the first client render agree on the default.
	 */
	restore(): void {
		if (!browser) return;
		enabled = document.documentElement.dataset.crtMotion !== 'off';
	},

	toggle(): void {
		enabled = !enabled;
		apply(enabled);
	}
};
