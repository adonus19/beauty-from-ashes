import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.argv[2] ?? 'http://localhost:4300/get-help/', { waitUntil: 'networkidle' });
const r = await p.evaluate(() => [...document.querySelectorAll('p,li,dd,dt,h1,h2')].map((e) => { const fs = parseFloat(getComputedStyle(e).fontSize); const w = e.getBoundingClientRect().width; return [Math.round(w / (fs * 0.5)), e.tagName, e.className, e.textContent.trim().slice(0, 40)]; }).filter((x) => x[0] > 85));
console.log(r.map((x) => x.join(' | ')).join('\n')); await b.close();
