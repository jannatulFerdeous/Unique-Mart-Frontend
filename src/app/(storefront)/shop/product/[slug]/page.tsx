import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails, type Crumb } from "@/modules/ProductDetails";
import { refId } from "@/redux/features/catalog/catalog.types";
import { getCatalog, getProduct } from "@/shared/api/storefront";
import { toCard, toDetail, type ApiProduct, type Catalog } from "@/shared/libs/storefront/catalog";
import { formatPrice } from "@/shared/utils/price";

const SIMILAR = 4;

export async function generateMetadata({
  params,
}: PageProps<"/shop/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: `${product.name} price in Bangladesh — ${formatPrice(product.price - product.discount)} at Unique Mart. Official product, nationwide delivery.`,
  };
}

const trailFor = (catalog: Catalog, product: ApiProduct): Crumb[] => [
  { label: "Home", href: "/" },
  ...[product.mainCategoryId, product.categoryId, product.subCategoryId]
    .map((ref) => catalog.nodeById.get(refId(ref)))
    // A shelf named after the product itself ("iPhone 17 Pro Max") would repeat it.
    .flatMap((node) => (node && node.name !== product.name ? [{ label: node.name, href: node.href }] : [])),
  { label: product.name },
];

// Closest first: same shelf, then same aisle, then same brand.
const similarTo = (catalog: Catalog, product: ApiProduct) => {
  const others = catalog.products.filter((each) => each.slug !== product.slug);
  const same = (field: "subCategoryId" | "categoryId" | "brandId") =>
    others.filter((each) => refId(each[field]) && refId(each[field]) === refId(product[field]));
  return [...same("subCategoryId"), ...same("categoryId"), ...same("brandId")]
    .filter((each, index, list) => list.indexOf(each) === index)
    .slice(0, SIMILAR)
    .map((each) => toCard(catalog, each));
};

export default async function ProductPage({
  params,
}: PageProps<"/shop/product/[slug]">) {
  const { slug } = await params;
  const [product, catalog] = await Promise.all([getProduct(slug), getCatalog()]);
  if (!product) notFound();

  return (
    <ProductDetails
      product={toCard(catalog, product)}
      detail={toDetail(catalog, product)}
      similar={similarTo(catalog, product)}
      trail={trailFor(catalog, product)}
    />
  );
}
