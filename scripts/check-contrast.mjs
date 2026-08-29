/**
 * Measures the cream type in the hero — the headline and the paragraph beside
 * it — against the photograph behind it.
 *
 * Takes two screenshots of each element's box: one as rendered, one with the
 * text set to `transparent`. The difference gives the glyph mask; the second
 * shot gives the ground behind those glyphs. Setting the fill transparent
 * rather than hiding the element keeps the type's own text-shadow painted,
 * which is correct — the halo genuinely is what sits behind the letterform,
 * and on this hero it is what carries the contrast.
 *
 * Measuring the whole bounding box instead would fail on empty ground beside
 * short lines that no letter ever covers.
 *
 * The handoff asks for >=3:1. Hero.astro's scrim and halo are tuned to this
 * photo — if the photo is replaced, run this again.
 *
 * Run against a served build:  npm run preview  &&  npm run check:contrast
 */
import { chromium } from 'playwright';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321/';
const TARGET = 3;

/** Every piece of cream type sitting directly on the photograph. */
const TARGETS = [
  ['headline ', '.hero h1'],
  ['paragraph', '.hero__aside p'],
];

const lum = (r, g, b) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const creamL = lum(0xfa, 0xf6, 0xed);

const raw = (buf) => sharp(buf).raw().toBuffer({ resolveWithObject: true });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

const sizes = [];
for (const w of [390, 480, 560, 700, 768, 900, 1024, 1100, 1280, 1366, 1440, 1600, 1920])
  for (const h of [640, 800, 900, 1080]) sizes.push([w, h]);

let fails = 0;
let overallWorst = { ratio: Infinity, at: '' };

for (const [w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200); // let the ken burns settle

  await page.evaluate(() => (document.getElementById('sms-popup').hidden = true));

  for (const [label, selector] of TARGETS) {
    const box = await page.evaluate((sel) => {
      const r = document.querySelector(sel).getBoundingClientRect();
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        width: Math.round(r.width),
        height: Math.round(r.height),
      };
    }, selector);

    const withType = await raw(await page.screenshot({ clip: box }));
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      el.dataset.priorColor = el.style.color;
      el.style.color = 'transparent';
    }, selector);
    const ground = await raw(await page.screenshot({ clip: box }));
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      el.style.color = el.dataset.priorColor ?? '';
    }, selector);

    const ch = withType.info.channels;
    let worst = Infinity;
    let culprit = null;

    for (let i = 0; i < withType.data.length; i += ch) {
      // A glyph pixel: the fill changed it, and it landed close to cream. The
      // second test drops antialiased edges, which are part background.
      const dr = Math.abs(withType.data[i] - ground.data[i]);
      const dg = Math.abs(withType.data[i + 1] - ground.data[i + 1]);
      const db = Math.abs(withType.data[i + 2] - ground.data[i + 2]);
      if (dr + dg + db < 24) continue;
      if (withType.data[i] < 235 || withType.data[i + 1] < 231 || withType.data[i + 2] < 222)
        continue;

      const r = ratio(creamL, lum(ground.data[i], ground.data[i + 1], ground.data[i + 2]));
      if (r < worst) {
        worst = r;
        culprit = [ground.data[i], ground.data[i + 1], ground.data[i + 2]];
      }
    }

    if (worst === Infinity) {
      console.log(`${w}x${h}  ${label}  SKIP  no glyph pixels found`);
      continue;
    }
    if (worst < overallWorst.ratio) overallWorst = { ratio: worst, at: `${w}x${h} ${label}` };
    if (worst < TARGET) {
      fails++;
      console.log(`${w}x${h}  ${label}  FAIL  ${worst.toFixed(2)}:1  (vs rgb(${culprit}))`);
    }
  }

  await ctx.close();
}

await browser.close();
console.log(
  fails
    ? `${fails} of ${sizes.length * TARGETS.length} measurements below ${TARGET}:1`
    : `all ${sizes.length * TARGETS.length} measurements >= ${TARGET}:1 (worst ${overallWorst.ratio.toFixed(2)}:1 at ${overallWorst.at})`,
);
process.exit(fails ? 1 : 0);
