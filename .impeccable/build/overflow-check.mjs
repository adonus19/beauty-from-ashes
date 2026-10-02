import { chromium } from 'playwright';
const b = await chromium.launch();
const routes = ['', 'get-help', 'ask-for-help', 'refer', 'volunteer', 'partner', 'stories', 'about', 'contact', 'privacy', 'accessibility'];
for (const w of [320, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  for (const r of routes) {
    await p.goto(`http://127.0.0.1:4300/${r}${r ? '/' : ''}`, { waitUntil: 'networkidle' });
    const o = await p.evaluate(() => {
      const doc = document.documentElement.scrollWidth - innerWidth;
      const wide = [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 3).map((e) => e.tagName + '.' + (e.className || '').toString().split(' ')[0]);
      return { doc, wide };
    });
    if (o.doc > 0 || o.wide.length) console.log(w, r || 'home', JSON.stringify(o));
  }
  await p.close();
}
console.log('done'); await b.close();
