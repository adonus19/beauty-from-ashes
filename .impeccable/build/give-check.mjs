import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://127.0.0.1:4300/give/', { waitUntil: 'networkidle' });
const label = () => p.evaluate(() => document.querySelector('.gift__submit').textContent.trim());
console.log('default:', await label());
await p.click('text=Give monthly'); console.log('monthly:', await label());
await p.click('.amount__face >> text=$250'); console.log('250 monthly:', await label());
await p.click('text=Other amount'); console.log('other empty:', await label());
await p.click('.gift__submit'); await p.waitForTimeout(200);
console.log('other error:', await p.evaluate(() => document.querySelector('.field__error')?.textContent.trim()));
await p.fill('#other-amount', '75'); console.log('other 75:', await label());
await p.click('.gift__submit'); await p.waitForTimeout(200);
console.log('result:', await p.evaluate(() => document.querySelector('.gift__result').textContent.trim()));
// keyboard: arrow keys move between amount radios
await p.goto('http://127.0.0.1:4300/give/', { waitUntil: 'networkidle' });
await p.focus('input[type=radio][value="100"]'); await p.keyboard.press('ArrowRight'); console.log('arrow ->', await label());
console.log('errors:', errs); await b.close();
