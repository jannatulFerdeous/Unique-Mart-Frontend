import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Category } from "@/modules/Category";
import { getCatalog } from "@/shared/api/storefront";
import {
  facetGroupsFor,
  mainCategoriesOf,
  toListing,
  type ApiProduct,
  type Catalog,
} from "@/shared/libs/storefront/catalog";

// The homepage rows' "View all" pages, driven by the admin's flags.
const COLLECTIONS: Record<string, { name: string; pick: (catalog: Catalog) => ApiProduct[] }> = {
  exclusive: {
    name: "Exclusive",
    pick: ({ products }) => {
      const exclusive = products.filter((product) => product.isExclusive);
      return exclusive.length ? exclusive : products.filter((product) => product.isFeatured);
    },
  },
  featured: { name: "Featured", pick: ({ products }) => products.filter((product) => product.isFeatured) },
  "new-arrival": { name: "New Arrival", pick: ({ products }) => products },
  "top-selling": {
    name: "Top Selling",
    pick: ({ products }) =>
      [...products].sort((a, b) => b.salesCount - a.salesCount || Number(b.isFeatured) - Number(a.isFeatured)),
  },
};

export async function generateMetadata({ params }: PageProps<"/shop/[collection]">): Promise<Metadata> {
  const { collection } = await params;
  const found = COLLECTIONS[collection];
  return found ? { title: found.name } : {};
}

export default async function CollectionPage({ params }: PageProps<"/shop/[collection]">) {
  const { collection } = await params;
  const found = COLLECTIONS[collection];
  if (!found) notFound();

  const catalog = await getCatalog();
  const products = found.pick(catalog);
  const items = toListing(catalog, products, 0);

  return (
    <Category
      name={found.name}
      slug={collection}
      heading={found.name}
      trail={[]}
      items={items}
      facetGroups={facetGroupsFor(catalog, items)}
      childLinks={mainCategoriesOf(catalog, products)}
    />
  );
}
