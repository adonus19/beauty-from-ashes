// Ticket 05 part A: drives Ask for Help and Refer through sending, failed (retry) and sent against a
// build whose endpoint is https://forms.example.test/submit (requests are intercepted, nothing leaves the machine).
// Usage: node submit-states.mjs http://127.0.0.1:4310
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
const base = process.argv[2] ?? 'http://127.0.0.1:4310';
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const ENDPOINT = 'https://forms.example.test/submit';
const b = await chromium.launch();
let total = 0;
const forms = {
  'ask-for-help': async (p) => {
    await p.check('input[type=radio][value=self]');
    await p.fill('#patient-first', 'Zelda'); await p.fill('#patient-last', 'Quill');
    await p.fill('#phone', '704-555-0100'); await p.check('input[type=radio][value=call]');
    await p.check('#safe-message input[value=yes]');
    await p.fill('#city', 'Fort Mill'); await p.selectOption('#state', 'SC');
    await p.selectOption('#care-type', { index: 1 }); await p.fill('#description', 'Private detail here.');
    await p.check('#consent-contact'); await p.check('#consent-authority');
  },
  refer: async (p) => {
    await p.fill('#your-first', 'Pat'); await p.fill('#your-last', 'Lee'); await p.selectOption('#role', { index: 1 });
    await p.fill('#your-email', 'pat@example.org'); await p.fill('#person-first', 'Zelda'); await p.fill('#person-last', 'Quill');
    await p.check('#age input[value=adult]'); await p.fill('#person-phone', '704-555-0100');
    await p.fill('#city', 'Fort Mill'); await p.selectOption('#state', 'SC'); await p.selectOption('#care-type', { index: 1 });
    await p.fill('#need', 'Private detail here.'); await p.check('#consent');
  },
};
for (const [route, fill] of Object.entries(forms)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const logs = []; p.on('console', (m) => logs.push(m.text())); p.on('pageerror', (e) => logs.push(String(e)));
  const requests = []; const queue = []; // each pending route waits for the script to settle it
  await p.route(ENDPOINT, (r) => { requests.push({ method: r.request().method(), url: r.request().url(), body: r.request().postData() }); queue.push(r); });
  await p.goto(`${base}/${route}/`, { waitUntil: 'networkidle' });
  console.log(`\n== ${route}: demo notice present: ${!!(await p.$('.demo-notice'))}`);
  await fill(p);
  await p.focus('form button[type=submit]');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  const snap = async (label) => {
    const info = await p.evaluate(() => ({
      live: document.querySelector('[role=status]')?.textContent.replace(/\s+/g, ' ').trim(),
      active: document.activeElement?.className || document.activeElement?.tagName,
      disabled: document.querySelector('form button[type=submit]')?.getAttribute('aria-disabled'),
    }));
    const res = await new AxeBuilder({ page: p }).withTags(tags).analyze();
    for (const v of res.violations) { total++; console.log(`  AXE [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0].target.join(' ')}`); }
    console.log(`[${label}] live="${info.live}" focus=${info.active} aria-disabled=${info.disabled} axe=${res.violations.length}`);
  };
  await snap('sending');
  await p.keyboard.press('Enter'); await p.waitForTimeout(150); // second press while sending
  console.log('requests after double press:', requests.length);
  await queue.shift().abort('failed'); await p.waitForTimeout(300);
  await snap('failed');
  await p.keyboard.press('Enter'); await p.waitForTimeout(300); // retry from focused button
  console.log('requests after retry:', requests.length);
  await snap('sending again');
  await queue.shift().fulfill({ status: 201, body: '' }); await p.waitForTimeout(300);
  await snap('sent');
  const r0 = requests[0];
  console.log('POST url clean:', r0.url === ENDPOINT, '| method:', r0.method, '| body has answers:', /Zelda/.test(r0.body));
  const storage = await p.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }) + location.href);
  console.log('answers in storage/url:', /Zelda|Quill|Private/.test(storage), '| answers in console:', logs.some((l) => /Zelda|Quill|Private/.test(l)), '| console lines:', logs.length);
  await ctx.close();
}
// Without an endpoint: demo only, nothing posted.
console.log('\ntotal axe violations:', total);
await b.close();
