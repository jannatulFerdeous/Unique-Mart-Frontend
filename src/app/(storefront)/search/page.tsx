import type { Metadata } from "next";
import { Category } from "@/modules/Category";
import { getCatalog } from "@/shared/api/storefront";
import {
  brandOf,
  facetGroupsFor,
  mainCategoriesOf,
  toListing,
  type ApiProduct,
  type Catalog,
} from "@/shared/libs/storefront/catalog";
import { refId } from "@/redux/features/catalog/catalog.types";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

// Everything a shopper might type: name, SKUs, brand and where it's filed.
const haystack = (catalog: Catalog, product: ApiProduct) =>
  [
    product.name,
    product.sku,
    ...product.variants.map((variant) => variant.sku),
    brandOf(catalog, product)?.name,
    ...[product.mainCategoryId, product.categoryId, product.subCategoryId].map(
      (ref) => catalog.nodeById.get(refId(ref))?.name,
    ),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const catalog = await getCatalog();

  // Every word has to appear somewhere, in any order.
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const found = words.length
    ? catalog.products.filter((product) => {
        const text = haystack(catalog, product);
        return words.every((word) => text.includes(word));
      })
    : [];
  const items = toListing(catalog, found, 0);

  return (
    <Category
      name={query ? `“${query}”` : "Search"}
      slug="search"
      heading={query ? `Search results for “${query}”` : "Search products"}
      trail={[]}
      items={items}
      facetGroups={facetGroupsFor(catalog, items)}
      childLinks={mainCategoriesOf(catalog, found)}
    />
  );
}
