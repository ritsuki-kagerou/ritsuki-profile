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

test.describe('for crawlers', () => {
	test.use({ javaScriptEnabled: false });

	test('the boot page links to every screen', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toHaveText(/full stack developer/i);
		const index = page.getByRole('navigation', { name: 'Site index' });
		await expect(index.locator('a[href="?screen=archive"]')).toHaveCount(1);
		await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
	});

	test('the menu and archive rows are real links', async ({ page }) => {
		await page.goto('/?screen=archive');
		await expect(page.locator('a[href="?screen=archive&entry=keuangan"]')).toHaveCount(1);
		await page.goto('/?screen=menu');
		await expect(page.locator('a[href="?screen=identity"]')).toHaveCount(1);
	});

	for (const [url, canonical] of [
		['/', 'https://ritsuki.dev/'],
		['/?screen=menu', 'https://ritsuki.dev/'],
		['/?screen=nope', 'https://ritsuki.dev/'],
		['/?screen=identity&x=1', 'https://ritsuki.dev/?screen=identity'],
		['/?screen=archive&entry=crt-ui', 'https://ritsuki.dev/?screen=archive&entry=crt-ui'],
		['/?screen=archive&entry=nope', 'https://ritsuki.dev/?screen=archive']
	]) {
		test(`${url} is canonical at ${canonical}`, async ({ page }) => {
			await page.goto(url);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
		});
	}

	test('sitemap.xml lists every screen and entry', async ({ request }) => {
		const res = await request.get('/sitemap.xml');
		expect(res.ok()).toBe(true);
		expect(res.headers()['content-type']).toContain('xml');
		const xml = await res.text();
		expect(xml).toContain('<loc>https://ritsuki.dev/</loc>');
		expect(xml).toContain('<loc>https://ritsuki.dev/?screen=status</loc>');
		expect(xml).toContain('<loc>https://ritsuki.dev/?screen=archive&amp;entry=pilih-in</loc>');
	});
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

	test('beacons do not blink', async ({ page }) => {
		await page.goto('/?screen=menu');
		await expect(page.locator('.head__audio')).toHaveCSS('animation-name', 'none');
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

test('beacons blink a few times, then stop', async ({ page }) => {
	const beacon = (selector: string) =>
		page.evaluate(
			(selector) =>
				document
					.querySelector(selector)
					?.getAnimations()
					.filter((a) => (a as CSSAnimation).animationName === 'beacon')
					.map((a) => a.playState)
					.join(',') || 'none',
			selector
		);

	await page.goto('/?screen=menu');
	const toggle = page.locator('.head__audio');
	await expect(toggle).toHaveClass(/u-beacon/);
	expect(await beacon('.head__audio')).toBe('running');
	await expect.poll(() => beacon('.head__audio'), { timeout: 6_000 }).toBe('none');

	// once per page load: coming back to the menu does not blink again
	await page.keyboard.press('1');
	await page.keyboard.press('Escape');
	await expect(page).toHaveURL(/screen=menu/);
	await expect(toggle).not.toHaveClass(/u-beacon/);

	await page.goto('/?screen=archive&entry=crt-ui');
	await expect(page.locator('.side__link')).toHaveClass(/u-beacon/);
	await expect.poll(() => beacon('.side__link'), { timeout: 6_000 }).toBe('none');
});

test('the speaker beacon stops once the speaker is on', async ({ page }) => {
	await page.goto('/?screen=menu');
	await page.keyboard.press('s');
	await expect(page.locator('.head__audio')).not.toHaveClass(/u-beacon/);
});

test('theme: green by default, T cycles, remembered before first paint', async ({ page }) => {
	const messages = watchConsole(page);
	const attr = () => page.evaluate(() => document.documentElement.dataset.theme ?? 'green');
	const phos = () =>
		page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue('--phos').trim()
		);

	await page.goto('/?screen=menu');
	const toggle = page.getByRole('button', { name: /THEME:/ });
	await expect(toggle).toContainText('GREEN');
	expect(await attr()).toBe('green');
	expect(await phos()).toBe('#4ade80');

	await page.keyboard.press('t');
	await expect(toggle).toContainText('AMBER');
	expect(await attr()).toBe('amber');
	expect(await phos()).toBe('#ffb000');

	// applied by the inline script in app.html, before the app hydrates
	await page.reload({ waitUntil: 'domcontentloaded' });
	expect(await attr()).toBe('amber');
	await expect(toggle).toContainText('AMBER');

	await toggle.click();
	await expect(toggle).toContainText('WHITE');
	await page.keyboard.press('t');
	await expect(toggle).toContainText('GREEN');
	expect(await attr()).toBe('green');
	expect(await page.evaluate(() => localStorage.getItem('rkos.theme'))).toBeNull();

	expect(messages).toEqual([]);
});
