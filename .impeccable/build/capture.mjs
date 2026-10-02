// Capture helper: node .impeccable/build/capture.mjs <url> <out.png> <width> <height> [plates-only] [full]
import { chromium } from 'playwright';
const [url, out, w = '1536', h = '1024', mode = '', full = ''] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
if (full === 'full') {
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForLoadState('networkidle');
}
await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
if (mode === 'plates-only') {
  await page.addStyleTag({ content: '.site-header > *, .hero__text > *, .mission__label, .mission__quote, .skip-link { visibility: hidden !important; } .btn-brush { visibility: visible !important; color: transparent !important; } .hero__actions { visibility: visible !important; } .btn-line { visibility: hidden !important; } .site-header .give { visibility: visible !important; color: transparent !important; }' });
}
await page.waitForTimeout(300);
await page.screenshot({ path: out, fullPage: full === 'full' });
await browser.close();
console.log('captured', out);
