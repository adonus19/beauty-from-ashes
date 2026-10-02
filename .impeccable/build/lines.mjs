import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1536, height: 1024 } });
await p.goto('http://127.0.0.1:4300/', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
const r = await p.evaluate(() => {
  const el = document.querySelector('.mission__quote p'); const range = document.createRange(); range.selectNodeContents(el);
  const rects = [...range.getClientRects()].map(r => [Math.round(r.left), Math.round(r.top), Math.round(r.width)]);
  const cs = getComputedStyle(el); const words = el.textContent.split(' ');
  // natural width of the comp's first line
  const probe = document.createElement('span'); probe.style.cssText = 'position:absolute;white-space:nowrap;visibility:hidden';
  probe.textContent = '“To glorify God by serving every patient with Christlike compassion'; el.appendChild(probe);
  const w = probe.getBoundingClientRect().width; probe.remove();
  return { rects, fontSize: cs.fontSize, maxWidth: getComputedStyle(el.parentElement).maxWidth, line1: Math.round(w) };
});
console.log(JSON.stringify(r)); await b.close();
