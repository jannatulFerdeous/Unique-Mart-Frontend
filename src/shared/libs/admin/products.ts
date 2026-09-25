/* The catalogue, as the portal edits it.
 *
 * The storefront's catalogue is a TypeScript file — `shared/config/products` —
 * which is the right answer for a site whose products are fixed at build time
 * and the wrong one for a shopkeeper adding stock at 9am. So the portal seeds
 * itself from that file and keeps its edits in this browser's store, layered on
 * top. Nothing is ever written back to source.
 *
 * What that means in practice, stated plainly because the UI says it too: an
 * edit made here changes every admin screen and survives a reload, and does not
 * change the storefront, which is still rendered from the shipped file. Wiring
 * the shop side to this store is one import away — see `useProducts` — but it
 * would move the whole shop to client rendering, so it waits for a real API. */

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

const KEY = "unique-mart.admin.products.v1";

/* Which rail a product ships in is the only filing the shipped catalogue has,
   so it is what the portal shows as a category. Built once, first match wins —
   several products sit in two rails (iPhone 17 Pro Max is Exclusive and Top
   Selling) and the more specific rail is listed first. */
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

/** Bundled product shots, by slug. Kept out of the store because a
 *  `StaticImageData` cannot be JSON-encoded — see `AdminProduct`. */
const IMAGE_BY_SLUG: Record<string, StaticImageData> = Object.fromEntries(
  allProducts.map((product) => [product.slug, product.image]),
);

export const productImage = (slug: string): StaticImageData | undefined =>
  IMAGE_BY_SLUG[slug];

/** `UM-JBL-4417`. Derived from the slug, so it is stable across reloads and the
 *  same product always carries the same code. */
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
    /* Cheap accessories move in volume and are stocked deep; a Tk 300,000
       MacBook is held in ones and twos. Tying the count to price is what makes
       the inventory screen read like a real shop rather than noise. */
    const depth = product.price > 100_000 ? 6 : product.price > 25_000 ? 24 : 90;
    const stock = Math.round(roll * depth);

    /* A tenth of the catalogue is left unpublished on purpose, so the products
       screen has something to filter and the status control has a job. */
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

const isProduct = (value: unknown): value is AdminProduct => {
  if (typeof value !== "object" || value === null) return false;
  const each = value as Record<string, unknown>;
  return (
    typeof each.slug === "string" &&
    each.slug.length > 0 &&
    typeof each.name === "string" &&
    typeof each.price === "number" &&
    Number.isFinite(each.price) &&
    typeof each.stock === "number" &&
    Number.isFinite(each.stock)
  );
};

const revive = (value: unknown): AdminProduct[] | null => {
  if (!Array.isArray(value)) return null;
  const rows = value.filter(isProduct);
  return rows.length ? rows : null;
};

export const products = createStore(KEY, seed, revive);

/** Every product the portal knows about, newest edit order preserved. */
export const useProducts = (): AdminProduct[] => products.use();

export const findAdminProduct = (slug: string): AdminProduct | undefined =>
  products.read().find((product) => product.slug === slug);

/** What the add and edit forms collect. Everything the store derives — the
 *  catalogue flag, the created date — is filled in here rather than by a form. */
export type ProductDraft = Omit<AdminProduct, "fromCatalogue" | "createdAt">;

/** Turns a name into a slug, the same way the shipped catalogue spells them. */
export const toSlug = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/["'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Adds a product, or returns the slug that is already taken.
 *
 *  The slug is the key the storefront looks a product up by, so a collision has
 *  to be refused rather than silently overwriting a live product. */
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

/** Applies a patch to one product. Unknown slugs are a no-op, not a throw:
 *  two tabs can both have the products screen open and one may have deleted it. */
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

/** Sets stock to an exact count. Negative counts are floored at zero — a
 *  warehouse cannot hold minus three phones, and the arithmetic that feeds the
 *  reorder list assumes it. */
export const setStock = (slug: string, units: number) => {
  saveProduct(slug, { stock: Math.max(0, Math.round(units)) });
};

/** Receives or writes off stock by a delta, which is what the inventory screen's
 *  +/− controls mean. */
export const adjustStock = (slug: string, delta: number) => {
  const product = findAdminProduct(slug);
  if (!product) return;
  setStock(slug, product.stock + delta);
};

export const setStatus = (slug: string, status: ProductStatus) => {
  saveProduct(slug, { status });
};

/** Throws away every edit and goes back to the shipped catalogue. */
export const resetProducts = () => products.reset();

/* ------------------------------------------------------------- read models */

export const isLowStock = (product: AdminProduct): boolean =>
  product.stock > 0 && product.stock <= product.reorderAt;

export const isOutOfStock = (product: AdminProduct): boolean => product.stock <= 0;

/** Every brand in the catalogue, alphabetically — the products filter needs it
 *  and it has to follow whatever is actually stocked. */
export const brandsOf = (rows: AdminProduct[]): string[] =>
  [...new Set(rows.map((product) => product.brand).filter((brand): brand is string => !!brand))].sort(
    (a, b) => a.localeCompare(b),
  );

