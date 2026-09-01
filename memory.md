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

## Conventions

- Design tokens live in one place: the `@theme` block in
  `src/shared/styles/globals.css`. Never hardcode a hex value in a component —
  add or use a token.
- Fonts are configured in `src/shared/libs/fonts.ts` and applied once on
  `<html>` via `fontVariables`.
- `cn()` from `src/shared/utils/cn.ts` merges class names
  (`clsx` + `tailwind-merge`).
- Site-wide constants (name, tagline, url) live in `src/shared/config/site.ts`
  and feed `metadata` in the root layout.
- Comments are short or absent; code should read on its own.

## Environment notes

- `AGENTS.md` is regenerated by `next dev`. Commit it with changes rather than
  deleting it, or it reappears as an uncommitted diff.
- This Next.js version types layout props as `LayoutProps<"/">` — do not replace
  it with a hand-written `{ children: React.ReactNode }`.

## Open items

- No header, footer, product or cart routes yet — only the design-token page.
- No data layer or CMS chosen.
