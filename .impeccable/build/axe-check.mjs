// Runs axe (WCAG 2.0/2.1/2.2 A and AA) on every page, at desktop and phone widths.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
const routes = ['', 'get-help', 'ask-for-help', 'refer', 'volunteer', 'partner', 'give', 'stories', 'about', 'contact', 'privacy', 'accessibility', 'es', 'es/get-help'];
const b = await chromium.launch();
let total = 0;
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  for (const r of routes) {
    await p.goto(`http://127.0.0.1:4300/${r}${r ? '/' : ''}`, { waitUntil: 'networkidle' });
    const res = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    for (const v of res.violations) {
      total++;
      console.log(`${w} /${r} [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0].target.join(' ')}`);
    }
  }
  await ctx.close();
}
console.log('violations:', total); await b.close();
