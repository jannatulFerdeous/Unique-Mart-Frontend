import type { NextRequest } from "next/server";
import { getCatalog } from "@/shared/api/storefront";
import { toCard } from "@/shared/libs/storefront/catalog";
import type { ShopProduct } from "@/shared/libs/storefront/useShopProducts";

// Live cards for products the browser only knows by slug (the wishlist):
// GET /api/storefront/products?slugs=a,b
const MAX_SLUGS = 200;

export async function GET(request: NextRequest) {
  const slugs = (request.nextUrl.searchParams.get("slugs") ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean)
    .slice(0, MAX_SLUGS);

  const catalog = await getCatalog();
  const wanted = new Set(slugs);
  const items: ShopProduct[] = catalog.products
    .filter((product) => wanted.has(product.slug))
    .map((product) => ({ ...toCard(catalog, product), hasOptions: product.hasVariants }));

  return Response.json({ items });
}
