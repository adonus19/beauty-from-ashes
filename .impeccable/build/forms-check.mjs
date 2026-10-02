import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
const cases = [
  ['volunteer', async () => { await p.fill('#first', 'A'); await p.fill('#last', 'B'); await p.fill('#email', 'a@b.org'); await p.selectOption('#role', 'nurse'); await p.check('input[type=checkbox] >> nth=0'); }],
  ['partner', async () => { await p.fill('#first', 'A'); await p.fill('#last', 'B'); await p.fill('#organization', 'Grace Church'); await p.selectOption('#type', 'church'); await p.fill('#email', 'a@b.org'); }],
  ['contact', async () => { await p.fill('#name', 'A B'); await p.fill('#email', 'a@b.org'); await p.selectOption('#topic', 'give'); await p.fill('#message', 'Hello'); }],
];
for (const [path, fill] of cases) {
  await p.goto(`http://127.0.0.1:4300/${path}/`, { waitUntil: 'networkidle' });
  await p.click('form button[type=submit]'); await p.waitForTimeout(250);
  const n = await p.$$eval('.error-summary__link', (l) => l.length);
  const focus = await p.evaluate(() => document.activeElement?.className);
  await fill(); await p.click('form button[type=submit]'); await p.waitForTimeout(300);
  const sent = await p.evaluate(() => document.querySelector('.form-sent__title')?.textContent.trim());
  console.log(path, '| empty-send errors:', n, '| focus:', focus, '| sent:', sent);
}
console.log('page errors:', errs); await b.close();
