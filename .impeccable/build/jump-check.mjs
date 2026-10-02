import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1536, height: 1024 } });
await p.goto('http://127.0.0.1:4300/get-help/', { waitUntil: 'networkidle' });
const cur = () => p.evaluate(() => document.querySelector('.jump__link[aria-current="true"]')?.textContent.trim());
console.log('load:', await cur());
await p.evaluate(() => document.getElementById('your-privacy').scrollIntoView());
await p.waitForTimeout(400); console.log('scrolled to privacy:', await cur());
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
await p.click('text=Questions people ask'); await p.waitForTimeout(600);
console.log('clicked questions:', await cur(), '| url', p.url(), '| focus', await p.evaluate(() => document.activeElement?.id), '| scrollY', await p.evaluate(() => Math.round(scrollY)));
// skip link stays on page
await p.goto('http://127.0.0.1:4300/get-help/', { waitUntil: 'networkidle' });
await p.keyboard.press('Tab'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
console.log('skip link:', p.url(), '| focus', await p.evaluate(() => document.activeElement?.id));
await b.close();
