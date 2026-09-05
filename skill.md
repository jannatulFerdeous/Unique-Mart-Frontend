# Skills

Capabilities available on this project. Add a row when a new one is used.

## Framework

| Skill              | Applied to                                                      |
| ------------------ | --------------------------------------------------------------- |
| Next.js App Router | `app/` routing, layouts, metadata                               |
| Server Components  | Default for every component unless it needs state or events     |
| `next/font/google` | Self-hosted Heebo + Montserrat, zero layout shift               |
| `next/image`       | Optimized product and banner imagery                            |
| `<picture>` art direction | Hero swaps composition, not just size, at 768px          |
| `getImageProps`    | Keeps both art-directed `<source>`s on the image optimizer       |
| Carousel from scratch | Hero autoplay, loop, swipe, `inert` slides — no slider dependency |
| Metadata API       | Title template, description, OG tags from `lib/site.ts`         |
| `next/form`        | Site search — GET form, no-JS fallback, client-side navigation  |
| JSON-LD            | `Organization` + `WebSite` with `SearchAction` in the header    |
| TypeScript         | Strict mode, `@/*` path alias                                   |

## Styling

| Skill                | Applied to                                                    |
| -------------------- | ------------------------------------------------------------- |
| Tailwind CSS v4      | Utility styling, `@theme` token layer                         |
| Design tokens        | Colors, fonts, radii, shadows in `app/globals.css`            |
| `cn()` helper        | Conditional and overridable class names                       |
| Responsive design    | Mobile-first breakpoints                                      |
| CSS Modules          | Reserved for cases Tailwind utilities cannot express          |

## Reverse engineering

| Skill              | Applied to                                                      |
| ------------------ | --------------------------------------------------------------- |
| CSS extraction     | Pulled the reference site's compiled CSS and resolved its palette |
| Token mapping      | Translated their Tailwind v3 theme into our v4 `@theme` tokens  |
| Font detection     | Read Google Fonts requests and `body` font stack                |
| DOM measurement    | Playwright walk of the live footer at 1440/768/390, then measured our render back against it |
| SVG lifting        | Social, phone and mail glyphs traced from the reference's markup |
| Breakpoint sweep   | Hero measured at 17 widths (320→1920) for the 768px artwork switch; trust strip swept 1024→1536 for its 1280 type step |
| Runtime probing    | Read the reference's live Swiper params for the real 5000ms / 300ms timings |

## Engineering practice

| Skill                | Applied to                                                    |
| -------------------- | ------------------------------------------------------------- |
| Project structure    | `app/` routes, `components/` UI, `lib/` logic and config      |
| Dependency hygiene   | Runtime vs. dev dependencies kept separate                    |
| Dead code removal    | Stripped Create Next App boilerplate assets                   |
| ESLint               | `eslint-config-next` via `npm run lint`                       |
| Accessibility        | Skip link, semantic landmarks, hover **and** focus mega-menus  |
| Reduced motion       | Hero autoplay and transition both drop under `prefers-reduced-motion` |
| Progressive layout   | Trust strip: 2-col grid → 3-col → six-across row, no content hidden |
| Scroll-snap rails    | Product carousel is native overflow + snap; arrows are progressive enhancement |
| `Intl.NumberFormat`  | Taka prices in `en-IN` lakh grouping (2,04,999)               |

## Planned

- Unique Mart hero artwork to replace the reference site's banners (blocks launch)
- The remaining seven product rails (reuse ProductRail + ProductCard)
- Fix `CategoryBar` horizontal overflow below ~1100px
- Confirm the trust strip's six guarantees with the client
- Payment-method logos for the footer strip
- Newsletter subscribe endpoint
- Cart and checkout state management
- Product data layer / API integration
- Search and filtering
- Authentication
