import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('http://localhost:4300/', { waitUntil: 'networkidle' });
const r = await p.evaluate(async () => {
  await document.fonts.ready;
  const c = document.createElement('canvas').getContext('2d'); const out = {};
  for (const [name, f] of [['tiro', "100px 'Tiro Devanagari Marathi'"], ['tiroI', "italic 100px 'Tiro Devanagari Marathi'"], ['mulish', "100px 'Mulish Variable'"]]) {
    c.font = f; const m = c.measureText('H'); const x = c.measureText('x'); const w = c.measureText('Help with surgery you can’t afford.');
    out[name] = { cap: m.actualBoundingBoxAscent, x: x.actualBoundingBoxAscent, headlineW: w.width };
  }
  return out;
});
console.log(JSON.stringify(r)); await b.close();
