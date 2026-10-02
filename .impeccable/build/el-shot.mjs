// node el-shot.mjs <url> <width> <outdir> <selector=name> ...
import { chromium } from 'playwright';
const [url, width, out, ...pairs] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +width, height: 900 }, reducedMotion: 'reduce' });
await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
for (const pair of pairs) { const [sel, name] = pair.split('='); const el = await p.$(sel); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(150); await el.screenshot({ path: `${out}/${name}.png` }); }
await b.close(); console.log('ok');
