# CULVER&MAIN

Marketing site for [CULVER&MAIN](https://www.culverandmain.com), an all-day cafe at
3829 Main Street, Culver City, CA.

One page, statically generated. Online ordering lives on a third-party subdomain
(`order.culverandmain.com`) and is linked, not rebuilt.

Built from the design handoff in [`docs/design-handoff/`](docs/design-handoff/) —
its README is the specification for every colour, size, weight, spacing value,
animation and string on the page, and `screenshots/` is the intended result.

## Stack

- **[Astro](https://astro.build) 5**, `output: 'static'` — no server runtime, no client
  framework. Ships ~3.6 kB of JavaScript.
- **Self-hosted variable fonts** via Fontsource: Bricolage Grotesque (display, `opsz`
  + `wght` axes) and Archivo (body, `wght`). No Google Fonts request at runtime.
- **`astro:assets`** + sharp for responsive AVIF/WebP.
- Plain CSS: tokens in `src/styles/global.css`, everything else in scoped
  `<style>` blocks alongside its component.

## Getting started

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # → dist/
npm run preview      # serve dist/
```

The build output in `dist/` is plain static files — deploy it to any static host
(Netlify, Cloudflare Pages, Vercel, S3 + CloudFront).

### Deployment origin

Canonical, `og:url`, `og:image` and the sitemap are all derived from one value, so
it has to match wherever the build is actually served — point it at the wrong host
and every link preview asks for assets that aren't there.

It defaults to the pitch deployment (`https://culverandmain.vercel.app`) with
indexing **off**: until this is the real site, a public copy of the client's
photography and menu should not be in anyone's search index.

When it moves to the client's own domain, set both in the host's environment:

```bash
SITE_URL=https://www.culverandmain.com
INDEXABLE=true
```

That switches canonical and `og:*` to the real domain, drops the `noindex`, and
turns the sitemap and a permissive `robots.txt` back on.

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run check` | Astro/TypeScript diagnostics |
| `npm run assets` | Regenerate `public/og.jpg` and `public/apple-touch-icon.png` from the hero image |
| `npm run check:layout` | Headlines hold their authored line breaks, and nothing overflows horizontally, from 320px to 1920px |
| `npm run check:behaviour` | The modal, the drawer, analytics events, reduced motion, JS-off, and the no-scroll-timeline fallback all behave |
| `npm run check:a11y` | axe-core (WCAG 2.1 AA + best practice), desktop / mobile / modal open |
| `npm run check:contrast` | Hero headline holds ≥3:1 against the photo behind it, across 52 viewport sizes |
| `npm run check:all` | All four |

The `check:*` scripts drive a headless Chromium against a running
`npm run preview` (override with `BASE_URL=…`). They guard the handful of things
in this design that break quietly — see [Things worth knowing](#things-worth-knowing).

## Editing content

**The menu is data.** `src/data/menu.json` holds every dish as
`{ name, tag, desc }` grouped by category. Add, remove or reorder dishes there; the
markup does not change. `tag` is the dietary marker (`v` vegan, `V` vegetarian,
`GF` gluten free) and is appended to the dish name in parentheses on render — leave
it as `""` for dishes with none.

**Prices.** None have been supplied. Each dish accepts an optional `price` field; fill
it in and the dish row grows a right-aligned price column on the name row, exactly as
the handoff specifies. Nothing else needs touching.

**Everything else** — address, phone, hours, external URLs, the popup delay — is in
`src/data/site.ts`.

## Layout

```
src/
├── data/
│   ├── menu.json        ← the menu; edit this, not the markup
│   ├── menu.ts          ← types + the "name (tag)" label helper
│   └── site.ts          ← contact details, external URLs, popup config
├── styles/global.css    ← design tokens, fonts, keyframes, shared primitives
├── layouts/BaseLayout.astro
├── components/          ← one per section, in page order
│   ├── AnnouncementBar.astro
│   ├── SiteHeader.astro       (+ mobile drawer)
│   ├── Hero.astro
│   ├── Marquee.astro
│   ├── About.astro
│   ├── PhotoGrid.astro
│   ├── MenuSection.astro / MenuRow.astro
│   ├── CounterBand.astro
│   ├── SiteFooter.astro
│   ├── FloatingOrder.astro    (fixed bottom-right CTA)
│   └── SmsPopup.astro         (timed modal)
├── scripts/
│   ├── analytics.ts     ← click tracking shim
│   └── motion.ts        ← IntersectionObserver fallback for scroll reveals
└── pages/index.astro
```

## Things worth knowing

**Scroll-driven reveals run everywhere.** The design uses native CSS scroll timelines
(`animation-timeline: view()`), which only Chromium implements. `global.css` carries a
`@supports not (...)` block that puts the same elements in their start state, and
`scripts/motion.ts` toggles `.is-inview` at the same trigger distance — so Safari and
Firefox animate too rather than degrading to static. `prefers-reduced-motion: reduce`
disables all of it and forces every element visible; so does having JavaScript off.

**Two headlines are authored, not wrapped.** The hero `A table / for the /
neighborhood` and the About `FRIENDS & NEIGHBORS / EAT & DRINK / MORNING & AFTERNOON`
have hard line breaks, and re-wrapping either looks broken. Both cap their type
against their own container (`min(clamp(...), Ncqi)`) so a line can never break
mid-phrase. The caps account for Bricolage's optical sizing, which widens the glyphs
as the type gets smaller — the width-to-font ratio is not constant, so the naive
factor is too generous at small sizes. `npm run check:layout` asserts three hero
lines and three single-line About lines from 320px to 1920px.

**Hero contrast, and why the scrim is light.** The handoff's scrim stops leave the
cream headline at 1.9:1 against the bright window in the photo — well under the 3:1
the handoff itself asks us to verify. Deepening the gradient enough to fix that
washes the whole photograph navy, which is not what the room looks like.

So the contrast is carried locally, by a dense halo on the type, and the gradient
does only what it is good at: settling the hero's bottom edge into the navy marquee
below. That lets the scrim run *lighter* than the handoff's — 0.20 at the top against
its 0.40, and lighter through the middle — so the photo keeps its own colour, while
the headline measures ≥4.6:1 and the paragraph beside it ≥3.4:1.

Stops are anchored to the bottom in px rather than percentages: the headline sits a
roughly fixed distance off the hero's bottom edge while the hero's height varies, so
percentage stops slide out from under it on short viewports, and around 1024px where
the right column wraps and lifts the headline higher still.

`npm run check:contrast` measures this the way it actually works — it screenshots the
type, then re-screenshots it with the fill set to `transparent`, which keeps the halo
painted. The difference is the glyph mask; the second shot is the ground behind those
glyphs. **If the hero photo is replaced, re-run it** — both the scrim and the halo are
tuned to this image.

**The floating ORDER NOW button** stays visible as designed, including over the hero
(the hero's 108px bottom padding is what keeps it clear of the right column). It fades
out only while the menu column's own ORDER NOW is on screen, so the two never stack.

**Mobile navigation** was not part of the handoff. Below 900px the four nav links
collapse into a drawer under the header; below 520px the header's ORDER NOW hides and
the floating button carries the conversion. The drawer reuses the header palette and
the same squared corners.

**The photo grid** sits between About and the menu, rather than after the menu as in
the handoff — the food photography now leads into the food list instead of following
it. It is a hard-coded 7/5 split on a 12-column grid, which does not stack on its own;
below 720px it becomes a single column.

**The popup on short viewports.** In its single-column state the image pane moves above
the form and becomes sticky, so the close button stays reachable while the panel
scrolls. It also closes on Escape and on an overlay click, traps focus, and focuses the
dialog rather than the phone field — it opens on a timer, and raising a mobile keyboard
uninvited is hostile.

**Popup suppression.** Once dismissed or submitted, the popup does not come back:
`localStorage['cm-sms-popup-dismissed-v1']`. Bump the suffix in `src/data/site.ts` to
re-show it to everyone. Storage failures (private mode) fall back to showing it.

**No rounded pills anywhere** — radii are 2px (buttons), 3px (panels/images), 4px
(popup field and Continue), 6px (popup shell) and one 50% circle (popup close).
Explicit client direction.

**Copyright year** is computed at build time rather than hard-coded to 2025.

## Wiring up

### SMS opt-in

The popup form validates a US mobile number and POSTs `{"phone": "+1XXXXXXXXXX"}` as
JSON to whatever `PUBLIC_SMS_OPTIN_ENDPOINT` points at, expecting a 2xx.

```bash
PUBLIC_SMS_OPTIN_ENDPOINT="https://…/sms-optin" npm run build
```

**No provider has been chosen, so this is unset.** With it unset the form does not
pretend to have captured the number — it tells the visitor sign-up isn't live yet and
points them at the email address, and logs a warning for whoever is developing. Pick a
provider (Attentive, Postscript, Klaviyo, Twilio) and set the variable.

### Analytics

Both ORDER NOW buttons, the hero's ORDER PICKUP, and the popup's open/close/submit
events call `track()` in `src/scripts/analytics.ts`, which forwards to GTM's
`dataLayer`, `gtag`, and Plausible if any of them are on the page, and always
dispatches a `cm:track` CustomEvent. With no provider installed it is a no-op — drop
your tag in `BaseLayout.astro` and the events start flowing. Events:
`order_now_click` (with `location`: header / mobile_nav / menu / floating),
`order_pickup_click`, `sms_popup_open`, `sms_popup_close`, `sms_optin_success`,
`sms_optin_error`, `sms_optin_unconfigured`.

## Accessibility

`npm run check:a11y` runs axe-core (WCAG 2.1 A/AA plus best practice) at desktop
and mobile widths and with the modal open. It reports **no blocking violations**.

Beyond axe: the hero headline is verified against the photograph behind it (see
above), every image has alt text, the marquee is `aria-hidden` with its facts
repeated once for screen readers, there is a skip link, anchor targets clear the
sticky header, the modal traps focus and restores it on close, and the whole page
is usable at 200% zoom and with animations disabled.

### One thing axe still flags — a client decision

Three of the brand's own colour pairings fall short of AA (4.5:1) for text under
18.66px bold, which is every eyebrow, nav link and button label on the site:

| Pairing | Where | Ratio | Needs |
|---|---|---|---|
| Cream `#FAF6ED` on Tomato `#E4533C` | Nav links, ORDER NOW buttons | **3.47** | 4.5 |
| Navy `#0B2A5B` on Sky `#3B8CFF` | Announcement bar | **4.26** | 4.5 |
| Sky `#3B8CFF` on Navy `#0B2A5B` | Menu hours, footer and counter eyebrows | **4.26** | 4.5 |
| Tomato `#E4533C` on Navy `#0B2A5B` | Menu column eyebrows | **3.74** | 4.5 |

These are the palette, not the build, and the handoff states the hex values are
final — so they are used exactly as specified rather than quietly adjusted.
Two small changes would clear all four, if the client wants them:

- **Sky `#3B8CFF` → `#3D92FF`** fixes both Sky pairings at once (contrast is
  symmetric, so lightening Sky lifts navy-on-sky and sky-on-navy together).
  Visually near-identical.
- **Tomato `#E4533C` → `#C44734`** takes cream-on-tomato to 4.53 and
  tomato-on-navy to 4.5. This one is visible — it is a noticeably deeper red,
  and it is the header bar, so it changes the site's first impression.

The alternative, if the palette is untouchable, is to size the affected labels
at 18.66px bold or larger, where the AA threshold drops to 3:1 — but that
rewrites the type scale, which the handoff also fixes. Either way it is the
client's call, so nothing has been changed.

## Outstanding / needs client input

Carried forward from the handoff, none of them guessed at:

- **Menu prices.** Not supplied. `price` per dish in `menu.json` is ready for them.
- **`/parking` page.** The client's Squarespace site has one; its content was not
  handed over. Both parking links currently resolve to the footer, which carries the
  address and the free-parking line. `site.links.parking` is the one place to change.
- **Instagram handle.** `site.links.instagram` points at instagram.com.
- **Careers destination.** A mailto, pending a real careers page.
- **Newsletter.** The About copy says "Join our newsletter" but there is no signup
  form anywhere on the page — either the footer needs one or the copy needs changing.
  (Flagged in the handoff; still open.)
- **Photography.**
  - `popup-food.png` is a re-compressed crop of a screenshot. Replace with the
    original photograph before launch.
  - `spread.webp`, `breakfast.png` and `coffee.jpg` are 500px on their long edge and
    get upscaled to roughly 640–740px in the photo grid and counter band. They hold up,
    but originals at 1400px+ would render sharper — the build generates the responsive
    sizes automatically once they are dropped in.
  - The photo grid would carry more images than the two it has.
- **`room.webp`** is unused — the original dining-room shot, kept in `src/assets/` in
  case it is wanted.
