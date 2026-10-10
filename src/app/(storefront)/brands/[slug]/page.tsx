import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Category } from "@/modules/Category";
import { getCatalog } from "@/shared/api/storefront";
import { brandMarks, brandsPath } from "@/shared/config/brands";
import {
  brandOf,
  facetGroupsFor,
  mainCategoriesOf,
  toListing,
  type Catalog,
} from "@/shared/libs/storefront/catalog";

// A brand from the admin, or one of the logos on the brand wall that isn't
// stocked yet (its page then says so instead of 404ing).
const brandFor = (catalog: Catalog, slug: string) => {
  const stocked = catalog.brands.find((brand) => brand.slug === slug);
  const name = stocked?.name ?? brandMarks.find((mark) => mark.slug === slug)?.label;
  return name ? { name, products: catalog.products.filter((product) => brandOf(catalog, product)?.slug === slug) } : null;
};

export async function generateMetadata({ params }: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const brand = brandFor(await getCatalog(), slug);
  if (!brand) return {};
  return {
    title: `${brand.name} Price in Bangladesh`,
    description: `Official ${brand.name} products at Unique Mart. 0% EMI on eligible purchases, nationwide delivery.`,
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
