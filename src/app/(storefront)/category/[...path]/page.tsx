import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Category } from "@/modules/Category";
import { getCatalog } from "@/shared/api/storefront";
import {
  ancestors,
  facetGroupsFor,
  findNode,
  findNodeBySlug,
  productsUnder,
  toListing,
} from "@/shared/libs/storefront/catalog";
import { formatPrice } from "@/shared/utils/price";

// /category/<main>/<category>/<sub>, following the admin's category tree.
const nodeFor = async (path: string[]) => {
  const catalog = await getCatalog();
  return { catalog, node: findNode(catalog, path.map(decodeURIComponent)) };
};

export async function generateMetadata({
  params,
}: PageProps<"/category/[...path]">): Promise<Metadata> {
  const { path } = await params;
  const { catalog, node } = await nodeFor(path);
  if (!node) return {};

  const prices = productsUnder(catalog, node).map((each) => each.price - each.discount);
  return {
    title: `${node.name} Price in Bangladesh`,
    description: prices.length
      ? `${node.name} at Unique Mart, starting from ${formatPrice(Math.min(...prices))}. Official products, nationwide delivery.`
      : `${node.name} at Unique Mart. Official products, nationwide delivery.`,
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/category/[...path]">) {
  const { path } = await params;
  const { catalog, node } = await nodeFor(path);

  if (!node) {
    // Short links like /category/iphone go to that category's full address.
    const short = path.length === 1 ? findNodeBySlug(catalog, decodeURIComponent(path[0])) : undefined;
    if (short) permanentRedirect(short.href);
    notFound();
  }

  const children = node.children.filter((child) => child.productCount > 0);
  const items = toListing(catalog, productsUnder(catalog, node), node.level < 2 ? ((node.level + 1) as 1 | 2) : undefined);

  return (
    <Category
      name={node.name}
      slug={node.slug}
      trail={ancestors(catalog, node).map((each) => ({ slug: each.slug, name: each.name, href: each.href }))}
      items={items}
      facetGroups={facetGroupsFor(catalog, items)}
      childLinks={children.map((child) => ({ slug: child.slug, name: child.name, href: child.href }))}
    />
  );
}
