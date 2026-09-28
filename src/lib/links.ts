/**
 * A left click with no modifier. Anything else (middle click, ctrl/cmd, shift)
 * is left to the browser, so a real link still opens in a new tab or window.
 */
export function isPlainClick(event: MouseEvent): boolean {
	return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
