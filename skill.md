# Skills

Capabilities available on this project. Add a row when a new one is used.

## Framework

| Skill              | Applied to                                                      |
| ------------------ | --------------------------------------------------------------- |
| Next.js App Router | `app/` routing, layouts, metadata                               |
| Server Components  | Default for every component unless it needs state or events     |
| `next/font/google` | Self-hosted Heebo + Montserrat, zero layout shift               |
| `next/image`       | Optimized product and banner imagery                            |
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

## Engineering practice

| Skill                | Applied to                                                    |
| -------------------- | ------------------------------------------------------------- |
| Project structure    | `app/` routes, `components/` UI, `lib/` logic and config      |
| Dependency hygiene   | Runtime vs. dev dependencies kept separate                    |
| Dead code removal    | Stripped Create Next App boilerplate assets                   |
| ESLint               | `eslint-config-next` via `npm run lint`                       |
| Accessibility        | Skip link, semantic landmarks, hover **and** focus mega-menus  |

## Planned

- Footer widget
- Cart and checkout state management
- Product data layer / API integration
- Search and filtering
- Authentication
