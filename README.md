# Unique Mart

E-commerce storefront built with Next.js 16, React 19, TypeScript and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

The app runs at <http://localhost:3000>.

## Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start the development server   |
| `npm run build` | Production build               |
| `npm run start` | Serve the production build     |
| `npm run lint`  | Lint with `eslint-config-next` |

One-off: `node scripts/scrape-catalogue.mjs` rebuilds
`src/shared/config/product-details/`, `src/shared/config/categories.ts` and the
gallery artwork under `src/images/products/<slug>/` from the source catalogue.
Everything in `product-details/` and `categories.ts` is generated — change the
script, not the output.

## Structure

Feature-module architecture. `app/` only routes; the UI lives in `modules/`.

The `Header` and `Footer` widgets and the `Home`, `Brands`, `AboutUs` and `Faq`
modules are built; the remaining folders are scaffolded and empty.

```
src/
  app/                     Routes only — thin files that render a module
    layout.tsx             Root layout: fonts, metadata
    page.tsx               /
    brands/page.tsx        /brands
    about/page.tsx         /about
    faq/page.tsx           /faq — plus FAQPage JSON-LD
    offers/page.tsx        /offers — every discounted product
    auth/login|register|   Sign in, register, password reset
      forgot-password/     (?back=<base64> returns you where you were)
    category/[slug]/       342 prerendered category pages
    shop/product/[slug]/   93 prerendered product pages
  common/                  Shared across modules
    components/            ProductCard, ProductRail, SectionHeader,
                           ContactBand, FaqAccordion, Stars, AccountLink,
                           icons/
    widgets/               Composed layout blocks
      Header/
      Footer/
  images/                  Imported image assets
    banners/               Hero artwork — reference site's, must be replaced
    products/              Product photography — same, must be replaced
  modules/                 One folder per feature
    Home/                  Entry, barrel, then:
      config/              constants.ts (content) + types.ts
      partials/            HeroBanner, TrustStrip, Exclusive
    Brands/                The /brands directory
      config/              constants.ts + types.ts
      partials/            BrandDirectory
    AboutUs/               The /about page
      config/              constants.ts + types.ts
      partials/            AboutIntro, AboutStory, WhyShop, Commitment,
                           AboutFaq, AboutContact
    Faq/                   The /faq page
      config/              constants.ts + types.ts
      partials/            FaqIntro, FaqBrowser, FaqContact
    Auth/                  The /auth/* screens
      config/              constants.ts + types.ts
      partials/            AuthCard, AuthBody, AuthField, AuthNote,
                           GoogleButton, LoginForm, RegisterForm, ForgotForm
    Offers/                The /offers page
      config/              constants.ts + types.ts
      partials/            OffersHero, OffersBrowser
    Category/              /category/[slug]
      config/              constants.ts + types.ts
      partials/            CategoryIntro, CategoryBrowser, CategoryFilters,
                           PriceRange, CategoryPriceTable
    ProductDetails/        /shop/product/[slug]
      config/              constants.ts + types.ts
      partials/            ProductBreadcrumb, ProductTop, ProductGallery,
                           ProductTabs, ProductReviews, ProductAside
    Shop/          config/ partials/
    Cart/          config/ partials/
    Checkout/      config/ partials/
    Account/       config/ partials/
    ContactUs/     config/ partials/
    Blog/          config/ partials/
  shared/                  Framework-agnostic building blocks
    config/  site.ts        Site-wide constants
             categories.ts  Generated category tree — 342 nodes with slugs,
                            parents, children and their product slugs
             facets.ts      Generated filter facets — display size, type,
                            chipset, RAM, storage, battery, key features
             navigation.ts  Navbar, built from categories.ts + utility links
             footer.ts      Footer link columns
             brands.ts      The 36 brand marks + /brands route helpers
             trust.ts       The six confirmed promises, icon + label + detail
             faq.ts         Every Q&A, grouped; About renders a subset
             products.ts    All 93 products + findProduct / productHref
                            + `offers`, the derived discount list
             product-details/    One generated module per product: gallery,
                                 colours, variants, specs, description
             catalog.ts     Product / rail types shared with common/
    libs/    fonts.ts       Third-party wrappers (next/font)
             reviews.ts     Customer reviews, stored in the browser
             session.ts     Signed-in visitor, kept in the browser; also the
                            `?back=` encode/decode + open-redirect guard
    styles/  globals.css    Tailwind import + @theme tokens
    utils/   cn.ts          Class-name merger
             price.ts       Taka formatting (lakh grouping)
  proxy.ts                 Request proxy (was middleware.ts, see below)
public/                    Static assets served as-is
```

**Conventions**

- `@/*` resolves to `src/*`.
- A route file stays thin: import the module and render it.
- Each module exports its entry through an `index.ts` barrel, so imports read
  `import { Home } from "@/modules/Home"`.
- A module is `config/` + `partials/`. `partials/` holds one file per page
  section; `config/constants.ts` holds that module's content as a single
  `<module>_data` object, typed by `config/types.ts`. A section renders markup and
  reads its copy from `<module>_data` — it does not inline content.
- A partial that outgrows one file nests the same shape:
  `partials/TechBlog/TechBlog.tsx` with its own `config/` and `partials/`.
- Content only goes in `shared/config/` when a second module needs it. Hero slides
  live in `modules/Home/config/`, not `shared/`, because only Home renders them.
- A module never imports from another module. Anything two modules need moves up
  into `common/` or `shared/`.

**`proxy.ts`, not `middleware.ts`** — the `middleware` convention is deprecated
in Next.js 16 and renamed to `proxy`. The exported function is `proxy()`. To
migrate older code: `npx @next/codemod@canary middleware-to-proxy .`

## Design system

All colors, fonts, radii, shadows and the page width are declared once in the
`@theme` block of
[`src/shared/styles/globals.css`](src/shared/styles/globals.css) and consumed as
Tailwind utilities (`bg-primary`, `text-ink-muted`, `rounded-card`).
Do not hardcode hex values in components.

The palette is monochrome plus one accent, `tertiary` (`#0171d0`). The accent is
for **action and wayfinding only** — Offers, Show All, prices, Buy Now, the
active brand tab, prose links, Subscribe and the footer phone button. Body copy,
headings, the category bar and the footer ground stay black. See
[`memory.md`](memory.md) for the full role table.

**Type scale** — `h1`–`h6` and `p` get their size from `@layer base`, driven by
the `--text-h*` / `--text-body` tokens. Do not put a `text-*` size class on a
heading or paragraph: if you need one, it is an exception and belongs with a
comment saying why. There are four today (product card title, the two footer
headings, the brand wall's display lockup).

Two things are global and should never be re-declared in a component:

- **Page background** — set once on `body` in `@layer base` (`--color-canvas`).
  Sections are transparent and sit on it; only give a section its own `bg-*` when
  it is deliberately a different surface.
- **Page width** — the `container-page` utility (95%, 85% from `lg`, capped at
  `--container-page`). Wrap section content in it rather than writing widths by
  hand. `container-page-bleed` is the full-bleed variant for edge-to-edge artwork
  on phones; the hero banner is its only user.

See [`memory.md`](memory.md) for the token table and where each value came from,
and [`skill.md`](skill.md) for the capability list.
