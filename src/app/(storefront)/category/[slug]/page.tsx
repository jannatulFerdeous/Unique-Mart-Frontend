import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Category } from "@/modules/Category";
import { getCategories } from "@/shared/libs/categories/storage";
import { findProduct } from "@/shared/config/products";
import { facetsFor } from "@/shared/config/facets";
import { formatPrice } from "@/shared/utils/price";

/* The tree is the one the admin portal edits. Categories that exist at build
   time are prerendered; one added later renders on its first visit, and every
   page is re-rendered when the tree is saved. */
export async function generateStaticParams() {
  return Object.keys(await getCategories()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories())[slug];
  if (!category) return {};

  const prices = category.products
    .map((each) => findProduct(each)?.price)
    .filter((price): price is number => typeof price === "number");

  return {
    title: `${category.name} Price in Bangladesh`,
    description: prices.length
      ? `${category.name} at Unique Mart, starting from ${formatPrice(Math.min(...prices))}. Official products, 0% EMI on eligible purchases, nationwide delivery.`
      : `${category.name} at Unique Mart. Official products, 0% EMI on eligible purchases, nationwide delivery.`,
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories[slug];
  // Hidden in the portal counts as gone.
  if (!category) notFound();

  /* Which direct child a product sits under, so the Category facet can drill
     down. Built by walking this category's children and their descendants —
     a product three levels down still belongs to the child at the top. */
  const childOf = new Map<string, string>();
  for (const child of category.children) {
    for (const productSlug of categories[child]?.products ?? []) {
      if (!childOf.has(productSlug)) childOf.set(productSlug, child);
    }
  }

  const items = category.products.flatMap((productSlug) => {
    const product = findProduct(productSlug);
    if (!product) return [];

    return [
      {
        product,
        child: childOf.get(productSlug),
        facets: facetsFor(productSlug),
      },
    ];
  });

  return (
    <Category
      name={category.name}
      slug={category.slug}
      trail={category.trail.flatMap((each) => {
        const parent = categories[each];
        return parent ? [{ slug: parent.slug, name: parent.name }] : [];
      })}
      items={items}
      childLinks={category.children.flatMap((child) => {
        const found = categories[child];
        return found?.products.length
          ? [{ slug: found.slug, name: found.name }]
          : [];
      })}
    />
  );
}
