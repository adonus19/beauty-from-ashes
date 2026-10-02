import { chromium } from 'playwright';
const b = await chromium.launch();
for (const reduced of [false, true]) {
  const p = await b.newPage({ viewport: { width: 1536, height: 1024 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  await p.goto('http://127.0.0.1:4300/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const before = await p.evaluate(() => [...document.querySelectorAll('[bfabrushreveal], .values, .process__steps, .site-footer')].map((e) => `${e.className.split(' ')[0]}:${e.classList.contains('is-armed') ? 'armed' : 'painted'}`));
  await p.evaluate(() => document.querySelector('.process__steps').scrollIntoView());
  await p.waitForTimeout(1600);
  const clip = await p.evaluate(() => getComputedStyle(document.querySelector('.step + .step'), '::before').clipPath);
  const after = await p.evaluate(() => document.querySelector('.process__steps').className);
  console.log(reduced ? 'REDUCED' : 'MOTION', JSON.stringify(before), '| steps:', after, '| clip:', clip);
  await p.close();
}
await b.close();
