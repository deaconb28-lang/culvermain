/**
 * Guards the two authored headlines — the hero's "A table / for the /
 * neighborhood" and the About block's three lines — against re-wrapping, and
 * the page against horizontal overflow, from 320px to 1920px.
 *
 * Run against a served build:  npm run preview  &&  npm run check:layout
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const widths = [320, 360, 375, 390, 414, 480, 560, 640, 720, 768, 824, 860, 900, 1000, 1100, 1200, 1280, 1366, 1440, 1600, 1920];
let bad = 0;
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(2200); // let kenburns + reveals settle
  const r = await p.evaluate(() => {
    const lineCount = (el) => {
      const lh = parseFloat(getComputedStyle(el).lineHeight) ||
        parseFloat(getComputedStyle(el).fontSize) * 1.2;
      return Math.round(el.getBoundingClientRect().height / lh);
    };
    const h1 = document.querySelector('.hero h1');
    const h1lines = h1.getBoundingClientRect().height /
      (parseFloat(getComputedStyle(h1).fontSize) * 0.88);
    const spans = [...document.querySelectorAll('.about__h2 span')].map(lineCount);
    return {
      h1: Math.round(h1lines),
      h1font: Math.round(parseFloat(getComputedStyle(h1).fontSize)),
      about: spans,
      aboutFont: Math.round(parseFloat(getComputedStyle(document.querySelector('.about__h2')).fontSize)),
      overflowX: document.documentElement.scrollWidth > window.innerWidth
        ? document.documentElement.scrollWidth : 0,
    };
  });
  const ok = r.h1 === 3 && r.about.every((n) => n === 1) && !r.overflowX;
  if (!ok) bad++;
  console.log(`${String(w).padStart(5)} h1lines=${r.h1}(${r.h1font}px) about=${r.about.join(',')}(${r.aboutFont}px) overflowX=${r.overflowX} ${ok ? 'OK' : '<<< FAIL'}`);
  await ctx.close();
}
await b.close();
console.log(bad ? `${bad} width(s) failed` : 'all widths OK');
process.exit(bad ? 1 : 0);
