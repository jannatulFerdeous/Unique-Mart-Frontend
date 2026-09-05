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

## Structure

Feature-module architecture. `app/` only routes; the UI lives in `modules/`.

The `Header` and `Footer` widgets and the `Home` module are built; the remaining
folders are scaffolded and empty.

```
src/
  app/                     Routes only — thin files that render a module
    layout.tsx             Root layout: fonts, metadata
    page.tsx               /
  common/                  Shared across modules
    components/            ProductCard, ProductRail, SectionHeader, icons/
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
    Shop/          config/ partials/
    ProductDetails/config/ partials/
    Cart/          config/ partials/
    Checkout/      config/ partials/
    Login/         config/ partials/
    Signup/        config/ partials/
    Account/       config/ partials/
    AboutUs/       config/ partials/
    ContactUs/     config/ partials/
    Blog/          config/ partials/
  shared/                  Framework-agnostic building blocks
    config/  site.ts        Site-wide constants
             navigation.ts  Category tree and utility links
             footer.ts      Footer link columns
             catalog.ts     Product / rail types shared with common/
    libs/    fonts.ts       Third-party wrappers (next/font)
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
