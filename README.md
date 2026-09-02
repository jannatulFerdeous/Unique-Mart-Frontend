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

The `Header` widget is built; the remaining folders are scaffolded and empty.

```
src/
  app/                     Routes only — thin files that render a module
    layout.tsx             Root layout: fonts, metadata
    page.tsx               /
  common/                  Shared across modules
    components/            Presentational primitives
    widgets/               Composed layout blocks
      Header/
      Footer/
  images/                  Imported image assets
  modules/                 One folder per feature
    Home/          components/
    Shop/          components/
    ProductDetails/components/
    Cart/          components/
    Checkout/      components/
    Login/         components/
    Signup/        components/
    Account/       components/
    AboutUs/       components/
    ContactUs/     components/
    Blog/          components/
  shared/                  Framework-agnostic building blocks
    config/  site.ts        Site-wide constants
             navigation.ts  Category tree and utility links
    libs/    fonts.ts       Third-party wrappers (next/font)
    styles/  globals.css    Tailwind import + @theme tokens
    utils/   cn.ts          Class-name merger
  proxy.ts                 Request proxy (was middleware.ts, see below)
public/                    Static assets served as-is
```

**Conventions**

- `@/*` resolves to `src/*`.
- A route file stays thin: import the module and render it.
- Each module exports its entry through an `index.ts` barrel, so imports read
  `import { Home } from "@/modules/Home"`.
- A module never imports from another module. Anything two modules need moves up
  into `common/` or `shared/`.

**`proxy.ts`, not `middleware.ts`** — the `middleware` convention is deprecated
in Next.js 16 and renamed to `proxy`. The exported function is `proxy()`. To
migrate older code: `npx @next/codemod@canary middleware-to-proxy .`

## Design system

All colors, fonts, radii, shadows and the page width are declared once in the
`@theme` block of
[`src/shared/styles/globals.css`](src/shared/styles/globals.css) and consumed as
Tailwind utilities (`bg-primary`, `text-ink-muted`, `rounded-card`, `max-w-page`).
Do not hardcode hex values in components.

See [`memory.md`](memory.md) for the token table and where each value came from,
and [`skill.md`](skill.md) for the capability list.
