import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Category } from "@/modules/Category";
import { getCatalog } from "@/shared/api/storefront";
import { brandsPath } from "@/shared/config/brands";
import {
  brandOf,
  facetGroupsFor,
  mainCategoriesOf,
  toListing,
  type Catalog,
} from "@/shared/libs/storefront/catalog";

// An active brand from the admin with its live products; a brand with none yet
// still gets its page, which says so.
const brandFor = (catalog: Catalog, slug: string) => {
  const brand = catalog.brands.find((each) => each.slug === slug);
  return brand
    ? { name: brand.name, products: catalog.products.filter((product) => brandOf(catalog, product)?.slug === slug) }
    : null;
};

export async function generateMetadata({ params }: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const brand = brandFor(await getCatalog(), slug);
  if (!brand) return {};
  return {
    title: `${brand.name} Price in Bangladesh`,
    description: `Official ${brand.name} products at Unique Mart. Official products, nationwide delivery.`,
  };
}

export default async function BrandPage({ params }: PageProps<"/brands/[slug]">) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const brand = brandFor(catalog, slug);
  if (!brand) notFound();

  const items = toListing(catalog, brand.products, 0);

  return (
    <Category
      name={brand.name}
      slug={slug}
      trail={[{ slug: "brands", name: "Brands", href: brandsPath }]}
      items={items}
      facetGroups={facetGroupsFor(catalog, items)}
      childLinks={mainCategoriesOf(catalog, brand.products)}
    />
  );
}
