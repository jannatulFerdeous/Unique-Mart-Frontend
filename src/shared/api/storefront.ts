import { cache } from "react";
import type { ApiMeta, ApiResponse } from "@/redux/api/types";
import type { Attribute } from "@/redux/features/attribute/attribute.types";
import type { Brand, Category, MainCategory, SubCategory } from "@/redux/features/catalog/catalog.types";
import { API_BASE_URL } from "@/shared/config/api";
import { buildCatalog, type ApiProduct, type Catalog } from "@/shared/libs/storefront/catalog";

// Cache tag for everything the shop reads from the backend; the admin clears
// it after every save (storefront.actions.ts).
export const STOREFRONT_TAG = "storefront";

// Safety net if a clear is ever missed: refetch at most this often.
const REVALIDATE_SECONDS = 300;

// Products are fetched in pages so each cached response stays far below
// Next's 2 MB per-fetch cache limit as the catalogue grows.
const PAGE_SIZE = 200;

// Only what cards, listings and filters need; the product page fetches the rest.
const LIST_FIELDS = [
  "name", "slug", "brandId", "mainCategoryId", "categoryId", "subCategoryId", "images",
  "price", "discount", "stock", "isFeatured", "isExclusive", "isUpcoming", "salesCount",
  "status", "createdAt", "hasVariants", "variants", "attributes",
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

const allProducts = async (): Promise<ApiProduct[]> => {
  const page = (number: number) =>
    read<ListBody<ApiProduct>>(`/products?limit=${PAGE_SIZE}&page=${number}&sort=-createdAt&fields=${LIST_FIELDS}`);
  const first = unpack(await page(1));
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.totalPage - 1) }, (_, index) => page(index + 2)),
  );
  return [...first.items, ...rest.flatMap((body) => unpack(body).items)];
};

// Everything listings need, once per request. When the backend can't be
// reached the shop renders empty states rather than failing.
export const getCatalog = cache(async (): Promise<Catalog> => {
  const [products, brands, mains, categories, subs, attributes] = await Promise.all([
    allProducts(),
    list<Brand>("/brands?status=active&limit=1000"),
    list<MainCategory>("/main-categories?status=active&limit=1000"),
    list<Category>("/categories?status=active&limit=1000"),
    list<SubCategory>("/sub-categories?status=active&limit=1000"),
    list<Attribute>("/attributes?status=active&limit=1000"),
  ]);
  return buildCatalog({ products, brands, mains, categories, subs, attributes });
});

// One product with its specs and variant options filled in, or null when it
// doesn't exist or is switched off.
export const getProduct = cache(async (slug: string): Promise<ApiProduct | null> => {
  const body = await read<ApiResponse<ApiProduct>>(`/products/${encodeURIComponent(slug)}`);
  return body?.data && body.data.status === "active" ? body.data : null;
});
