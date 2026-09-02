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

- `--container-page: 82.5rem` (1320px) — used as `max-w-page`. The reference
  site's container is **percentage-based**, not fixed-padding:
  `w-[95%] lg:w-[85%] max-w-page mx-auto`. At 1440px that yields 1224px of
  content at x=108, at 390px it yields 371px at x=10 — both verified against
  the live site. Never swap it for `px-*` gutters; the gutter grows with the
  viewport until the 1320px cap.
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
- `src/modules/<Feature>/` — one folder per feature, each with `components/`.
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

The folders are scaffolded and empty (`.gitkeep`). No UI is built yet — the
client asked for structure only.

## Header

Built 2026-09-03 in `src/common/widgets/Header/`, mounted in the root layout
above `<main id="main">`. Layout mirrors the reference site: a dark top row
(logo · search · Offers · Store Locator · cart · account) over a black category
strip with hover mega-menus.

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
  `/offers`, `/store-locator`, `/cart`, `/account`).
- No footer, product or cart routes yet.
- No data layer or CMS chosen; nav categories are static config.
- Cart shows no item-count badge — the reference has none either. Add one when
  cart state lands.
