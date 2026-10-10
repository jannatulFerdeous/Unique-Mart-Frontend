import Link from "next/link";
import type { Product } from "@/shared/config/catalog";
import { category_data } from "./config/constants";
import type { ListingProduct } from "./config/types";
import { CategoryBrowser } from "./partials/CategoryBrowser";
import { CategoryIntro } from "./partials/CategoryIntro";
import { CategoryPriceTable } from "./partials/CategoryPriceTable";

type Link = { slug: string; name: string; href: string };

type Props = {
  name: string;
  slug: string;
  trail: Link[];
  items: ListingProduct[];
  childLinks: Link[];
  // Filter groups to offer, without counts; the browser counts what's listed.
  facetGroups: { id: string; label: string; values: string[] }[];
  // Heading override, e.g. for search results; defaults to "{name} Price in Bangladesh".
  heading?: string;
};

export function Category({ name, slug, trail, items, childLinks, facetGroups, heading }: Props) {
  const { emptyTitle, emptyBody } = category_data;
  const products: Product[] = items.map((item) => item.product);
  const from = products.length
    ? Math.min(...products.map((product) => product.price))
    : null;

  const links = childLinks.length ? childLinks : [];

  return (
    <>
      <CategoryIntro
        name={name}
        trail={trail}
        from={from}
        links={links}
        activeSlug={slug}
        heading={heading}
      />

      <section className="pt-8 pb-14">
        <div className="container-page">
          {items.length === 0 ? (
            <div className="border border-line bg-surface px-6 py-16 text-center">
              <h2 className="font-sans font-bold text-ink">{emptyTitle}</h2>
              <p className="mx-auto mt-3 max-w-prose text-ink-muted">
                {emptyBody}
              </p>
              <Link
                href="/"
                className="mt-6 inline-block rounded-control bg-tertiary px-6 py-3 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <CategoryBrowser
              name={name}
              items={items}
              facetGroups={facetGroups}
              childLabels={childLinks.map((link) => ({
                value: link.slug,
                label: link.name,
              }))}
            />
          )}
        </div>
      </section>

      <CategoryPriceTable name={name} products={products} />
    </>
  );
}
