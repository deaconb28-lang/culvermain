# Handoff: CULVER&MAIN — Restaurant Marketing Site

## Overview
A single-page marketing site for CULVER&MAIN, a breakfast-and-lunch restaurant at 3829 Main Street, Culver City, CA. Goals: sell the food, sell the room, drive online orders, and surface hours/location/parking. Sections in page order: announcement bar → sticky nav → hero → scrolling info marquee → About → Menu → food photo grid → "The counter" community band → footer. Two persistent conversion elements: a fixed bottom-right ORDER NOW button and a timed SMS/app-credit modal.

## About the Design Files
The files in `design/` are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. They are authored in a streaming component format (`.dc.html`, requiring `support.js`) used by the design tool, not a shippable web stack.

The task is to **recreate these designs in the target codebase's existing environment** (Next.js, Astro, Remix, WordPress, Squarespace, etc.) using its established patterns, components, and libraries. If no environment exists, choose an appropriate one — for a static marketing site of this scope, a static-site generator (Astro or Next.js static export) is a good fit. Copy the visual values from this README; do not port the `.dc.html` runtime.

The live site this replaces is Squarespace (`culverandmain.com`). Online ordering lives on a third-party subdomain (`order.culverandmain.com`) and is linked, not rebuilt.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and interactions. Recreate pixel-perfectly using the codebase's existing libraries. All copy in this document is final and taken from the client's existing site and menu — do not rewrite it.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| Navy | `#0B2A5B` | Primary text, menu section bg, footer bg, marquee bg, header CTA, floating CTA |
| Cream | `#FAF6ED` | Page background, text on navy |
| Tomato | `#E4533C` | Header bar, section eyebrows, primary buttons, chapter accents |
| Yellow | `#FFC629` | Display accents, ampersand in logo, hover states, legend block |
| Sky | `#3B8CFF` | Announcement bar bg, footer column eyebrows |
| Navy 7% | `rgba(11,42,91,0.07)` | Subtle fills |
| Navy 14–16% | `rgba(11,42,91,0.14–0.16)` | Hairline rules on cream |
| Cream 20% | `rgba(250,246,237,0.2)` | Hairline rules on navy |
| Cream 70% | `rgba(250,246,237,0.7)` | Body text on navy |
| Cream 45% | `rgba(250,246,237,0.45)` | Copyright line |

Selection: background `#FFC629`, text `#0B2A5B`.

### Typography
Two Google fonts.

- **Display — Bricolage Grotesque** (variable, opsz 12–96; weights 600/700/800). Used for the logo, all headings, dish names, big numerals.
- **Body — Archivo** (400/500/600/700). Used for body copy, nav, buttons, labels, menu descriptions.

Scale as used:

| Role | Family / weight | Size | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|
| Hero H1 | Bricolage 800 | `clamp(48px, 8.5vw, 132px)` | 0.88 | -0.035em | uppercase |
| Footer wordmark | Bricolage 800 | `clamp(44px, 9vw, 140px)` | 0.85 | -0.04em | uppercase |
| Menu "EAT HERE" | Bricolage 800 | `clamp(52px, 8vw, 92px)` | 0.82 | -0.04em | uppercase |
| About H2 (3 lines) | Bricolage 800 | `clamp(34px, 4.2vw, 58px)` | 0.98 | -0.035em | uppercase |
| Counter H2 | Bricolage 700 | `clamp(32px, 3.6vw, 52px)` | 1.02 | -0.03em | sentence |
| Yellow pull-quote card | Bricolage 700 | `clamp(22px, 2vw, 30px)` | 1.1 | -0.02em | sentence |
| Popup H2 | Bricolage 800 | `clamp(28px, 3vw, 38px)` | 1.05 | -0.03em | sentence |
| Dish name | Bricolage 700 | 17px | normal | -0.01em | sentence |
| Stat numeral | Bricolage 700 | 34px | normal | -0.02em | — |
| Logo (header) | Bricolage 800 | 20px | normal | -0.02em | uppercase |
| Body large | Archivo 400 | 18px | 1.65 | normal | — |
| Body / hero sub | Archivo 400 | 17px | 1.5–1.6 | normal | — |
| Footer address | Archivo 400 | 16px | 1.5 | normal | — |
| Dish description | Archivo 400 | 13px | 1.5 | normal | — |
| Nav link | Archivo 700 | 12px | normal | 0.16em | uppercase |
| Button label | Archivo 700 | 12px (13px on floating CTA) | normal | 0.14em | uppercase |
| Section eyebrow | Archivo 700 | 11px | normal | 0.22em | uppercase |
| Announcement bar | Archivo 700 | 12px | normal | 0.14em | uppercase |
| Marquee | Bricolage 700 | 15px | normal | 0.18em | uppercase |
| Legal / fine print | Archivo 400 | 13px | 1.5 | normal | — |
| Copyright | Archivo 400 | 11px | normal | 0.14em | uppercase |

Body copy uses `text-wrap: pretty` throughout.

### Spacing
Section padding: `96–110px` vertical, `40px` horizontal. Content max-width `1280px`, centered.
Common gaps: 6, 8, 12, 16, 20, 22, 24, 26, 28, 36, 40, 44, 56, 64px.
Grid gutters: 16px (cards), 20px (photo grid), 40px (menu columns), 56–64px (two-column text).

### Border radius
`2px` buttons · `3px` image and panel corners · `4px` popup input and Continue button · `6px` popup shell · `50%` popup close button. **No pill/rounded-full anywhere** (explicit client direction).

### Shadows
Floating CTA: `0 10px 30px rgba(11,42,91,0.35)`
Popup shell: `0 30px 80px rgba(11,42,91,0.4)`
No other shadows — separation is by color block and hairline rule.

---

## Screens / Views

The site is one page. "Screens" below are stacked sections.

### 1. Announcement bar
- **Purpose:** parking message, always first thing seen.
- **Layout:** full width, `9px 20px` padding, centered text.
- **Style:** bg Sky `#3B8CFF`, text Navy, 12px/700/0.14em uppercase.
- **Copy:** `PARKING AVAILABLE AT 3846 CARDIFF AVENUE · FIRST HOUR FREE · GET DIRECTIONS`
- "GET DIRECTIONS" is an underlined link (`text-underline-offset: 3px`) to `#visit`.

### 2. Header / nav
- **Purpose:** wayfinding + order CTA.
- **Layout:** `position: sticky; top: 0; z-index: 50`. Flex row, `align-items:center`, `justify-content:space-between`, gap 24px, padding `14px 28px`, `border-bottom: 2px solid #0B2A5B`.
- **Style:** bg Tomato `#E4533C`.
- **Logo (left):** "CULVER&MAIN", Bricolage 800 20px uppercase cream, with the `&` in Yellow. Links to `#top`.
- **Nav (center):** RESTAURANT, ABOUT, MENUS, VISIT — cream, 12px/700/0.16em uppercase, gap 34px, hover → Yellow. Anchor links to `#restaurant`, `#about`, `#menus`, `#visit`.
- **CTA (right):** "ORDER NOW", bg Navy, cream text, padding `12px 22px`, radius 2px. Hover → bg Yellow, text Navy. Links to `https://order.culverandmain.com/`.

### 3. Hero
- **Purpose:** establish the room and the promise.
- **Layout:** `position:relative; height: min(84vh, 760px); min-height: 540px`, content bottom-aligned. Inner padding `0 40px 108px` — the large bottom value is deliberate, it keeps the right column clear of the fixed ORDER NOW button, flex row wrap, `justify-content: space-between`, `align-items: flex-end`, gap 32px.
- **Background:** `img/hero.png`, absolutely positioned, `object-fit: cover; object-position: center 45%`.
- **Scrim:** `linear-gradient(180deg, rgba(11,42,91,0.4) 0%, rgba(11,42,91,0.34) 30%, rgba(11,42,91,0.62) 62%, rgba(11,42,91,0.9) 100%)`. The mid-tones matter — an earlier weaker scrim dropped the headline to ~1.6:1 contrast against the bright window in the photo. **Verify ≥3:1 for the headline against whatever hero image is used.**
- **H1 (left):** `A table / for the / neighborhood` (three lines, hard breaks), cream, `max-width: 14ch`, `text-shadow: 0 2px 24px rgba(11,42,91,0.55)`. Wrapped in a flex column (gap 22px) that carries the entrance animation.
- **Right column (max-width 340px):**
  - Paragraph: "Fresh, locally-inspired California fare in the heart of Downtown Culver City. Breakfast through mid-day, seven days a week."
  - Two buttons, flex gap 12px, padding `14px 24px`, radius 2px:
    - "SEE THE MENU" — bg Yellow, Navy text, `→ #menus`. Hover bg Cream.
    - "ORDER PICKUP" — `1.5px solid #FAF6ED` outline, cream text. Hover bg Cream, text Navy.

### 4. Marquee
- **Purpose:** repeat the practical facts with energy.
- **Layout:** full-bleed, `padding: 12px 0`, `overflow: hidden`. Inner track `width: max-content`, flex, gap 28px, right padding 28px.
- **Style:** bg Navy, text Yellow, Bricolage 700 15px/0.18em uppercase. Separator `✳` in Tomato.
- **Items (repeated twice for a seamless loop):** `Open 7 days · 8 AM – 3 PM` / `Breakfast all day` / `Espresso & matcha bar` / `Free parking on Cardiff` / `3829 Main Street`
- **Animation:** `marquee 32s linear infinite`, `translateX(0) → translateX(-50%)`.

### 5. About (`#about`)
- **Purpose:** what the place is and when to come.
- **Layout:** cream ground, `padding: 110px 40px`, max-width 1280px. Grid `repeat(auto-fit, minmax(340px, 1fr))`, gap 64px, `align-items: start`.
- **Left:** eyebrow "WHAT WE'RE ABOUT" in Tomato (11px/700/0.22em uppercase, margin-bottom 22px) + H2.
  - **H2:** three stacked lines, Bricolage **800**, `clamp(34px, 4.2vw, 58px)`, line-height 0.98, letter-spacing -0.035em, uppercase, Tomato `#E4533C`. Rendered as a flex column with `gap: 6px` (one `<span>` per line), **not** `<br>`:
    - FRIENDS & NEIGHBORS
    - EAT & DRINK
    - MORNING & AFTERNOON
  - The source copy wraps each line in en-dashes ("– Friends & Neighbors –"); the dashes were dropped as decoration in the final design.
- **Right:** flex column, gap 26px, `padding-top: 6px`. Two paragraphs at 18px/1.65, then the link.
  - **Paragraph 1 (verbatim, client's):** "We're an all-day cafe located in the heart of Culver City.  Stop by in the morning for a unique selection of pastries and coffee drinks or in the afternoon for delicious, health-conscious salads, sandwiches and desserts."
  - **Paragraph 2 (verbatim, client's):** "Dinner and delivery coming soon." / "Join our newsletter or socials below to stay informed." (hard break between the two sentences)
- **Link:** "FREE PARKING AVAILABLE" — 12px/700/0.14em uppercase, `border-bottom: 2px solid #FFC629`, `padding-bottom: 4px`, hover → Tomato. Points to `#visit` (client's live site points it at `/parking`).
- **Note:** "Join our newsletter" has no newsletter form on the page yet — either build one in the footer or change the copy.

> An earlier round set this section as a centered block on a yellow ground; it was rejected. The two-column cream layout above is final.

### 6. Menu (`#menus`)
- **Purpose:** the full food list. This layout was chosen from four explored directions (see `design/Menu Directions.dc.html`, option **1c** — "navy poster").
- **Layout:** bg Navy, cream text, `padding: 96px 40px 110px`, max-width 1280px.
  - Header row: flex wrap, `align-items: flex-end`, `justify-content: space-between`, gap 20px, `border-bottom: 2px solid #FFC629`, `padding-bottom: 20px`, `margin-bottom: 48px`.
    - Left: "EAT / HERE" in Yellow (hard break between words).
    - Right: "OPEN 7 DAYS / 8 AM – 3 PM" in Sky, 12px/700/0.16em uppercase, right-aligned.
  - Body: grid `repeat(auto-fit, minmax(280px, 1fr))`, gap 40px, `align-items: start`. Three columns.
- **Column eyebrows** (Tomato, 11px/700/0.22em uppercase, margin-bottom 22px): "BREAKFAST", "SALADS, SANDWICHES & BOWLS", "KIDS & FOLKS".
- **Dish row:** `padding: 14px 0`, `border-top: 1px solid rgba(250,246,237,0.2)`. Dish name Bricolage 700 17px cream; description Archivo 13px/1.5 in `rgba(250,246,237,0.7)`, margin-top 4px.
  - **Hover:** `padding-left: 14px`, border-color → Yellow, dish name color → Yellow. Transition `0.35s cubic-bezier(.2,.7,.3,1)` on transform/padding/border-color, `0.3s ease` on color.
  - **Reveal:** `animation: revealRow linear both; animation-timeline: view(); animation-range: entry 0% cover 18%`.
- **Column 2 footnote** (after the list): `margin-top: 20px`, same hairline top border, 13px/1.5 at 70% cream — "All sandwiches come with choice of side salad or housemade potato chips".
- **Column 3 extras:**
  - Legend block: `margin-top: 32px`, bg Yellow, Navy text, `padding: 20px`, radius 3px, 12px/700/0.1em, flex column gap 6px — `v — VEGAN`, `V — VEGETARIAN`, `GF — GLUTEN FREE`.
  - CTA: "ORDER NOW", `margin-top: 16px`, full-width block, centered, bg Tomato, cream text, `padding: 16px 22px`, radius 2px, hover bg Yellow + Navy text.

**Menu data (verbatim — dietary tags are appended to the name in parentheses):**

*Breakfast*
1. **Breakfast Burrito** — Scrambled eggs, cheddar cheese, your choice of bacon, chorizo, chicken sausage, or soyrizo, crispy potato hash, avocado smash, guajillo salsa, and a warm flour tortilla
2. **Challah French Toast (V)** — Griddle custard challah, peach & apricot compote, orange supremes, whipped crème fraiche, house butter, warm maple syrup
3. **Culver Breakfast (V, GF)** — Poached eggs, sautéed kale and spinach, chimichurri, roasted mushrooms, garlic-thyme roasted tomatoes, seared halloumi, and microgreens
4. **Breakfast Sandwich** — Over-easy eggs, melted New School American cheese, chicken apple sausage or house cured pork belly bacon, bacon-onion jam, microgreens, mayo
5. **Green Goddess Avocado Toast (V)** — Toasted multigrain, sliced avocado, stracciatella cheese, farmers market spring vegetables, pea tendrils, radishes, crispy quinoa, green goddess dressing
6. **Overnight Oats (v, GF)** — Jasmine apricot compote, apricot, strawberry, candied walnuts
7. **Seasonal Fruit Parfait (v, GF)** — 4 berry compote, blood orange, granola
8. **Chilaquiles Verde (V)** — Salsa verde and black bean sauce, tortilla chips, grated parmesan, pickled red onions, lime crema, two eggs any style, microgreens
9. **Three Egg Breakfast** — Three eggs any style, choice of chicken apple sausage or bacon, multigrain toast, sunrise potatoes

*Salads, Sandwiches & Bowls*
1. **Spring Farmers Bowl (V, GF)** — Tricolor quinoa, pan seared radishes, asparagus, sweet potato, sautéed spinach & kale, shaved fennel, peas, avocado, fava aji verde
2. **Spring Burrata Salad (V, GF)** — Shredded kale, arugula, sun gold tomato, radish, cucumber, spring herb oil, caramelized onion thyme dressing
3. **Chicken Cesar Salad (GF)** — A seasonal Caesar salad with little gem lettuce, charred leeks, shaved Parmesan, and chickpea croutons, tossed in avocado-yogurt Caesar dressing and finished with fresh herbs and candied lemon zest
4. **Simple Salad (V, GF)** — Little gem lettuce, heirloom carrots, heirloom baby tomatoes, Persian cucumbers, feta cheese, and champagne vinaigrette
5. **Fried Fish Sandwich** — Toasted buttered brioche bun, beer-battered halibut, melted New School American Cheese, house made tartar sauce
6. **Hot Honey Fried Chicken Sandwich** — Buttermilk-marinated Mary's chicken, Calabrian hot honey, charred lemon slaw, champagne aioli, brioche bun
7. **Classic Cheeseburger** — New School American Cheese, bacon & onion jam, mild secret sauce, toasted brioche bun. Add sunny egg · Add bacon
8. **Tuna Melt** — House tuna salad, shredded artisanal romaine lettuce, potato crisps, capers, provolone, grilled sourdough, served with house pickle spear
9. **BLAT** — House cured pork belly bacon, lettuce, tomato, avocado, mayo, toasted sourdough | sub tempeh beacon & veganaise (v)
10. **Main Turkey Sandwich** — Mesquite-smoked turkey, tomato, pickled red onions, whole grain mustard dijonaise, and arugula on toasted multigrain bread

*Kids & Folks*
1. **Kids Breakfast Burrito** — Served with side of fruit
2. **Chicken Tenders** — Served with side of fries
3. **Silver Dollar Pancakes** — Served with fresh fruit
4. **Kids Cheeseburger** — Served with side of Fries

> No prices in the source material. If prices are added, put them right-aligned on the dish-name row with a leader or fixed column; do not push them into the description.

### 7. Food photo grid (`#restaurant`)
- **Layout:** `padding: 0 40px 110px`, max-width 1280px. 12-column grid, gap 20px.
  - Left figure: `grid-column: span 7`, `overflow: hidden`, radius 3px. Image `img/spread.webp`, `aspect-ratio: 1/1`, cover. Hover `transform: scale(1.04)` over `0.9s cubic-bezier(.2,.7,.3,1)`.
    - Caption chip: absolute `left:16px; bottom:16px`, bg Cream, 11px/700/0.16em uppercase, `padding: 9px 14px`, radius 2px — "MADE FOR SHARING".
  - Right column: `grid-column: span 5`, flex column, gap 20px.
    - Figure `img/breakfast.png`, `flex: 1`, `min-height: 220px`, cover, radius 3px.
    - Yellow card: `padding: 30px`, radius 3px — "Seasonal produce, house-cured meats, bread toasted to order."

### 8. The counter (community band)
- **Layout:** full-bleed, bg Navy, grid `repeat(auto-fit, minmax(360px, 1fr))`, `align-items: stretch`, no padding on the section itself.
  - Left: `img/coffee.jpg`, `min-height: 460px`, cover, full-bleed.
  - Right: `padding: clamp(48px, 6vw, 96px)`, flex column centered, gap 24px.
- **Content:**
  - Eyebrow "THE COUNTER" in Sky.
  - H2 "Meet here. Stay a while."
  - Paragraph (max-width 46ch, `rgba(250,246,237,0.86)`): "Morning espresso before work, a long lunch with friends, a laptop and a matcha in the afternoon light. The room is loud in the best way."
  - Stat row: flex wrap, gap 36px, `padding-top: 12px`. Three stats — numeral in Yellow (Bricolage 700 34px), label below in 12px/0.14em uppercase at 70% cream, margin-top 4px:
    - `7 days` / A WEEK · `8–3` / EVERY DAY · `1 hr` / FREE PARKING

### 9. Footer (`#visit`)
- **Layout:** bg Navy, cream text, `padding: 96px 40px 56px`, max-width 1280px.
  - Wordmark "CULVER&MAIN" (`&` in Yellow), margin-bottom 64px.
  - `border-top: 1px solid rgba(250,246,237,0.25)`, `padding-top: 44px`, grid `repeat(auto-fit, minmax(220px, 1fr))`, gap 44px. Each column: flex column gap 12px, eyebrow in Sky.
- **Columns:**
  - **LOCATION** — "3829 Main Street," / "Culver City, CA 90232"; link "PARKING" (13px/0.1em uppercase, underlined, offset 4px) → `/parking`.
  - **HOURS** — "Open 7 days a week" / "8 AM – 3 PM".
  - **CONTACT** — "424-225-9850"; `info@culverandmain.com` (mailto, underlined 15px); "INSTAGRAM" (13px uppercase, underlined).
  - **WORK WITH US** — "Join our team" (Bricolage 700 22px, Yellow, underlined, offset 5px, mailto); "Media inquiries" (13px, `rgba(250,246,237,0.75)`, mailto).
  - All footer links hover → Yellow.
  - Copyright, margin-top 56px: "© 2025 CULVER & MAIN · DOWNTOWN CULVER CITY" at `rgba(250,246,237,0.45)`.

### 10. Floating order button
- `position: fixed; right: 24px; bottom: 24px; z-index: 100`. bg Navy, cream text, 13px/700/0.14em uppercase, `padding: 18px 28px`, radius **2px** (squared — explicit client direction), shadow `0 10px 30px rgba(11,42,91,0.35)`. Hover → bg Yellow, Navy text. Links to `https://order.culverandmain.com/`.

### 11. SMS / app-credit popup
- **Trigger:** opens on a timer after page load. Default delay **2s**, exposed as a configurable prop (`popupDelay`, range 0–15s).
- **Overlay:** `position: fixed; inset: 0; z-index: 200`, bg `rgba(11,42,91,0.6)`, centered flex, `padding: 24px`. Clicking the overlay closes; clicks inside the panel are stopped from bubbling.
- **Panel:** `width: min(1030px, 100%)`, `max-height: 92vh`, `overflow: auto`, bg Cream, radius 6px, grid `repeat(auto-fit, minmax(320px, 1fr))`, shadow `0 30px 80px rgba(11,42,91,0.4)`. Entry animation `popIn 0.45s cubic-bezier(.2,.7,.3,1)`.
- **Left pane:** `padding: clamp(32px, 4vw, 56px)`, flex column gap 18px, centered content.
  - "Enter mobile phone number to join!" (15px, centered)
  - H2 "Get $5 in C&M House Credit"
  - "after downloading the mobile app" (15px, 80% opacity)
  - Phone input: `type="tel"`, placeholder "Mobile phone number", full width, `padding: 18px 20px`, 17px, bg Cream, `1.5px solid rgba(11,42,91,0.35)`, radius 4px, `outline: none`. **Focus:** border-color → Tomato.
  - Legal paragraph (13px/1.5, 75% opacity), verbatim: "New customers only. Only redeemable in the mobile app. By providing your phone number, you agree to receive marketing and transactional text messages from CULVER & MAIN. Consent is not a condition of purchase. Message and data rates may apply. Message frequency varies. Reply STOP to opt out, HELP for help."
  - "CONTINUE" button: full width, `padding: 18px`, 15px/700/0.12em uppercase, bg Tomato, cream text, radius 4px. Hover → bg Navy. **Not wired to a backend in the prototype** — needs an SMS opt-in endpoint.
- **Right pane:** `img/popup-food.png`, cover, `min-height: 320px`.
  - Close button: absolute `top:18px; right:18px`, 44×44, `border-radius: 50%`, bg Cream, Navy `✕`, 22px. Hover bg Yellow.
- **Suggested production behavior (not in prototype):** suppress after dismissal or submission via localStorage/cookie so it does not reappear every visit.

---

## Interactions & Behavior

### Navigation
Anchor links with `html { scroll-behavior: smooth }`. Header is sticky; account for its height when scrolling to anchors (`scroll-margin-top` on section targets).

### Animations
| Element | Animation | Timing |
|---|---|---|
| Hero image | `kenburns` — `scale(1.08) → scale(1)` | `1.8s cubic-bezier(.2,.7,.3,1)` both |
| Hero H1 | `rise` — `translateY(38px)` + fade | `0.9s cubic-bezier(.2,.7,.3,1)`, delay `0.12s` |
| Hero right column | `rise` | same, delay `0.34s` |
| Marquee track | `marquee` | `32s linear infinite` |
| About grid | `reveal` — `translateY(28px)` + fade | scroll-driven, `entry 0% → cover 26%` |
| Photo grid | `reveal` | scroll-driven, `entry 0% → cover 24%` |
| "EAT HERE" | `rise` | scroll-driven, `entry 0% → cover 22%` |
| Menu rows | `revealRow` — `translateY(14px)` + fade | scroll-driven, `entry 0% → cover 18%` (natural stagger) |
| Counter stats | `reveal` | scroll-driven, `entry 0% → cover 30%` |
| Popup panel | `popIn` — `translateY(16px) scale(0.96)` + fade | `0.45s cubic-bezier(.2,.7,.3,1)` |

Keyframes:
```css
@keyframes marquee   { from { transform: translateX(0); }        to { transform: translateX(-50%); } }
@keyframes reveal    { from { opacity:0; transform: translateY(28px); } to { opacity:1; transform:none; } }
@keyframes revealRow { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform:none; } }
@keyframes rise      { from { opacity:0; transform: translateY(38px); } to { opacity:1; transform:none; } }
@keyframes popIn     { from { opacity:0; transform: translateY(16px) scale(0.96); } to { opacity:1; transform:none; } }
@keyframes kenburns  { from { transform: scale(1.08); }          to { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
```

**Scroll-driven reveals use native CSS scroll timelines** (`animation-timeline: view()`), supported in Chromium. Safari and Firefox degrade gracefully — content renders statically, nothing breaks. If the target codebase needs cross-browser parity, reimplement these with IntersectionObserver + a class toggle, keeping the same distances and easing.

### Hover states (summary)
- Nav links: cream → Yellow
- Header CTA: Navy → Yellow bg, cream → Navy text
- Floating CTA: same
- Menu row: `padding-left: 14px`, border-color → Yellow, dish name → Yellow
- Menu ORDER NOW: Tomato → Yellow bg, cream → Navy text
- Footer links: cream → Yellow
- Photo grid main image: `scale(1.04)`
- Popup Continue: Tomato → Navy; close button: Cream → Yellow
- Generic links: Navy → Tomato

### Responsive behavior
Fluid rather than breakpoint-driven. All grids use `auto-fit` + `minmax()`, so columns collapse naturally: menu 3 → 2 → 1 at 280px min, footer 4 → 2 → 1 at 220px min, counter 2 → 1 at 360px min, popup 2 → 1 at 320px min. Type scales with `clamp()`.

Not yet designed and needed for production:
- **Mobile nav** — the four nav links plus logo and CTA will crowd below ~560px. Add a drawer or hamburger.
- **Photo grid** — `span 7 / span 5` is hard-coded 12-col and does not stack. Add a single-column rule below ~720px.
- **Hero H1** — verify the three-line break at narrow widths.
- **Popup** — on short viewports the panel scrolls internally; confirm the close button stays reachable (consider making it `position: sticky` in the single-column state).

### State management
Minimal. One boolean:
- `popupOpen: boolean` — false initially, set true by a `setTimeout(popupDelay * 1000)` on mount, set false by the close button or overlay click. Clear the timeout on unmount.
- `popupDelay: number` (seconds, default 2) — configuration, not runtime state.

No data fetching. Menu data is static and should live in a structured content source (JSON/CMS/markdown) shaped as `{ name, tag, desc }` per dish, grouped by category — the prototype already models it this way so the menu can be edited without touching markup.

Needs wiring in production: the popup phone form (SMS opt-in provider), analytics on both ORDER NOW buttons, and real URLs for Instagram, `/parking`, careers, and media inquiries.

---

## Assets

All in `design/img/`. All photography is the client's, supplied in this conversation.

| File | Dimensions | Used for | Notes |
|---|---|---|---|
| `hero.png` | wide banner | Hero background | Client-supplied wide crop of the dining room. Needs a responsive `srcset` and likely an AVIF/WebP conversion — it is a large PNG. |
| `spread.webp` | 500×500 | Photo grid, large left tile | Sandwiches, beet salad, fried chicken sandwich |
| `breakfast.png` | 500×500 | Photo grid, right tile | Culver Breakfast plate with matcha |
| `coffee.jpg` | 500×750 | Counter band | Barista pouring milk |
| `popup-food.png` | 522×573 | Popup right pane | **Cropped from a screenshot** of the client's existing popup. Low resolution and re-compressed — replace with the original photograph before launch. |
| `room.webp` | 500×750 | *(unused)* | Original dining-room shot, replaced by `hero.png`. Kept in case it is wanted elsewhere. |

Fonts load from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Archivo:wght@400;500;600;700&display=swap" rel="stylesheet">
```
Self-host both for production.

No icon set is used. The only glyphs are `✕` (popup close), `✳` (marquee separator), and `&` (wordmark) — all text characters, no icon library needed.

### Content that still needs sourcing
- Menu prices
- Real Instagram handle/URL
- Careers destination (currently a mailto)
- Additional food and room photography — the site currently carries five images and the photo grid would benefit from more

---

## Files

```
design_handoff_culver_and_main_site/
├── README.md                          ← this document
├── CLAUDE.md                          ← build instructions for Claude Code
├── design/
│   ├── Culver & Main Website.dc.html  ← the full site design
│   ├── Menu Directions.dc.html        ← four explored menu layouts; 1c was chosen
│   ├── support.js                     ← runtime required to open the .dc.html files
│   └── img/                           ← all image assets
└── screenshots/
    ├── 01-popup.png                   ← SMS popup over the hero
    ├── 02-hero.png                    ← announcement bar, nav, hero
    ├── 03-about.png                   ← About section
    ├── 04-menu-top.png                ← "EAT HERE" header
    ├── 05-menu.png                    ← menu columns
    ├── 06-photo-grid.png              ← food grid / counter band
    └── 07-footer.png                  ← footer
```

To view a design file: open the `.dc.html` in a browser with `support.js` alongside it and the `img/` folder in place.
