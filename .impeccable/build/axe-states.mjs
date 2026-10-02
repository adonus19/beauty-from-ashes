import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const states = [
  ['ask-for-help', async () => { await p.click('form button[type=submit]'); await p.check('input[type=radio][value=child]'); }],
  ['refer', async () => { await p.click('form button[type=submit]'); }],
  ['volunteer', async () => { await p.click('form button[type=submit]'); }],
  ['contact', async () => { await p.fill('#name', 'A'); await p.fill('#email', 'a@b.org'); await p.selectOption('#topic', 'give'); await p.fill('#message', 'Hi'); await p.click('form button[type=submit]'); }],
  ['give', async () => { await p.click('.gift__amounts label:nth-of-type(5)'); await p.click('.gift__submit'); }],
];
let total = 0;
for (const [r, act] of states) {
  await p.goto(`http://127.0.0.1:4300/${r}/`, { waitUntil: 'networkidle' }); await act(); await p.waitForTimeout(300);
  const res = await new AxeBuilder({ page: p }).withTags(tags).analyze();
  for (const v of res.violations) { total++; console.log(`/${r} [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0].target.join(' ')}`); }
}
console.log('violations:', total); await b.close();
