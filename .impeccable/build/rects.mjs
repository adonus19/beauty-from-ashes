// Usage: node rects.mjs <url> <w> <h> <selector>... — prints rounded bounding boxes.
import { chromium } from 'playwright';
const [url, w, h, ...sels] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h }, reducedMotion: 'reduce' });
await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
for (const s of sels) {
  const r = await p.$$eval(s, (els) => els.map((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return `x${Math.round(r.x)}-${Math.round(r.right)} y${Math.round(r.y)}-${Math.round(r.bottom)} fs${cs.fontSize}`; }));
  console.log(s.padEnd(34), r.join(' | '));
}
await b.close();
