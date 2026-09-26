import type { StaticImageData } from "next/image";
import {
  allProducts,
  brandProducts,
  casesProducts,
  exclusiveProducts,
  newArrivalProducts,
  soundSurroundProducts,
  topSellingProducts,
} from "@/shared/config/products";
import { createStore, daysAgo, rng } from "./store";
import type { AdminProduct, ProductStatus } from "./types";


const CATEGORY_BY_SLUG: Record<string, string> = (() => {
  const named: [string, { slug: string }[]][] = [
    ["Speakers & audio", soundSurroundProducts],
    ["Cases & protection", casesProducts],
    ...Object.entries(brandProducts).map(
      ([brand, list]) =>
        [`${brand[0].toUpperCase()}${brand.slice(1)}`, list] as [string, { slug: string }[]],
    ),
    ["New arrivals", newArrivalProducts],
    ["Top selling", topSellingProducts],
    ["Featured", exclusiveProducts],
  ];

  const map: Record<string, string> = {};
  for (const [category, list] of named) {
    for (const product of list) map[product.slug] ??= category;
  }
  return map;
})();

const IMAGE_BY_SLUG: Record<string, StaticImageData> = Object.fromEntries(
  allProducts.map((product) => [product.slug, product.image]),
);

export const productImage = (slug: string): StaticImageData | undefined =>
  IMAGE_BY_SLUG[slug];

const sku = (product: { slug: string; brand?: string }, n: number): string => {
  const letters = (product.brand ?? product.slug)
    .replace(/[^a-z]/gi, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
  return `UM-${letters}-${String(1000 + n * 7).slice(0, 4)}`;
};

const seed = (): AdminProduct[] => {
  const random = rng(20260920);

  return allProducts.map((product, index) => {
    const roll = random();
    const depth = product.price > 100_000 ? 6 : product.price > 25_000 ? 24 : 90;
    const stock = Math.round(roll * depth);

    const status: ProductStatus = random() < 0.08 ? "draft" : "live";

    return {
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: CATEGORY_BY_SLUG[product.slug] ?? "Uncategorised",
      price: product.price,
      compareAt: product.compareAt,
      rating: product.rating,
      badge: product.badge,
      stock,
      reorderAt: product.price > 100_000 ? 2 : product.price > 25_000 ? 5 : 12,
      sku: sku(product, index),
      status,
      createdAt: daysAgo(Math.round(random() * 240) + 1),
      fromCatalogue: true,
    };
  });
};



export const products = createStore(seed);

export const useProducts = (): AdminProduct[] => products.use();

export const findAdminProduct = (slug: string): AdminProduct | undefined =>
  products.read().find((product) => product.slug === slug);

export type ProductDraft = Omit<AdminProduct, "fromCatalogue" | "createdAt">;

export const toSlug = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/["'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const addProduct = (
  draft: ProductDraft,
): { ok: true; product: AdminProduct } | { ok: false; reason: "duplicate-slug" } => {
  const slug = draft.slug || toSlug(draft.name);
  if (products.read().some((product) => product.slug === slug)) {
    return { ok: false, reason: "duplicate-slug" };
  }

  const product: AdminProduct = {
    ...draft,
    slug,
    createdAt: new Date().toISOString(),
    fromCatalogue: false,
  };

  products.update((current) => [product, ...current]);
  return { ok: true, product };
};

export const saveProduct = (slug: string, patch: Partial<AdminProduct>) => {
  products.update((current) =>
    current.map((product) =>
      product.slug === slug ? { ...product, ...patch, slug: product.slug } : product,
    ),
  );
};

export const deleteProduct = (slug: string) => {
  products.update((current) => current.filter((product) => product.slug !== slug));
};

export const deleteProducts = (slugs: string[]) => {
  const drop = new Set(slugs);
  products.update((current) => current.filter((product) => !drop.has(product.slug)));
};

export const setStock = (slug: string, units: number) => {
  saveProduct(slug, { stock: Math.max(0, Math.round(units)) });
};

export const adjustStock = (slug: string, delta: number) => {
  const product = findAdminProduct(slug);
  if (!product) return;
  setStock(slug, product.stock + delta);
};

export const setStatus = (slug: string, status: ProductStatus) => {
  saveProduct(slug, { status });
};


export const isLowStock = (product: AdminProduct): boolean =>
  product.stock > 0 && product.stock <= product.reorderAt;

export const isOutOfStock = (product: AdminProduct): boolean => product.stock <= 0;

export const brandsOf = (rows: AdminProduct[]): string[] =>
  [...new Set(rows.map((product) => product.brand).filter((brand): brand is string => !!brand))].sort(
    (a, b) => a.localeCompare(b),
  );

