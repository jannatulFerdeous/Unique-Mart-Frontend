import { cache } from "react";
import type { ApiMeta, ApiResponse } from "@/redux/api/types";
import type { Attribute } from "@/redux/features/attribute/attribute.types";
import type { Brand, Category, MainCategory, SubCategory } from "@/redux/features/catalog/catalog.types";
import { API_BASE_URL } from "@/shared/config/api";
import { buildCatalog, type ActiveCoupon, type ApiProduct, type Catalog } from "@/shared/libs/storefront/catalog";

// Cache tag for everything the shop reads from the backend; the admin clears
// it after every save (storefront.actions.ts).
export const STOREFRONT_TAG = "storefront";

// Safety net if a clear is ever missed: refetch at most this often.
const REVALIDATE_SECONDS = 300;

// Products are fetched in pages so each cached response stays far below
// Next's 2 MB per-fetch cache limit as the catalogue grows.
const PAGE_SIZE = 200;

// Only what cards and listings need; the product page fetches the rest.
// `attributes` (the spec sheet) is left out: it tripled every page's size and
// slowed builds past Next's 60s page limit. Listings only use it for shop
// filters, and only used iPhones carry a filterable one (see usedAttributes).
const LIST_FIELDS = [
  "name", "slug", "brandId", "mainCategoryId", "categoryId", "subCategoryId", "images",
  "price", "discount", "stock", "isFeatured", "isExclusive", "isUpcoming", "salesCount",
  "status", "createdAt", "hasVariants", "variants",
].join(",");

type ListBody<T> = ApiResponse<T[] | { data: T[]; meta: ApiMeta }>;

const read = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [STOREFRONT_TAG] },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

// List routes answer as `data: [...]` + `meta`, or `data: { data, meta }`.
const unpack = <T>(body: ListBody<T> | null): { items: T[]; totalPage: number } => {
  if (!body) return { items: [], totalPage: 0 };
  const items = Array.isArray(body.data) ? body.data : body.data.data;
  const meta = Array.isArray(body.data) ? body.meta : body.data.meta;
  return { items, totalPage: meta?.totalPage ?? 1 };
};

const list = async <T>(path: string) => unpack(await read<ListBody<T>>(path)).items;

// Pages fetched at once while walking the product list.
const PAGES_PER_BATCH = 5;

// The backend caps `meta.total` at the page size, so `totalPage` reads 1 once
// there are more products than fit on a page. Keep fetching until a page comes
// back short (or empty) instead of trusting it.
const allProducts = async (): Promise<ApiProduct[]> => {
  const page = async (number: number) =>
    unpack(
      await read<ListBody<ApiProduct>>(`/products?limit=${PAGE_SIZE}&page=${number}&sort=-createdAt&fields=${LIST_FIELDS}`),
    ).items;
  const products: ApiProduct[] = [];
  for (let start = 1; ; start += PAGES_PER_BATCH) {
    const batch = await Promise.all(Array.from({ length: PAGES_PER_BATCH }, (_, index) => page(start + index)));
    for (const items of batch) {
      products.push(...items);
      if (items.length < PAGE_SIZE) return products;
    }
  }
};

// The spec attributes of used items (named "... (Used)"), whose Storage and
// Colour feed the 2nd Hand filters. A few dozen products, so one small request.
const usedAttributes = async (): Promise<Map<string, ApiProduct["attributes"]>> => {
  const items = await list<Pick<ApiProduct, "_id" | "attributes">>(
    `/products?searchTerm=${encodeURIComponent("(Used)")}&limit=1000&fields=attributes`,
  );
  return new Map(items.map((item) => [item._id, item.attributes]));
};

// Everything listings need, once per request. When the backend can't be
// reached the shop renders empty states rather than failing.
export const getCatalog = cache(async (): Promise<Catalog> => {
  const [listed, used, brands, mains, categories, subs, attributes] = await Promise.all([
    allProducts(),
    usedAttributes(),
    list<Brand>("/brands?status=active&limit=1000"),
    list<MainCategory>("/main-categories?status=active&limit=1000"),
    list<Category>("/categories?status=active&limit=1000"),
    list<SubCategory>("/sub-categories?status=active&limit=1000"),
    list<Attribute>("/attributes?status=active&limit=1000"),
  ]);
  const products = listed.map((product) => (used.has(product._id) ? { ...product, attributes: used.get(product._id) } : product));
  return buildCatalog({ products, brands, mains, categories, subs, attributes });
});

// Coupons shoppers can use right now; none when the backend can't be reached.
export const getActiveCoupons = cache(
  async (): Promise<ActiveCoupon[]> => (await read<ApiResponse<ActiveCoupon[]>>("/coupons/active"))?.data ?? [],
);

// One product with its specs and variant options filled in, or null when it
// doesn't exist or is switched off.
export const getProduct = cache(async (slug: string): Promise<ApiProduct | null> => {
  const body = await read<ApiResponse<ApiProduct>>(`/products/${encodeURIComponent(slug)}`);
  return body?.data && body.data.status === "active" ? body.data : null;
});
