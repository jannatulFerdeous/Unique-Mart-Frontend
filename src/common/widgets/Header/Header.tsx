import { site } from "@/shared/config/site";
import { getCatalog } from "@/shared/api/storefront";
import { navFromTree } from "@/shared/libs/storefront/catalog";
import { CategoryBar } from "./components/CategoryBar";
import { HeaderActions } from "./components/HeaderActions";
import { Logo } from "./components/Logo";
import { MobileNav } from "./components/MobileNav";
import { MobileSearchPanel, MobileSearchProvider, MobileSearchToggle } from "./components/MobileSearch";
import { SearchBar } from "./components/SearchBar";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      description: site.tagline,
      foundingDate: site.since,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      publisher: { "@id": `${site.url}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${site.url}${site.searchPath}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export async function Header() {
  const nav = navFromTree((await getCatalog()).tree);

  return (
    // The dark strip above it (::before) covers the hairline a scaled phone
    // screen can leave between the very top and the stuck header; the header
    // itself stays at top: 0 so nothing about its position jitters.
    <header className="sticky top-0 z-50 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-4 before:bg-inverse">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      <MobileSearchProvider>
        <div className="bg-inverse">
          <div className="container-page">
            <div className="flex items-center gap-3 py-2 lg:min-h-16.5 lg:gap-4 lg:py-3">
              <Logo />
              <SearchBar className="hidden flex-1 lg:flex" />
              <HeaderActions />
              <MobileSearchToggle />
              <MobileNav nav={nav} />
            </div>
          </div>
          <MobileSearchPanel>
            <SearchBar id="site-search-mobile" className="px-1 pt-1 pb-3" />
          </MobileSearchPanel>
        </div>
      </MobileSearchProvider>

      <CategoryBar nav={nav} />
    </header>
  );
}
