// Renders scripts/og.html to static/og.png (the og:image). Run with `pnpm og`.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const source = new URL('./og.html', import.meta.url);
const target = fileURLToPath(new URL('../static/og.png', import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

await page.goto(source.href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: target });

await browser.close();
console.log(`wrote ${target}`);
