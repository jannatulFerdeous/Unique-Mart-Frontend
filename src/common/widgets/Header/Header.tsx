import { site } from "@/shared/config/site";
import { CategoryBar } from "./components/CategoryBar";
import { HeaderActions } from "./components/HeaderActions";
import { Logo } from "./components/Logo";
import { MobileNav } from "./components/MobileNav";
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

export function Header() {
  return (
    <header className="sticky top-0 z-50">
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

      <div className="bg-inverse">
        <div className="container-page">
          <div className="flex items-center gap-3 py-2 lg:min-h-16.5 lg:gap-4 lg:py-3">
            <MobileNav />
            <Logo />
            <SearchBar className="hidden flex-1 lg:flex" />
            <HeaderActions />
          </div>
          <SearchBar id="site-search-mobile" className="pb-2 lg:hidden" />
        </div>
      </div>

      <CategoryBar />
    </header>
  );
}
