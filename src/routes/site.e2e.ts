import { expect, test, type Page } from '@playwright/test';

/** Fails the test on any console warning/error — hydration mismatches land here. */
function watchConsole(page: Page) {
	const messages: string[] = [];
	page.on('console', (m) => {
		if (m.type() === 'warning' || m.type() === 'error') messages.push(`${m.type()}: ${m.text()}`);
	});
	page.on('pageerror', (e) => messages.push(`pageerror: ${e.message}`));
	return messages;
}

test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	for (const [url, text] of [
		['/?screen=menu', 'CAPABILITY MATRIX'],
		['/?screen=identity', 'DESIGNATION'],
		['/?screen=archive&entry=crt-ui', 'CRT-UI — SVELTE 5 COMPONENTS'],
		['/?screen=transmission', 'GITHUB']
	]) {
		test(`${url} is readable from SSR`, async ({ page }) => {
			await page.goto(url);
			await expect(page.locator('body')).toContainText(text);
		});
	}
});

test('a deep link skips boot', async ({ page }) => {
	const messages = watchConsole(page);
	await page.goto('/?screen=capabilities');

	await expect(page.locator('.boot')).toHaveCount(0);
	await expect(page).toHaveTitle(/^CAPABILITY MATRIX/);
	expect(messages).toEqual([]);
});

test('keyboard drives the whole site', async ({ page }) => {
	const messages = watchConsole(page);
	await page.goto('/');

	await expect(page.locator('.boot')).toHaveCount(1);
	await expect(page.getByRole('navigation', { name: 'Main menu' })).toBeVisible({
		timeout: 15_000
	});

	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/screen=capabilities/);

	await page.keyboard.press('Escape');
	await expect(page).toHaveURL(/screen=menu/);
	await expect(page.locator('.boot')).toHaveCount(0);

	await page.keyboard.press('3');
	await expect(page).toHaveURL(/screen=archive$/);
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/entry=keuangan/);

	await page.keyboard.press('Escape');
	await expect(page).toHaveURL(/screen=archive$/);

	await page.goBack();
	await expect(page).toHaveURL(/entry=keuangan/);

	expect(messages).toEqual([]);
});

test('transmission: Tab and arrows agree on focus', async ({ page }) => {
	await page.goto('/?screen=transmission');

	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	const focused = page.locator(':focus');
	await expect(focused).toHaveCSS('outline-style', 'solid');

	await page.keyboard.press('ArrowDown');
	expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('A');
});

test.describe('reduced motion', () => {
	test.use({ reducedMotion: 'reduce' });

	test('no sweep, no flicker, nothing typing', async ({ page }) => {
		await page.goto('/?screen=identity');

		await expect(page.locator('.crt__sweep')).toHaveCSS('display', 'none');
		await expect(page.locator('.crt__flicker')).toHaveCSS('animation-name', 'none');
		await expect(page.locator('.crt-caret:not(.crt-caret--blink)')).toHaveCount(0);
	});
});

test('speaker: muted until asked, then remembered', async ({ page }) => {
	const messages = watchConsole(page);
	await page.goto('/?screen=menu');
	const toggle = page.locator('.head__audio');

	await expect(toggle).toHaveAttribute('aria-pressed', 'false');

	await page.keyboard.press('s');
	await expect(toggle).toHaveAttribute('aria-pressed', 'true');

	await page.reload();
	await expect(toggle).toHaveAttribute('aria-pressed', 'true');

	expect(messages).toEqual([]);
});
