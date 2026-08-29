/**
 * axe-core audit of the page at desktop and mobile widths, and with the SMS
 * modal open.
 *
 * Exits non-zero on any violation except `color-contrast`. The remaining
 * colour-contrast findings are properties of the brand palette itself — cream
 * on tomato, and navy/sky either way round — not of this build, and changing
 * a brand hex is the client's call. They are listed under "Outstanding" in
 * README.md with the measured ratios. This script prints them every run so
 * they stay visible rather than quietly accepted.
 *
 * Run against a served build:  npm run preview  &&  npm run check:a11y
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321/';
const axe = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let blocking = 0;

for (const [label, width, keepPopupOpen] of [
  ['desktop', 1280, false],
  ['mobile', 390, false],
  ['modal open', 1280, true],
]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  if (!keepPopupOpen) await page.locator('#sms-popup [data-close]').click();
  await page.addScriptTag({ content: axe });

  const { violations } = await page.evaluate(async () =>
    window.axe.run(document, {
      resultTypes: ['violations'],
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
    }),
  );

  const known = violations.filter((v) => v.id === 'color-contrast');
  const blockers = violations.filter((v) => v.id !== 'color-contrast');
  blocking += blockers.length;

  console.log(`\n${label} (${width}px): ${blockers.length} blocking, ${known.length} known palette`);
  for (const v of blockers) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
    v.nodes.slice(0, 5).forEach((n) => console.log(`      ${n.target.join(' ')}`));
  }
  for (const v of known) {
    v.nodes.slice(0, 8).forEach((n) => {
      const line = (n.failureSummary ?? '').split('\n')[1]?.trim() ?? '';
      console.log(`  (known) ${n.target.join(' ')} — ${line}`);
    });
  }
  await ctx.close();
}

await browser.close();
console.log(
  blocking
    ? `\n${blocking} blocking violation(s)`
    : '\nno blocking violations (palette contrast is listed in README.md)',
);
process.exit(blocking ? 1 : 0);
