import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails, type Crumb } from "@/modules/ProductDetails";
import { allProducts, findProduct } from "@/shared/config/products";
import { findProductDetail } from "@/shared/config/product-details";
import { formatPrice } from "@/shared/utils/price";

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: `${product.name} price in Bangladesh — ${formatPrice(product.price)} at Unique Mart. Official product, nationwide delivery.`,
  };
}

/** Home → the categories the product's detail data names → the product itself.
 *  Only Home is a link; the categories have no routes yet. A product without
 *  detail data gets the two-step trail rather than an invented category. */
function buildTrail(name: string, crumbs: string[] = []): Crumb[] {
  return [
    { label: "Home", href: "/" },
    ...crumbs.map((label) => ({ label })),
    { label: name },
  ];
}

export default async function ProductPage({
  params,
}: PageProps<"/shop/product/[slug]">) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const detail = findProductDetail(slug);
  // Same brand first, then anything else, so the rail is never empty.
  const similar = [
    ...allProducts.filter(
      (each) => each.slug !== slug && each.brand && each.brand === product.brand,
    ),
    ...allProducts.filter((each) => each.slug !== slug),
  ]
    .filter((each, index, list) => list.findIndex((x) => x.slug === each.slug) === index)
    .slice(0, 4);

  return (
    <ProductDetails
      product={product}
      detail={detail}
      similar={similar}
      trail={buildTrail(product.name, detail?.breadcrumb)}
    />
  );
}
