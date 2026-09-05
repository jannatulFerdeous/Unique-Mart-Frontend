# Project Memory

Running log of decisions, conventions and facts for Unique Mart. Append here as
the project evolves; keep entries short and factual.

## Project

- **Name:** Unique Mart — e-commerce storefront.
- **Stack:** Next.js 16.3.4 (App Router), React 19.2.8, TypeScript, Tailwind CSS v4.
- **Package manager:** npm.
- **Path alias:** `@/*` maps to the project root.

## Design reference

- Visual reference: <https://gadgetandgear.com/> — a Bangladeshi gadget store.
- **Fonts** are taken from that site. **Colors are not**: on 2026-09-02 the client
  asked for a black-and-white project, so the extracted orange brand palette was
  replaced with a monochrome ramp. Layout and typography stay as the reference.

### Colors — monochrome

**Black is primary, white is secondary.** Pure grayscale throughout; hierarchy
comes from contrast, weight and spacing, never hue.

| Token                | Value     | Use                                |
| -------------------- | --------- | ---------------------------------- |
| `primary`            | `#000000` | Black. Buttons, headings, icons    |
| `primary-hover`      | `#2e2e2e` | Hover on primary surfaces          |
| `primary-soft`       | `#f2f2f2` | Tinted fills, selected rows        |
| `primary-contrast`   | `#ffffff` | Anything sitting **on** primary    |
| `secondary`          | `#ffffff` | White. Cards, secondary buttons    |
| `secondary-hover`    | `#f2f2f2` | Hover on secondary surfaces        |
| `secondary-soft`     | `#fafafa` | Recessed secondary areas           |
| `secondary-contrast` | `#000000` | Anything sitting **on** secondary  |
| `ink`                | `#000000` | Body text                          |
| `ink-muted`          | `#525252` | Secondary text                     |
| `ink-subtle`         | `#8a8a8a` | Metadata, placeholders, eyebrows   |
| `canvas`             | `#fafafa` | Page background                    |
| `surface`            | `#ffffff` | Cards and panels                   |
| `surface-muted`      | `#f2f2f2` | Recessed sections                  |
| `line`               | `#e5e5e5` | Default borders and dividers       |
| `line-strong`        | `#cfcfcf` | Emphasised borders, inputs         |
| `inverse`            | `#1a1a1a` | Dark bars (header top row, footer) |
| `inverse-deep`       | `#000000` | Deepest dark strip (category bar)  |
| `inverse-raised`     | `#2b2b2b` | Controls sitting on a dark bar     |
| `inverse-hover`      | `#3d3d3d` | Hover on those controls            |
| `ink-inverse`        | `#ffffff` | Text on a dark bar                 |
| `ink-inverse-muted`  | `#b3b3b3` | Secondary text on a dark bar       |
| `line-inverse`       | `#2e2e2e` | Borders on a dark bar              |

Notes:

- Use the `-contrast` pair whenever you place content on a brand surface:
  `bg-primary text-primary-contrast`, `bg-secondary text-secondary-contrast`.
  This keeps a component readable if the brand pair is ever inverted.
- `primary` / `secondary` are the brand pair. `ink` / `surface` / `canvas` are
  the layout neutrals. They currently resolve to the same black and white, but
  they carry different intent — do not collapse them.
- There are deliberately **no semantic color tokens** (success / danger / sale).
  In a black-and-white system those states are signalled with icons, weight,
  strikethrough or copy. Add chromatic tokens only if the client asks for them.
- White-on-white swatches and cards need a `border-line` to stay visible.
- The `inverse-*` family is the dark-bar counterpart of the light neutrals. Use
  it for any surface that inverts the page (header, footer), and pair it with
  `focus-visible:outline-ink-inverse` — the global focus ring is black and
  disappears on those surfaces.

### Other tokens

- `--container-page: 82.5rem` (1320px) caps the page width. The reference site's
  container is **percentage-based**, not fixed-padding, so the gutter grows with
  the viewport until that cap. Never swap it for `px-*` gutters.
- Two `@utility` classes in `globals.css` own this, so no component repeats the
  widths (2026-09-04):
  - **`container-page`** — 95%, 85% from `lg`. Header, category bar, footer,
    trust strip, and every content section from here on.
  - **`container-page-bleed`** — 100%, 85% from `md`. Full-bleed artwork only;
    the hero banner is the sole user. It steps at **md, not lg**, because that is
    the breakpoint its artwork swaps on. **Do not merge the two.**
  Verified identical to the hand-written classes they replaced: 1224@108 at 1440,
  371@10 at 390, capped 1320@300 at 1920; hero 390@0 at 390 and 653@58 at 768.
  - **Open discrepancy, found 2026-09-05:** the reference's `.container` is 85%
    from **768** up, not from 1024 — swept at 1440/1280/1024/900/768, all 85%. So
    across the **768–1023 band every section of ours is 95% where the reference is
    85%** (the strap banner renders 729.6px against its 652.8px). This is global,
    not per-section, and both ends still match (1224 at 1440, 370.5 at 390), which
    is why the original verification missed it. Changing `container-page` moves the
    header, footer and every section, so it is recorded rather than fixed.
- `--radius-control: 0.3125rem` (5px) for buttons, `--radius-card: 0.75rem`
  (12px) for panels and menus. Both lifted from the reference site.
- `--shadow-menu` for floating menus, `--shadow-card` for resting surfaces.

### Header metrics (measured off the live reference, 2026-09-03)

Taken with Playwright against gadgetandgear.com at 1440px, not eyeballed from a
screenshot. Re-measure rather than guess if these need revisiting.

| Piece                    | Value                                  |
| ------------------------ | -------------------------------------- |
| Header total height      | 112px (66 top bar + 46 category strip) |
| Top bar                  | `py-3`, row `min-h-16.5` (66px)        |
| Top row gap              | 16px                                   |
| Search input             | h 40, `rounded-full`, `pl-6`           |
| Offers → Store Locator   | 16px (`lg:pl-4` on the button group)   |
| Between action buttons   | 24px (`lg:gap-6`)                      |
| Store Locator / icon btns| h 40, radius 5px, `bg-ink-inverse/10`  |
| Category strip           | `py-3 pr-2`, `gap-[2%]`, links unpadded|
| Category link            | `text-nav` → 21.7px tall               |
| Menu panel               | column 201px, radius 12px, flush `mt-3`|
| Menu item                | `px-4 py-2`, `text-nav`                |

Note the category links carry **no padding** — spacing is `gap: 2%` of the list
width, exactly as the reference does it. That makes the `<li>` only as tall as
its text, so `CategoryMenu` needs `top-full mt-3` to sit flush against the
bottom of the strip rather than under the link. Hover survives the 12px gap
because `onMouseLeave` sits on the `<nav>`, which spans the whole strip.
- `--animate-flash` (with its `@keyframes` nested in `@theme`) drives the
  pulsing thunder icon on the header's Offers link. Pair any looping animation
  with `motion-reduce:animate-none`.

### Original reference palette (archived, not in use)

`#f26e21` primary orange · `#191a20` primary-dark · `#ffca0d` secondary-yellow ·
`#3197e9` secondary-blue2 · `#19d77c` review green · `#36454f` icon charcoal ·
`#292d32` ink · `#f9f9f7` body background · `#f4f8f9` card · `#ededed` tint.

### Fonts

- Body / UI: **Heebo** (`--font-heebo`).
- Display / headings: **Montserrat** (`--font-montserrat`).
- Reference site declares `font-family: Heebo, Montserrat, sans-serif` on `body`.
- Loaded through `next/font/google` as variable fonts (no explicit weights).

## Architecture

Feature-module structure under `src/`, adopted 2026-09-02 from a structure the
client supplied (a NEWTECH repair-service frontend).

- `src/app/` — routes only. A route file imports a module and renders it.
- `src/common/` — `components/` (primitives) and `widgets/` (Header, Footer).
- `src/modules/<Feature>/` — one folder per feature, each with `config/` and
  `partials/` (see below).
- `src/shared/` — `config/`, `libs/`, `styles/`, `utils/`.
- `src/images/` — imported image assets (`public/` stays at the root).
- `@/*` resolves to `src/*` (set in `tsconfig.json`).

Two deviations from the supplied structure, both deliberate:

- **Module names are the e-commerce equivalents.** The reference had
  `Repair_Service`, `Repair_tracing`, `Portal` — meaningless for a store. Ours
  are Home, Shop, ProductDetails, Cart, Checkout, Login, Signup, Account,
  AboutUs, ContactUs, Blog.
- **`proxy.ts`, not `middleware.ts`.** The `middleware` file convention is
  deprecated in Next.js 16 and renamed to `proxy`; the export is `proxy()`.
  Codemod: `npx @next/codemod@canary middleware-to-proxy .`

### Module shape

Corrected 2026-09-04 after the client pointed at the supplied NEWTECH project
again. A module is **not** `components/` — it is:

```
modules/<Feature>/
  <Feature>.tsx     Composes the partials, nothing else
  index.ts          Barrel
  config/
    constants.ts    All the module's content, one `<module>_data` object
    types.ts        Types for that data
  partials/         One file per page section
```

- `partials/`, not `components/`. A partial is a **section of the page**, not a
  reusable primitive; reusable pieces still go to `common/components/`.
- `constants.ts` is the module's content layer — copy, prices, links, image
  imports. A partial renders markup and reads from `<module>_data`; it does not
  inline its own copy. This is what makes the sections swappable for real data
  later.
- Content is module-local until a second module needs it. Hero slides live in
  `modules/Home/config/`, **not** `shared/config/` — `shared/config/` is for
  genuinely site-wide things (site, navigation, footer).
- A partial that outgrows a single file nests the same shape recursively, as the
  reference does with `Blog/partials/TechBlog/{TechBlog.tsx,config/,partials/}`.

Two things deliberately **not** copied from the reference: it uses default
exports (`export { default } from './Home'`) and lowercase-camel type names
(`welcomeCardProps`). We keep named exports and PascalCase types, matching the
Header, Footer and `NavItem` already in this codebase.

The non-Home folders are scaffolded and empty (`.gitkeep` in `config/` and
`partials/`).

## Header

Built 2026-09-03 in `src/common/widgets/Header/`, mounted in the root layout
above `<main id="main">`. Layout mirrors the reference site: a dark top row
(logo · search · Offers · Store Locator · wishlist · cart · account) over a
black category strip with hover mega-menus.

- The **wishlist** heart is ours, added 2026-09-03 by client request — the
  reference site has no wishlist anywhere, so there was nothing to measure
  against. It reuses the existing `iconButton` recipe unchanged and sits before
  the cart, the usual wishlist → cart → account order. Verified at 390px: the
  third icon adds no horizontal overflow and the header keeps its 104/112px
  heights.

- `Header.tsx` (server) — shell, skip link, and `Organization` + `WebSite`
  JSON-LD carrying the `SearchAction` for the site search box.
- `SearchBar` uses `next/form` with a string action, so search works without JS
  and submits to `site.searchPath` as `?q=`.
- `CategoryBar` / `CategoryMenu` (client) open on hover **and** on focus, so the
  menu is keyboard-reachable; Escape closes. The reveal is two-step by client
  request (2026-09-03): a category shows only its sub items, and the third
  column appears only once a sub item is hovered — nothing is pre-selected.
  Panels stay mounted and toggle with
  `hidden`, which keeps all ~160 category links in the server-rendered HTML for
  crawlers. The last three categories align their panel `right-0`.
- `MobileNav` (client) is a drawer with `<details>` accordions. It stays mounted
  and slides in on a 300ms transform/opacity transition — conditional rendering
  gave no exit animation. Closed state is `invisible` + `inert`, with
  `transition-[visibility]` so visibility flips only after the slide finishes.
  Nested chevrons rotate via `[details[open]>summary>&]:rotate-180` — a
  `group-open` variant would also match outer `<details>` and rotate every
  chevron.
- Category tree lives in `src/shared/config/navigation.ts`, mirroring the
  reference site's top-level categories. Swap it for real data later.
- Icons come from `lucide-react` (Next.js tree-shakes it by default via
  `optimizePackageImports`). The one exception is
  `common/components/icons/ThunderIcon.tsx` — the Offers bolt, lifted verbatim
  from the reference site because no lucide glyph matches it. Its `viewBox` is
  `-6 -2 24 24`; that offset is the reference's own framing, not a mistake.
  Local icons take `SVGProps` and are sized by the caller's `className`.

## Footer

Built 2026-09-03 in `src/common/widgets/Footer/`, mounted in the root layout
below `<main>`. Server components throughout — no client JS.

Layout mirrors the reference: three link columns on the left, newsletter block
on the right, a call button above the first column, and a copyright / payment
row underneath.

### Metrics (measured off the live reference, 2026-09-03)

Taken with Playwright against gadgetandgear.com at 1440/768/390px. Our render
was measured back and matches at 1440: footer 369px, top 254px, lists 128px,
bottom 59px. Re-measure rather than guess.

| Piece                | Value                                              |
| -------------------- | -------------------------------------------------- |
| Footer               | `bg-inverse-deep`, `pt-10 pb-4` — 369px tall total |
| Top block            | `lg:flex lg:flex-row-reverse lg:justify-between`   |
| Link columns         | `grid gap-4 md:grid-cols-3 lg:flex-1`              |
| Newsletter column    | content-sized (`0 1 auto`), sits right of the grid |
| Column title         | `text-xl font-medium` (20/28), `mb-4`              |
| Link item            | `text-sm` (14/20), `mb-4` on every `li`            |
| Call button          | `w-min p-2 rounded-lg border`, `xl:px-4 xl:py-2`   |
| Call button label    | `text-base xl:text-2xl font-bold`; icon 20 → 32    |
| Newsletter form      | `mt-3 mb-6 flex gap-2`, controls `h-10`            |
| Subscribe button     | `px-4 py-2.5 text-sm font-medium`                  |
| Contact row          | `gap-4`, icon→label `gap-3`, icons 20px            |
| Social row           | `my-6 gap-4`, icons 24px                           |
| Bottom row           | `pt-6`, `md:flex-row md:justify-between`           |
| Payment strip        | 400×35 at desktop, full width at mobile            |

Notes:

- **`mb-4` sits on every `li`, with no `last:mb-0`.** The final margin collapses
  out through the `ul` and adds 16px to the column, which is what makes the
  block 254px and the footer 369px. Resetting it shortens the footer by 16px.
- The `li` carries `text-sm`, not the `<a>`. On the anchor alone the list item's
  own line box stays at the inherited 16px strut and each row renders 24px tall
  instead of 20px.
- Below `md` each `ul` becomes `flex flex-wrap justify-center gap-x-4` — the
  reference lays the links out as one centered wrapping row on phones and only
  stacks them once the three-column grid kicks in.
- The newsletter column is deliberately **not** given a width. Both sides use
  the reference's mechanism (`flex-1` grid, content-sized newsletter,
  `justify-between`), so its width follows the contact row's text. The
  reference's 380.52px is just where its own phone and email landed.
- Footer headings need `font-sans` **and** `text-ink-inverse`. The `@layer base`
  rule in `globals.css` paints every `h1`–`h6` in `--font-display` and
  `--color-primary` (black), which is invisible on the dark footer.
- **Accent colours stay monochrome.** The reference paints the call button,
  Subscribe and back-to-top in `#f26e21`; here they are greyscale, per the
  2026-09-02 black-and-white decision.
- **Subscribe is `bg-inverse-hover` (#3d3d3d) with `text-ink-inverse`**, client
  request 2026-09-03 — it was white, which read as one block with the white
  input beside it. Note the token name: the `inverse-*` control family is
  calibrated for the header's `#1a1a1a` bar, so on the footer's pure-black
  ground `inverse-raised` (#2b2b2b) is too dark to read as grey at all and the
  resting state has to borrow the hover step. Hover goes up to `ink-muted`.
  Add a dedicated control-on-black token if this pattern spreads.
- Copy fix: the reference's "Sign up for get latest news and update" is
  rewritten as "Sign up to get the latest news and updates".

### Icons

`lucide-react` v1 dropped the brand glyphs, so Facebook, Instagram, YouTube and
LinkedIn are local components in `common/components/icons/` (25×24 viewBox).
`PhoneIcon` and `MailIcon` are local too — lucide's `Phone` and `Mail` are
outlines and the reference uses solid fills (21×20 viewBox). All take
`SVGProps`, paint with `currentColor` and are sized by the caller.

## Home page

Built 2026-09-04 in `src/modules/Home/`. `app/page.tsx` renders `<Home />`,
which composes the hero banner and the trust strip. The reference's eight product
carousels below them need a product data layer that does not exist yet.

### Exclusive — the first product rail

`partials/Exclusive.tsx` (server) composes two new shared primitives, both in
`common/components/` because the reference reuses them across eight rails and
Shop will want them too:

- `SectionHeader` — centred title + "Show All" link.
- `ProductRail` (client) — the horizontal rail and its arrows.
- `ProductCard` (server) — one card.

`Product` and `ProductRailData` live in `shared/config/catalog.ts`; the rail's
content is `home_data.exclusive`.

#### Metrics (measured off the live reference, 2026-09-04)

| Piece            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Cards per view   | 2 (<800) · 3 (800–1199) · 5 (≥1200), gap 12px, 8px <500  |
| Card             | `rounded-banner` (16px), `bg-surface`, no border/shadow  |
| Card image       | square, equal to the card width                          |
| Body padding     | 8px, 16px from `md`                                      |
| Arrows           | 38×38, `rounded-control`, `border-line-strong`, on white |
| Section heading  | 19.2px w500, 25.6px from `md` (`--text-section`)         |

Verified against ours: card 235px with a 235² image and 12px gap at 1440 (5-up),
282px 3-up at 1024, 181px 2-up with an 8px gap at 390 — all matching.

Notes:

- **The rail is native scroll + snap, not a transform carousel.** It scrolls with
  no JS; the arrows only add paging on top, and hide at each end. That is a
  deliberate difference from the hero, which has to cross-fade whole slides.
- Breakpoints use `min-[500px]` / `min-[800px]` / `min-[1200px]` — the reference's
  own Swiper breakpoints, which do not line up with Tailwind's scale.
- **Card typography steps at exactly 768**, matching the reference: title
  12→16px, price 14.4→16px, old price 10→12px, Buy Now 12→13.6px, body padding
  8→16px. Without that step the price row wraps at 390.
- `--text-section` (1.6rem/1.55) is registered in `cn.ts`, per the `--text-*` rule.
- **`SectionHeader`'s `h2` needs `font-sans`.** The `@layer base` rule paints every
  h1–h6 in `--font-display` (Montserrat); the reference's headings are its body
  font. Same trap the footer headings hit.
- The title centres in the space left after the "Show All" link, so it sits
  slightly left of true centre — that is the reference's own layout, not a bug.
- **Monochrome:** the reference paints price, stars, Buy Now orange and the ribbon
  red. Here the discount reads through weight plus a struck-through `ink-subtle`
  old price, and the ribbon is `inverse-deep`. Client decision 2026-09-04.
- **The Apple "Authorized Reseller" badge on every card was dropped**, not
  restyled — third instance of a certification that is Gadget & Gear's, not ours.
  Cards are ~43px shorter than the reference's as a result.
- **The anchors are not nested.** The reference puts the Buy Now `<a>` inside the
  card `<a>`, which is invalid HTML. Here the image link is `aria-hidden` with
  `tabIndex={-1}`, and the title and Buy Now carry the real links, so the card is
  one tab stop per action rather than a broken nest.
- Prices format through `shared/utils/price.ts` with `Intl.NumberFormat("en-IN")` —
  Bangladesh groups by lakh, so 204999 must read "2,04,999", not "204,999".

### Brand wall — "Exclusively Available"

`partials/BrandWall.tsx` — server component. A `surface-muted` panel with the
heading on the left and 36 linked brand marks on the right. Content in
`home_data.brandWall`, logos in `src/images/brands/logos/` (36 files).

Notes:

- **The reference ships this whole panel as one flat 1320×330 JPEG**
  (`new-brand-pc740.jpeg`) — heading, rules and all 36 logos baked in, wrapped in
  a single link to `/brand`. **Rebuilt as markup**, client asked to "design the
  section" 2026-09-05. The image version scales to 304×76 at 320px, where the
  logos are a few pixels wide and unreadable; the text is also unselectable,
  untranslatable and invisible to search.
- The 36 logos came from the reference's **`/brand` page**, which lists every mark
  individually (91 brands) — not from slicing the composite. Same source as the
  Shop By Brands tabs, so the ten of those are reused rather than re-downloaded.
  Apple reuses the cropped glyph, so the reseller lockup stays out.
- Columns 3 → 4 (`min-[500px]`) → 6 (`md`) → 9 (`xl`). **36 divides by 3, 4, 6 and
  9**, so no step leaves a short last row. Nine columns wait for `xl`, not `lg`:
  at `lg` the grid shares its row with the heading and each tile is 45px wide.
  Verified 9×4 / 6×6 / 4×9 / 3×12 at 1440/1024/500/390.
- **Tiles use `<Image fill>`, not a flow image.** The logos have assorted intrinsic
  ratios, and a flow image taller than its `aspect-3/2` box grows the whole grid
  row — Meta's wide wordmark did exactly that, and `max-h-full` does not reliably
  resolve against an `aspect-ratio` box. With `fill` every tile measured a single
  uniform height at every width.
- Each mark is its own link to `/brands/<slug>`, so the logo carries a real `alt`
  (the brand name) rather than the tabs' `alt=""` + `sr-only` pattern — here the
  image *is* the link's accessible name. **None of those 36 routes exist yet.**
- Square corners on both the panel and the tiles, matching the reference; the hero
  and product cards use `rounded-banner`, so this section deliberately differs.

### Strap banner

`partials/StrapBanner.tsx` — server component, one full-width banner under New
Arrival linking to `/shop/watches/watch-strap`. Artwork in `src/images/promos/`,
content in `home_data.promos.straps`.

Notes:

- **Art-directed, not one image.** The reference serves two compositions:
  `watch-banner-web.png` 1320×330 (4:1) from 768 up, and `watch-banner.png`
  655×343 (1.909:1) below — squeezing the 4:1 crop onto a phone would leave it
  93px tall. Built with `getImageProps` + `<picture>` + `<source media>`, the same
  pattern and the same reason as `HeroBanner`: two `<Image>`s toggled with
  `hidden` would download both files. Verified — only the matching file is
  fetched at each width, and the swap lands exactly at 768/767.
- Sizes match the reference at 1440 (1224×306) and 1024 (870.4×217.6), and the
  mobile crop matches at 390 (370.5×194).
- **The CDN started returning 403 to `curl` partway through this work** (after
  ~100 asset pulls), browser headers and Playwright's `request` context included.
  What still works is hooking `page.on("response")` and saving the bytes as the
  page loads its own images — see `scratchpad/sniff.mjs` in the session notes.

### Promo banners

`partials/PromoBanners.tsx` — server component, no client JS. Two grids of
artwork under Top Selling: four square brand tiles, then two wide offer banners.
Content in `home_data.promos`, artwork in `src/images/promos/`.

#### Metrics (measured off the live reference, 2026-09-04)

| Piece            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Brand tile       | 330×330 artwork, 1:1 cell — 298.5px at 1440, 264.5 at 1280 |
| Offer banner     | 655×343 artwork, 1.909:1 — 607×317.9 at 1440             |
| Gap within grid  | 10px (`gap-2.5`)                                         |
| Gap between grids| 16px — the reference's `padding-bottom` on the first block |
| Radius           | none. These tiles are square-cornered, unlike the hero    |

Verified against ours at 1440/1280/1024: 298.5²/264.5²/210.1² and
607×317.9 / 539×282.3 / 430.2×225.3 — identical to the reference at every step.

Notes:

- **Columns are 2 → 4 at `lg`; the reference steps through 3 at `md`**, which
  leaves the fourth tile alone on a row of its own. Offer banners are 1 → 2 at
  `md`, matching the reference exactly.
- **The section has a `sr-only` `h2`, not an `aria-label`.** The reference's
  banner blocks carry no heading, but `HeroBanner` already labels itself
  "Featured offers" — a bare `aria-label` here produced two landmarks with the
  same accessible name, and `querySelector` picking the hero is how it was found.
- `alt` describes the offer copy too, because the copy lives inside the artwork:
  a sighted user reads "৳2,000 off, 0% EMI, Exchange" off the image, so a screen
  reader must get it as well.
- **The two offer banners are the strongest placeholder problem in the project.**
  Beyond the usual borrowed-artwork issue they carry the Apple Authorized Reseller
  badge (fifth occurrence) **and Gadget & Gear's own commercial terms** — "Up to 6
  Months 0% EMI", "৳2000 OFF", "৳4000 OFF", "Exchange", "*T&C APPLY". Shipping
  these advertises discounts and finance terms Unique Mart has not agreed to.
  The four brand tiles are ordinary brand marketing and much milder.

### Top Selling

`partials/TopSelling.tsx` — server component. `SectionHeader align="left"` plus
the shared `ProductRail`; twelve products in `home_data.topSelling`, photography
in `src/images/products/`.

Notes:

- **Exclusive is the only product rail the reference centres.** Measured across
  every `h2` on the page 2026-09-04: Exclusive `center`, Featured Categories
  `center`, Shop By Brands `start` (centred by flex), and then Top Selling, New
  Arrival, Gaming Mania, Sound Surround and Cases & Screen Protector all `left`,
  in the same `flex-1` row. `SectionHeader` therefore takes `align`, defaulting to
  `center`; every rail after Top Selling should pass `align="left"`.
- Products carry a `brand` text line (Torras, JBL, PITAKA, Spigen, Apple,
  TP-Link, Google). The reference uses a brand **logo** here — and for Apple that
  logo is the Authorized Reseller lockup again. Text keeps this section free of
  seven more logo files.
- **`iphone-17-pro-max` is in both Exclusive and Top Selling**, as it is on the
  reference. Its import is reused rather than the photo re-downloaded.
- No `badge` on any of the twelve. The reference no longer ribbons the Deco S7 the
  way the client's screenshot shows; not invented — same call as Shop By Brands.
- The rail scrolls at every width (12 products against 5-up at most), so unlike
  Shop By Brands its arrows are always live.

### Sound Surround

`partials/SoundSurround.tsx` — server component, identical in shape to Top
Selling and New Arrival. Eight speakers in `home_data.soundSurround`.

Notes:

- **Mounted directly after the strap banner, but the reference runs Gaming Mania
  in between.** Insert `GamingMania` above `SoundSurround` in `Home.tsx` when it
  is built; there is a comment there saying so.
- Four brands: JBL (×4), Marshall (×2), Sony, BE@RBRICK.
- **Settled the ribbon question for good.** The client's screenshot shows a red
  "NEW ARRIVAL" ribbon on all five visible cards, and the live reference renders
  none. Walking every text node on the page, "new arrival" appears exactly twice:
  the New Arrival section's own `h2`, and the `__NEXT_DATA__` payload. The product
  objects in that payload have **no ribbon field at all** — the keys are `p_id,
  name, shortName, slug, thumbnail, isOnline, comingSoon, brand_id, brand_name,
  brand_logo, category_id, category_name, stockQuantity, price, discounted_price,
  review, id`. So the reference dropped the feature, which is why all four scraped
  rails came back badge-less. `home_data.exclusive`'s two MacBook Neo entries keep
  their badge from 2026-09-04, when it was still there, so `ProductCard`'s ribbon
  is still exercised. Adding badges now would be inventing merchandising claims.

#### Scraping the reference: two gotchas found 2026-09-05

- **Sections below the fold are not in the DOM until scrolled.** Scroll the whole
  page before querying, or `header.nextElementSibling` walks off a null.
- **A rail only loads the images it has shown.** Three of these eight never
  downloaded until the rail was paged to its end — click the next arrow a few
  times after scrolling, then capture. See `sniff-ss.mjs`.

### New Arrival

`partials/NewArrival.tsx` — server component, the same shape as Top Selling:
`SectionHeader align="left"` plus `ProductRail`. Eight products in
`home_data.newArrival`, photography in `src/images/products/`.

Notes:

- Sits **after the brand wall and before the reference's watch-strap banner**,
  which is where the reference puts it. Page heading order now matches:
  Exclusive · Featured Categories · Shop By Brands · Top Selling · (banners) ·
  Exclusively Available · New Arrival.
- Three brands: Samsung (Galaxy Watch 7/8/8 Classic), Starlink (Mini and Standard
  Kit) and Apple (MacBook Pro 14" M5, iPad Pro 11"/13" M5).
- **First non-5.0 rating in the project** — Galaxy Watch 7 is 4.8. `ProductCard`
  rounds for the star row (`Math.round`), so it paints five filled stars beside
  "(4.8)". The reference does the same; leave it unless the client wants halves.
- No `badge` on any of the eight, matching the reference. Third rail in a row
  where the client's screenshot showed ribbons the live site no longer has.

### Cases & Screen Protector

`partials/CasesAndProtectors.tsx` — server component, identical shape to New
Arrival and Sound Surround: `SectionHeader align="left"` plus `ProductRail`.
Nine products in `home_data.casesAndProtectors`, photography in
`src/images/products/` (all 800×800, so `aspect-square object-cover` crops
nothing).

Notes:

- **Runs last on the page**, after Sound Surround — that is the reference's own
  order. Full reference heading order, from the `title` widgets in its payload:
  Exclusive · Featured Categories · Top Selling · New Arrival · Gaming Mania ·
  Sound Surround · Cases & Screen Protector.
- Pulled 2026-09-05. The rail is **client-rendered on the reference** — its
  `swiper-wrapper` ships empty with skeleton placeholders — so the data is not in
  the served markup. It *is* in the RSC flight payload: find the product array by
  name and brace-match outward. `sniff-ss.mjs`-style scraping is unnecessary here.
- Upstream ships **eleven** products; the two `comingSoon: true` Torras Ostand Q3
  Air cases are excluded, leaving nine.
- Five brands: UAG, Spigen (×3), Torras (×2), Apple, Belkin (×2).
- **Every product has `review: 0` upstream**, so none carry a `rating` and the
  star row collapses on all nine cards. First rail in the project with no ratings
  at all — good regression check for the `mt-auto` fix that pins Buy Now down.
- **First rail to use `badge`** since Exclusive: the client's screenshot shows
  `NEW ARRIVAL` ribbons and the live site still has them, so the front five carry
  the badge. Renders monochrome (`bg-inverse-deep`), not the reference's red — the
  screenshot's orange prices and red ribbons are *not* reproduced, per the
  black-and-white decision of 2026-09-02.
- Upstream misspells one slug `spigen-ultra-hyrbird-magfit-…`; ours corrects it to
  `…-ultra-hybrid-magfit-…`. Image filename follows our slug, not theirs.
- Product images live under `assets.gadgetandgear.com/upload/` + the payload's
  `thumbnail` path. Several thumbnail paths contain **spaces and parentheses** and
  must be percent-encoded before fetching.
- Show All points at `/shop/cases-protectors`, which is the route in
  `navigation.ts`. The reference's own URL is `/category/cases-screen-protectors`;
  do not copy upstream category URLs, they do not match our nav tree.

### SEO copy block (About)

`partials/AboutCopy.tsx` — server component, closes the home page below Cases &
Screen Protector. One `h2` and five `h3`s, ~490 words. **The only partial whose
copy is not in `constants.ts`**: the prose carries inline `Link`s and threading
anchors through a data structure costs more than it saves.

Notes:

- **The client confirmed the claims on 2026-09-05.** The copy may assert only what
  the trust strip already asserts — 100% Authentic, Official Product, 0% EMI,
  Exchange, Fastest Delivery, 100% Secure Payment — plus online-only nationwide
  delivery. **No authorization claim and no superlative.**
- The reference's entire block is "Bangladesh's most trusted **Apple Authorized
  Reseller**", founded **2011**. All of that is Gadget & Gear's, not ours; the
  same substitution the trust strip already made. Do not reintroduce it.
- **`site.since` was 2025 and is wrong — the client says 2026.** Corrected in
  `src/shared/config/site.ts`, which also feeds `foundingDate` in the Header's
  structured data, so the JSON-LD was wrong too.
- Deliberately **light on brand names**. The stocking roster is still unconfirmed
  (see the brand-wall warning below), so the prose names *categories*, which exist
  in `navigation.ts`, rather than advertising a brand list on no evidence.
- Every category link is checked against `navigation.ts` — eleven routes, all
  present. Re-check if the nav tree is reorganised.
- Online-only by the client's answer: no showroom, pickup or store-locator copy,
  despite `src/images/banners/store-locator-*.png` existing.

#### `ProductCard`: Buy Now is bottom-pinned

Found while building this rail. The rating row is the one optional row above the
button, so a card with no rating pulled its Buy Now up and the row stopped lining
up — visible immediately in Top Selling, which mixes rated and unrated products.
Buy Now now sits in a `mt-auto pt-4` wrapper, 16px above the card foot in every
rail. Exclusive never showed the bug (all seven are rated) but was relying on
luck; verified 16px on Exclusive, Shop By Brands and Top Selling alike.

### Shop By Brands

`partials/ShopByBrands.tsx` — **client** component (it owns the selected tab).
`SectionHeader` + a brand tab strip + a `ProductRail` that swaps with the tab.
Content in `home_data.brands`, artwork in `src/images/brands/`.

#### Metrics (measured off the live reference, 2026-09-04)

| Piece            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Heading          | 25.6px w500 centred, with a Show All link (`SectionHeader`) |
| Tab              | 94.4×48, logo 86.4×45 `object-contain`, 24px apart       |
| Active tab       | 3px `::after` underline, `#f26e21` on the reference      |
| Rule under strip | 1px `rgba(173,173,173,.6)` — ours is `line-strong`, ~same |
| Card brand chip  | 72×28 logo, `margin: 2px 0 8px`                          |
| Rail             | the same `ProductRail`, arrows 38×38                     |

Notes:

- **Tabs are the reference's own logo images**, in `src/images/brands/logos/`,
  384×200 transparent PNGs. Client decision 2026-09-04, reversing the text-wordmark
  choice made earlier the same day. Tab 96×48 with an 88×44 `object-contain` logo,
  against the reference's 94.4×48 and 86.4×45.
- **`apple.png` is cropped, not the file as downloaded.** The reference's
  `apple-authorized-reseller207.png` is the full "Apple Authorized Reseller"
  lockup — a certification claim, the same asset dropped three times before. The
  Apple glyph was cut out of it (content x 50–126, the gap before the text sits at
  126–152) and recentred on the same 384×200 canvas at 62% height. The other nine
  files are plain wordmarks despite their `-aas` filenames; that suffix is Gadget &
  Gear's naming convention, not certification artwork. **Verified by eye, not by
  filename** — check any replacement the same way.
- **The logos are in full colour** (OPPO green, vivo blue, OnePlus red, TECNO
  blue, Xiaomi orange), the one deliberate exception to the black-and-white
  decision: a brand mark cannot be recoloured without misrepresenting it. Add
  `grayscale` to the tab image if the client wants them neutralised.
- Inactive tabs sit at `opacity-70`, full on hover. The reference dims nothing and
  marks the active tab with the underline alone; the dim is ours, since ten
  full-colour marks make a 3px underline easy to miss.
- **The strip needs its chevrons.** At 96px per tab it overflows from ~1200 down
  (1176 of scroll width against a 988 viewport at 1200), and `no-scrollbar` hides
  the bar, so without them a mouse user cannot tell the later tabs exist. They
  hide at each end and are both hidden at 1440, where all ten fit. Native
  `scrollBy` smooth scrolling is fine here — there is no scroll snap to fight,
  unlike `ProductRail`.
- Tabs follow the WAI-ARIA **tabs pattern**: `role="tablist"`/`tab`/`tabpanel`,
  roving `tabIndex` so the strip is one Tab stop, and ←/→ move the selection with
  wraparound. The reference's are plain buttons with no roles.
- **`key={brand.key}` on the rail** remounts it per tab, so switching resets the
  scroll position and the arrows. Without it the arrows keep the previous brand's
  state and can both be hidden on a rail that now scrolls.
- Logos are decorative (`alt=""`); each tab carries its brand name in an `sr-only`
  span, so the accessible name is "Samsung", not the reference's
  `alt="filter item image"`.
- **Each tab button must keep `relative`.** `sr-only` is `position: absolute`, so
  without a positioned ancestor its containing block is the page, not the tab —
  the ten labels then escape the strip's `overflow-x-auto` clip, land at x≈1137,
  and **drag the whole document sideways on every width below 1024**. Found
  2026-09-05: the page scrolled 748px at 390 and the header slid off-screen.
  Beware the wrong test — `section.scrollWidth` and even
  `documentElement.scrollWidth` both looked fine or ambiguous; what actually
  proves it is wheeling horizontally and watching `window.scrollX`, or hiding one
  section at a time and re-reading `documentElement.scrollWidth`. Any absolutely
  positioned child inside a scroll container needs the same treatment.
- `ProductCard` gained an optional `brand` line (12px/700, uppercase,
  `ink-subtle`, `mb-2`) above the title, matching the reference's logo chip as
  text. It is **conditional**: Exclusive's products carry no `brand`, so that rail
  renders byte-identical — verified, its card is still 235.2×412.9 with no brand row.
- **Five products per brand means the rail does not scroll at ≥1200**, where the
  rail is 5-up: the arrows correctly hide because everything already fits. The
  reference carries ~10 per brand and so always shows them. Raise the count if the
  arrows are wanted at desktop.
- **No `badge` on any brand product.** The reference no longer marks these
  "NEW ARRIVAL" — the client's screenshot predates a catalogue change — and the
  ribbons were not invented. `Exclusive` still demonstrates the mechanism.
- Verified at 1440/1200/1024/768/500/390: tabs scroll only below 640, the rail
  scrolls below 1200, and the section never overflows horizontally.

### Featured Categories

`partials/FeaturedCategories.tsx` — server component, no client JS. Fifteen
circular category tiles under the Exclusive rail; content in
`home_data.categories`, artwork in `src/images/categories/`.

#### Metrics (measured off the live reference, 2026-09-04)

| Piece            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Heading          | 25.6px w500 (`--text-section`), centred, **no Show All** |
| Heading → circles| 32px                                                     |
| Circle           | 104px ≥1024 · 96px 768–1023 · 70.4px ≤600 · 64px at 320  |
| Circle fill      | `#f3f4f6` (ours: `surface-muted`), `rounded-full`        |
| Image            | 132×132 PNG, `object-contain`, 16px padding              |
| Circle → label   | 16px                                                     |
| Label            | 13.6px/700, `line-clamp-2`, box fixed at 2 lines         |
| Row pitch        | card 170.1px + 16px gap                                  |

Notes:

- **The reference is a Swiper grid pinned at 8 columns × 2 rows at every width**,
  so below 1024 it scrolls sideways — at 390 only ~4 of 8 columns are visible.
  **We use a wrapping flex row instead**, client decision 2026-09-04: all fifteen
  stay visible on a phone. Same reasoning as the trust strip, which we also kept
  on mobile where the reference hides it.
- Columns step 3 → 5 (`min-[500px]`) → 6 (`md`) → 8 (`xl`). **15 divides by 3 and
  5**, so those two steps fill their rows exactly; 6 and 8 leave a short trailing
  row, which `justify-center` centres — matching the reference's centred row of
  seven. Verified 8+7 at 1280/1440/1920, 6+6+3 at 768–1279, 5+5+5 at 500–767,
  3×5 at 320–499, with no horizontal overflow at any width.
- **`flex flex-wrap justify-center`, not `grid`.** A grid cannot centre a short
  last row. Column widths are fractions and the gutter is `px-1` on each item, so
  there is no `gap` to subtract from the percentages.
- **Use `xl:`, not `min-[1280px]:`.** Tailwind emits arbitrary `min-[]` variants
  *before* the named breakpoints, so `min-[1280px]:w-[12.5%]` loses the cascade to
  `md:w-1/6` and the section silently stays 6-up on desktop. `min-[500px]` is safe
  only because it sits below every named breakpoint it competes with.
- The circle is `w-full` with a `max-w-*` cap per breakpoint, so it shrinks with a
  narrow column instead of overflowing it. The reference's fixed 104px circle
  overflows its own 110.6px slide at 1024; ours lands at 100.8px there.
- Label reserves two lines
  (`min-h-[calc(2*var(--text-nav--line-height)*var(--text-nav))]`) whether or not
  it needs them, which is what keeps every circle in a row at the same height.
  Ours is `text-nav` (14px) against the reference's 13.6px — a 0.4px deviation
  taken to reuse the existing token rather than add a step. Card is 187.4px tall
  against the reference's 170.1px as a result.
- `alt=""` on every tile: the label beside it already names the category, so the
  image is decorative and a repeated alt would double-announce it.
- **`/shop/car-accessories` has no entry in `categoryNav`.** The other fourteen
  hrefs map onto existing nav routes; that one is the reference's category with no
  counterpart in our tree.

### Trust strip

`partials/TrustStrip.tsx` — server component, no client JS. Six icon + label
guarantees under the hero, content in `home_data.trust`.

#### Metrics (measured off the live reference, 2026-09-04)

| Piece            | Value                                             |
| ---------------- | ------------------------------------------------- |
| Section          | 96px tall at ≥1280, `py-6` around 48px items      |
| Gap from hero    | 20px (`mt-5`)                                     |
| Container        | `w-[95%] max-w-page lg:w-[85%]` — the site default |
| Item             | `h-12`, `gap-4` icon→label, `px-3`                |
| Icon             | 36px at ≥1280, 24px below                         |
| Label            | 16px/700 at ≥1280, 14px/600 below                 |
| Divider          | 1px right border, `line-strong`, not on the last  |

Notes:

- **The reference steps its sizes at exactly 1280 (`xl`)** — icon 24→36, label
  14px/600→16px/700, item 40→48. Verified by sweeping 1024→1536.
- **We put the six-across row at `xl` too, where the reference puts it at 1024.**
  At 1024 our labels wrap: our copy differs, and six items plus dividers need the
  xl type step to fit 1088px. Below xl it is a grid — 3 columns from `md`, 2 below.
  Measured clean at 1536/1440/1280/1279/1024/768/390; at 320 "100% Secure Payment"
  wraps to two lines, which is fine and does not overflow.
- **The reference hides this strip entirely below 1024** (`display:none`, verified
  at 900–1020). We keep all six on mobile — client decision 2026-09-04, on the
  grounds that a BD storefront's traffic is mostly phones and trust badges are
  exactly what a first-time buyer needs there.
- Icons are lucide, monochrome, per the black-and-white decision; the reference
  paints them purple/yellow/red/green. `strokeWidth={1.5}` to match the
  reference's lighter line.
- **"Apple Authorized Reseller" was replaced with "100% Authentic."** That is
  Gadget & Gear's certification, not Unique Mart's — the same problem as the
  banner artwork. It also avoids needing an Apple wordmark asset, which lucide v1
  does not carry (brand glyphs were dropped).

### Hero banner

Split across two partials:

- `partials/HeroBanner.tsx` — **server**. Runs each slide's two artworks through
  `getImageProps` and hands the finished attributes down.
- `partials/HeroCarousel.tsx` — **client**. State, timer, swipe, dots. Hand-rolled,
  no carousel dependency: the reference runs Swiper, but at one slide per view the
  whole thing is a translated flex track and a timer, and the project has no UI
  dependencies beyond lucide / clsx / tailwind-merge.

The split exists so the optimiser work stays on the server; only the resolved
`srcSet` strings cross the client boundary.

#### Metrics (measured off the live reference, 2026-09-04)

Playwright against gadgetandgear.com at 17 widths from 320 to 1920. Our render
was measured back and matches at both ends: 1440 → section 375px, viewport
1208×359 at x=116; 390 → section 278px, viewport 374×262 at x=8.

| Piece            | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| Container        | `w-full max-w-page md:w-[85%]` — **full bleed** < md   |
| Padder           | `p-2` (8px) at every width                             |
| Viewport         | `aspect-10/7`, `md:aspect-64/19`, `overflow-hidden`    |
| Image            | `object-cover`, `rounded-banner` (16px)                |
| Track            | `flex`, `transition-transform duration-300 ease-out`   |
| Autoplay         | 5000ms dwell (`home_data.hero.interval`), 300ms slide   |
| Dots             | 8px circles, 16px pitch, `bottom-2`, centred, no arrows|

Notes:

- **The hero's container is not the header's.** Header and footer are
  `w-[95%] lg:w-[85%]`; the hero is `w-full md:w-[85%]` — edge to edge on phones,
  and it steps to 85% at **md (768px)**, not `lg`. Both are the reference's own
  behaviour, verified at the breakpoint. Do not "unify" them.
- 768px is also where the artwork swaps, so the aspect-ratio step and the
  `<source media>` query must stay on the same breakpoint or the image letterboxes.
- `--radius-banner: 1rem` (16px) is a third radius step, lifted from the
  reference. `radius-card` (12px) is a different thing; do not reuse it here.
- **The dots take their colour from the current slide's `theme`.** Each banner in
  the config declares `dark` or `light`, because our slides alternate grounds and
  the reference's fixed near-black bullet is invisible on a black banner. Dark →
  `bg-ink-inverse` / `/35` and `focus-visible:outline-ink-inverse`; light →
  `bg-ink` / `/20`. Inactive white needs 35% where black needs 20% to read the same.
- Dot buttons are 24px targets with `-mx-1` pulling them back to the reference's
  16px visual pitch. The 8px dot is a `<span>` inside; do not shrink the button.
- Art direction uses `<picture>` + `<source media>`, not two `<Image>`s toggled
  with `hidden`/`md:block` — a `display:none` image is still downloaded, so that
  pattern fetches both compositions.
- **Both variants are built with `getImageProps`**, Next's documented art-direction
  escape hatch, so the `md`-and-up `<source>` is optimised too. A plain
  `srcSet={slide.desktop.src}` ships the original file, and one banner is a 2MB
  PNG. Each variant gets the `sizes` of the viewport it actually renders in —
  `100vw` below md, `85vw` above. Measured result: 5.8MB of source art loads as
  136KB at 1440 and 102KB at 390, and only the matching composition is fetched.
- The `<img>` repeats `alt` out of the `getImageProps` spread purely so
  `jsx-a11y/alt-text` can see it; the spread already carries it.
- `preload` (Next 16's replacement for the deprecated `priority`) is deliberately
  **not** set: it would preload the mobile artwork, which is the wrong file on
  desktop. The first slide is `loading="eager"` instead.
- Autoplay is a `setTimeout` keyed on `index`, so a dot press or swipe restarts the
  full dwell instead of inheriting the remainder of the previous one.
- Deviations from the reference, all agreed with the client 2026-09-04: the track
  loops back to slide 1 instead of dead-ending on the last slide, autoplay pauses
  on hover and on keyboard focus, and `prefers-reduced-motion` disables autoplay
  entirely and drops the transition. Reduced-motion users still get every slide
  through the dots — that is the pause mechanism WCAG 2.2.2 asks for.
- Off-screen slides carry `inert`, so only the visible slide's link is tabbable
  (verified: 1 of 6). All six slides and links are still in the server HTML for
  crawlers, and slide 1 renders correctly with JS disabled.
- Horizontal swipe is pointer-events with a 44px threshold and `touch-pan-y`, so
  vertical scrolling is untouched. A swipe that starts on a slide sets a ref that
  an `onClickCapture` uses to cancel the link — otherwise every swipe navigates.

### Banner artwork — the reference site's own files

`src/images/banners/`, 12 files, ~5.8MB total: six slides × desktop (1920×570)
and mobile (1000×700). Pulled from `assets.gadgetandgear.com/upload/media/Home+Banner/`
on 2026-09-04 at the client's request, replacing the monochrome SVG placeholders
that were there first.

> **These are Gadget & Gear's marketing assets and cannot ship.** They carry the
> G&G wordmark, Apple "Authorized Reseller" badges, bKash branding, and — on the
> store-locator slide — a competitor's storefront photo, street address
> (bti Landmark, 16 Gulshan Avenue) and domain. They are a build-time stand-in for
> layout and timing only. Swap them for Unique Mart artwork before any deploy.

- `bkash-*.jpg` are 1344×399 and 700×489, not the 1920×570 / 1000×700 the other
  ten use. The desktop ratio is identical (3.368); the mobile one is 0.2% off and
  crops by about a pixel under `object-cover`. Not worth correcting.
- **Every slide is `theme: "light"`.** All twelve files were sampled at the dot
  strip and came back at luminance 142–255, which is why the reference can
  hardcode one near-black bullet. The per-slide theme mechanism stays because real
  artwork may well be dark — it just has nothing to do right now.
- The `alt` strings in `modules/Home/config/constants.ts` describe what is
  actually in each image, including the competitor's store name on slide 6.
  Replace art and alt together or the alt starts lying.
- `href`s were remapped from the reference's own URLs onto our routes
  (`/shop/*`, `/brands`, `/offers`, `/store-locator`).

## Conventions

- Design tokens live in one place: the `@theme` block in
  `src/shared/styles/globals.css`. Never hardcode a hex value in a component —
  add or use a token.
- Fonts are configured in `src/shared/libs/fonts.ts` and applied once on
  `<html>` via `fontVariables`.
- `cn()` from `src/shared/utils/cn.ts` merges class names
  (`clsx` + `tailwind-merge`).
- **Register every custom `--text-*` step in `cn.ts`.** tailwind-merge only
  knows Tailwind's built-in scale, so it reads an unknown `text-foo` as a
  *color* and silently drops it when a real `text-<color>` class follows in the
  same `cn()` call. That is why `cn.ts` uses `extendTailwindMerge` with a
  `font-size` class group listing `text-nav`. Symptom when it is missing: the
  size applies on plain className strings but vanishes on any element whose
  classes go through `cn()` with a colour — e.g. only the *hovered* menu item
  renders at the wrong size.
- One type step for every navigation label: `--text-nav` (14px / 1.55). It
  covers top-level categories, sub items and sub-sub items, desktop and mobile,
  so the three levels never drift apart. All nav labels inherit `--font-sans`
  (Heebo); only the logo uses `font-display`.
- Site-wide constants (name, tagline, url) live in `src/shared/config/site.ts`
  and feed `metadata` in the root layout.
- Comments are short or absent; code should read on its own.

## Environment notes

- `AGENTS.md` is regenerated by `next dev`. Commit it with changes rather than
  deleting it, or it reappears as an uncommitted diff.
- This Next.js version types layout props as `LayoutProps<"/">` — do not replace
  it with a hand-written `{ children: React.ReactNode }`.

## Open items

- Header links point at routes that do not exist yet (`/shop/*`, `/search`,
  `/offers`, `/store-locator`, `/wishlist`, `/cart`, `/account`). The footer adds
  `/brands`, `/careers`, `/blogs`, `/about`, `/faq`, `/terms`, `/loyalty`,
  `/privacy`, `/cookies` and `/newsletter` to that list. Every hero slide links
  into `/shop/*`, `/offers` or `/store-locator`, so it inherits the same gap.
- **Blocking before launch:** hero banner artwork in `src/images/banners/` is
  Gadget & Gear's, complete with their logo, a competitor's shop address and
  third-party brand marks. Swap the files and the matching `alt` text together.
- Product names, prices, ratings and imagery in `home_data.exclusive`,
  `topSelling`, `newArrival` and `soundSurround` are the reference site's, and
  `src/images/products/` holds its photography (34 files). Same must-replace
  status as the banner artwork. Those rails also name twelve third-party brands in
  their card lines (Torras, JBL, PITAKA, Spigen, Apple, TP-Link, Google, Samsung,
  Starlink, Sony, Marshall, BE@RBRICK) — same stocking question as the Shop By
  Brands tabs.
- `src/images/categories/` — the reference site's own fifteen category PNGs
  (132×132, ~200KB total), pulled from `assets.gadgetandgear.com/upload/media/`
  on 2026-09-04. Same must-replace status. They are product cut-outs with no G&G
  branding, so the licensing problem is milder than the banners', but they are
  still not ours. At 132px they are also soft on a 2× display at the 104px size.
- `/shop/car-accessories`, linked from Featured Categories, is not in
  `categoryNav`. Either add the category to the nav tree or repoint the tile.
- `src/images/brands/` — 50 product photos (ten brands × five), pulled from
  gadgetandgear.com on 2026-09-04, with their names and prices in
  `home_data.brands`. Same must-replace status as the banners and the Exclusive
  rail. The **brand names themselves are third-party trademarks** (Samsung, Oppo,
  vivo, HONOR, OnePlus, Tecno, Infinix, realme, Xiaomi, Apple); a reseller may
  name them, but confirm what Unique Mart actually stocks before launch — right
  now the tab strip advertises ten brands on no evidence — and the brand wall
  claims **36 brands are "Exclusively Available"** at Unique Mart, which is a
  stronger claim still. Confirm the roster, and the word "exclusively", before
  launch.
- `src/images/brands/logos/` — 36 brand marks, taken from the reference on
  2026-09-04 (ten, for the tabs) and 2026-09-05 (26 more, for the brand wall).
  **Third-party trademarks, not licensed artwork**: a retailer
  normally may show the marks of what it genuinely sells, so these stand or fall
  with the stocking question above rather than with the placeholder-artwork one.
  `apple.png` was cropped out of the reseller lockup — do not re-download it from
  the reference without cropping again.
- Brand tab hrefs point at `/shop/phones/android/<brand>`, which exists in
  `categoryNav` for Samsung, Xiaomi, realme, OnePlus, Infinix and Tecno, but
  **not for Oppo, vivo or HONOR** — those three are new routes. Apple's tab points
  at `/shop/phones/iphone`.
- The home page is the hero, the trust strip, Exclusive, Featured Categories,
  Shop By Brands, Top Selling, the promo banners, the brand wall, New Arrival,
  the strap banner, Sound Surround, Cases & Screen Protector and the SEO copy
  block. **Gaming Mania is the one section still missing** — it belongs *above*
  Sound Surround, and is `align="left"` like every rail after Exclusive.
- **The promo offer banners advertise discounts Unique Mart has not agreed to.**
  `src/images/promos/airpods-pro-3.png` and `apple-watch.png` carry "0% EMI up to
  6 months", "৳2,000 OFF" / "৳4,000 OFF", "Exchange" and an Apple Authorized
  Reseller badge, all baked into the artwork. Blocking before launch, and a
  stronger problem than the borrowed photography elsewhere: it is a commercial
  claim, not just someone else's picture.
- **The header overflows at 320px**, scrolling the page 28px sideways
  (`body.scrollWidth` 348 vs 320). Found 2026-09-05 by hiding one top-level block
  at a time: the `<header>` is the only one that clears it. Separate from the
  `CategoryBar` problem below, which is a `lg`-and-up issue.
- **`CategoryBar` overflows below ~1250px.** Found 2026-09-04 while measuring the
  trust strip and confirmed again on the product rail: at 1200 `scrollWidth` is
  1232 and at 1024 it is 1183, so the whole page scrolls sideways. The strip is not the cause. The bar is
  `hidden lg:block` with `gap-[2%]` and no wrap or scroll, so it goes straight
  from hidden to overflowing at the `lg` boundary. Needs an overflow-x-auto or a
  higher breakpoint.
- The trust strip's six guarantees are plausible defaults, not client-confirmed
  claims. Check "0% EMI", "Exchange" and the delivery promise against what Unique
  Mart actually offers before launch.
- Footer contact details and social URLs in `shared/config/site.ts` and
  `shared/config/footer.ts` are placeholders — swap for the client's real ones.
- The payment-method strip is an empty slot held at the artwork's 640×56 ratio.
  Drop the logos into `src/images/` and render them with `next/image`.
- The newsletter form posts to `site.newsletterPath` with no route behind it.
- The copyright year comes from `new Date().getFullYear()` in a statically
  prerendered layout, so it is fixed at build time until the next deploy.
- No product or cart routes yet.
- No data layer or CMS chosen; nav categories are static config.
- Cart and wishlist show no item-count badge — the reference has none either.
  Add them when cart / wishlist state lands.
