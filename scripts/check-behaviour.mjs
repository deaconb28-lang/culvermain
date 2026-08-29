/**
 * Behavioural checks for the two interactive pieces the handoff leaves to the
 * build — the timed SMS modal and the mobile drawer — plus the motion
 * fallbacks. Covers: popup timing/dismissal/suppression, focus handling, form
 * validation and the unconfigured-endpoint path, analytics events, the drawer,
 * reduced motion, JavaScript off, and the IntersectionObserver path that
 * stands in for CSS scroll timelines on Safari and Firefox.
 *
 * Run against a served build:  npm run preview  &&  npm run check:behaviour
 */
import { chromium } from 'playwright';
const B = process.env.BASE_URL ?? 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const results = [];
const check = (name, pass, note = '') => results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${note ? ' — ' + note : ''}`);

// 1. Popup opens on timer, closes on Escape, and is suppressed on the next visit.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  check('popup hidden before delay', await p.locator('#sms-popup').isHidden());
  await p.waitForTimeout(2600);
  check('popup opens on timer', await p.locator('#sms-popup').isVisible());
  check('focus lands on dialog, not the phone field',
    await p.evaluate(() => document.activeElement?.getAttribute('role') === 'dialog'));
  check('body scroll locked while open',
    await p.evaluate(() => document.body.classList.contains('is-locked')));
  await p.keyboard.press('Escape');
  check('Escape closes', await p.locator('#sms-popup').isHidden());
  check('scroll lock released',
    await p.evaluate(() => !document.body.classList.contains('is-locked')));
  check('dismissal persisted',
    await p.evaluate(() => localStorage.getItem('cm-sms-popup-dismissed-v1') === '1'));
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  check('popup suppressed on return visit', await p.locator('#sms-popup').isHidden());
  await ctx.close();
}

// 2. Overlay click closes; clicks inside the panel do not.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  await p.locator('#sms-popup h2').click();
  check('click inside panel does not close', await p.locator('#sms-popup').isVisible());
  await p.mouse.click(10, 10);
  check('overlay click closes', await p.locator('#sms-popup').isHidden());
  await ctx.close();
}

// 3. Form validation + the unconfigured-endpoint path.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const warnings = [];
  p.on('console', (m) => { if (m.type() === 'warning') warnings.push(m.text()); });
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  await p.fill('#sms-phone', '123');
  await p.click('[data-submit]');
  check('rejects a short number',
    (await p.locator('[data-feedback]').textContent())?.includes('10-digit'));
  check('marks the field invalid',
    await p.locator('#sms-phone').getAttribute('aria-invalid') === 'true');
  await p.fill('#sms-phone', '(424) 225-9850');
  await p.click('[data-submit]');
  const msg = (await p.locator('[data-feedback]').textContent()) ?? '';
  check('valid number: says sign-up is not live rather than faking success',
    msg.includes('isn') && msg.includes('info@culverandmain.com'), msg.trim());
  check('warns the developer', warnings.some((w) => w.includes('PUBLIC_SMS_OPTIN_ENDPOINT')));
  check('popup still open after the failed submit', await p.locator('#sms-popup').isVisible());
  await ctx.close();
}

// 4. Analytics events fire on the order CTAs.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    window.__events = [];
    window.addEventListener('cm:track', (e) => window.__events.push(e.detail));
    // Keep the external order link from navigating the test away.
    document.addEventListener('click', (e) => e.preventDefault(), true);
  });
  await p.waitForTimeout(2600);
  await p.locator('#sms-popup [data-close]').click();
  await p.evaluate(() => document.querySelector('[data-track-location="header"]').click());
  await p.evaluate(() => document.querySelector('[data-track-location="menu"]').click());
  const ev = await p.evaluate(() => window.__events.map((e) => `${e.event}:${e.location ?? ''}`));
  check('order CTA clicks tracked',
    ev.includes('order_now_click:header') && ev.includes('order_now_click:menu'), ev.join(' '));
  check('popup open/close tracked',
    ev.some((e) => e.startsWith('sms_popup_open')) && ev.some((e) => e.startsWith('sms_popup_close')));
  await ctx.close();
}

// 5. Mobile drawer.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  await p.locator('#sms-popup [data-close]').click();
  check('drawer starts closed', await p.locator('#mobile-nav').isHidden());
  await p.click('[data-nav-toggle]');
  check('burger opens drawer', await p.locator('#mobile-nav').isVisible());
  check('aria-expanded reflects state',
    await p.locator('[data-nav-toggle]').getAttribute('aria-expanded') === 'true');
  await p.click('#mobile-nav a[href="#menus"]');
  check('picking a link closes the drawer', await p.locator('#mobile-nav').isHidden());
  await p.waitForTimeout(700);
  const y = await p.evaluate(() => {
    const el = document.getElementById('menus');
    return el.getBoundingClientRect().top;
  });
  const headerH = await p.evaluate(() => document.getElementById('site-header').offsetHeight);
  check('anchor clears the sticky header', y >= 0 && y >= headerH - 2, `top=${Math.round(y)} headerH=${headerH}`);
  await ctx.close();
}

// 6. Reduced motion: everything visible, nothing animating.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  const hidden = await p.evaluate(() =>
    [...document.querySelectorAll('.anim-reveal, .anim-row, .anim-rise-scroll')]
      .filter((el) => getComputedStyle(el).opacity !== '1').length);
  check('no element left hidden under reduced motion', hidden === 0, `${hidden} hidden`);
  await ctx.close();
}

// 7. JavaScript disabled: content is all there, and the native scroll
//    timelines still reveal it (they are pure CSS).
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  const dishes = await p.locator('.row').count();
  check('no-JS: all 23 dishes render', dishes === 23, `${dishes} rows`);
  check('no-JS: popup stays closed', await p.locator('#sms-popup').isHidden());

  let stillHidden = 0;
  const n = await p.locator('.anim-reveal, .anim-row, .anim-rise-scroll').count();
  for (let i = 0; i < n; i++) {
    const el = p.locator('.anim-reveal, .anim-row, .anim-rise-scroll').nth(i);
    await el.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await p.waitForTimeout(60);
    if ((await el.evaluate((e) => getComputedStyle(e).opacity)) !== '1') stillHidden++;
  }
  check('no-JS: every revealed element reaches full opacity when scrolled to',
    stillHidden === 0, `${stillHidden} of ${n} stayed hidden`);
  await ctx.close();
}

// 8. Browsers without CSS scroll timelines (Safari, Firefox): stub the feature
//    out and flip the @supports branch, so the IntersectionObserver fallback
//    in motion.ts is what actually runs.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => {
    const real = CSS.supports.bind(CSS);
    CSS.supports = (...args) =>
      args.join(' ').includes('animation-timeline') ? false : real(...args);
  });
  await ctx.route('**/*.css', async (route) => {
    const res = await route.fetch();
    const body = (await res.text()).replace(
      '@supports not (animation-timeline: view())',
      '@supports (animation-timeline: view())',
    );
    await route.fulfill({ response: res, body });
  });
  const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);

  check('fallback: elements start hidden',
    await p.evaluate(() => getComputedStyle(document.querySelector('.about__grid')).opacity !== '1'));

  let stillHidden = 0;
  const n = await p.locator('.anim-reveal, .anim-row, .anim-rise-scroll').count();
  for (let i = 0; i < n; i++) {
    const el = p.locator('.anim-reveal, .anim-row, .anim-rise-scroll').nth(i);
    await el.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await p.waitForTimeout(900); // the fallback transitions rather than scrubbing
    if ((await el.evaluate((e) => getComputedStyle(e).opacity)) !== '1') stillHidden++;
  }
  check('fallback: observer reveals every element on scroll',
    stillHidden === 0, `${stillHidden} of ${n} stayed hidden`);
  await ctx.close();
}

await b.close();
console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(failed ? `\n${failed} check(s) failed` : '\nall behaviour checks pass');
process.exit(failed ? 1 : 0);
