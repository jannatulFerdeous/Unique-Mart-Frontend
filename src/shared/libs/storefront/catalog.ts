// Turns what the admin stores in the backend into the shapes the storefront
// components draw: product cards, the category tree, filter groups and the
// product page. Pure functions; the fetching lives in shared/api/storefront.ts.

import type { StaticImageData } from "next/image";
import placeholder from "@/images/products/placeholder.svg";
import type { Attribute } from "@/redux/features/attribute/attribute.types";
import {
  refId,
  type Brand,
  type Category,
  type MainCategory,
  type SubCategory,
} from "@/redux/features/catalog/catalog.types";
import type { AttributeValue, Product as ApiProduct } from "@/redux/features/product/product.types";
import type { NavItem } from "@/shared/config/navigation";
import type {
  DescriptionBlock,
  Product,
  ProductDetail,
  SpecGroup,
  VariantGroup,
  VariantOffer,
} from "@/shared/config/catalog";

export type { ApiProduct };

// ---------------------------------------------------------------------------
// Images

const IMAGE_SIZE = 800;

// Cloudinary pads every photo onto a white square of a known size, so cards
// line up and next/image knows the dimensions without asking.
export const productImage = (url?: string | null): StaticImageData => {
  if (!url) return placeholder;
  const src = url.includes("res.cloudinary.com") && url.includes("/upload/")
    ? url.replace("/upload/", `/upload/c_pad,b_white,w_${IMAGE_SIZE},h_${IMAGE_SIZE},f_auto,q_auto/`)
    : url;
  return { src, width: IMAGE_SIZE, height: IMAGE_SIZE };
};

// ---------------------------------------------------------------------------
// Category tree: Main category › Category › Sub-category

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  level: 0 | 1 | 2;
  // Slugs from the top down to this node; the URL is /category/<path…>.
  path: string[];
  href: string;
  children: CategoryNode[];
  productCount: number;
};

export const categoryHref = (path: string[]) => `/category/${path.join("/")}`;

export const productHref = (slug: string) => `/shop/product/${slug}`;

export const brandPageHref = (slug: string) => `/brands/${slug}`;

export type Catalog = {
  // Active products whose categories are all active, newest first.
  products: ApiProduct[];
  brands: Brand[];
  attributes: Attribute[];
  tree: CategoryNode[];
  nodeById: Map<string, CategoryNode>;
  brandById: Map<string, Brand>;
  attributeById: Map<string, Attribute>;
};

export const buildCatalog = (input: {
  products: ApiProduct[];
  brands: Brand[];
  mains: MainCategory[];
  categories: Category[];
  subs: SubCategory[];
  attributes: Attribute[];
}): Catalog => {
  const nodeById = new Map<string, CategoryNode>();
  const node = (item: { _id: string; name: string; slug: string }, level: 0 | 1 | 2, parent?: CategoryNode) => {
    const path = [...(parent?.path ?? []), item.slug];
    const made: CategoryNode = { id: item._id, name: item.name, slug: item.slug, level, path, href: categoryHref(path), children: [], productCount: 0 };
    nodeById.set(item._id, made);
    parent?.children.push(made);
    return made;
  };

  const byName = <T extends { name: string }>(a: T, b: T) => a.name.localeCompare(b.name);
  const tree = [...input.mains].sort(byName).map((main) => node(main, 0));
  for (const category of [...input.categories].sort(byName)) {
    const parent = nodeById.get(refId(category.mainCategoryId));
    if (parent?.level === 0) node(category, 1, parent);
  }
  for (const sub of [...input.subs].sort(byName)) {
    const parent = nodeById.get(refId(sub.categoryId));
    if (parent?.level === 1) node(sub, 2, parent);
  }

  // A product only shows when it and every level it's filed under are active.
  const products = input.products.filter((product) => {
    if (product.status !== "active") return false;
    const main = nodeById.get(refId(product.mainCategoryId));
    const category = nodeById.get(refId(product.categoryId));
    const sub = product.subCategoryId ? nodeById.get(refId(product.subCategoryId)) : undefined;
    if (!main || !category || (product.subCategoryId && !sub)) return false;
    for (const each of [main, category, sub]) if (each) each.productCount++;
    return true;
  });

  return {
    products,
    brands: input.brands,
    attributes: input.attributes,
    tree,
    nodeById,
    brandById: new Map(input.brands.map((brand) => [brand._id, brand])),
    attributeById: new Map(input.attributes.map((attribute) => [attribute._id, attribute])),
  };
};

export const findNode = (catalog: Catalog, path: string[]): CategoryNode | undefined => {
  let level: CategoryNode[] = catalog.tree;
  let found: CategoryNode | undefined;
  for (const slug of path) {
    found = level.find((each) => each.slug === slug);
    if (!found) return undefined;
    level = found.children;
  }
  return found;
};

// The main categories a flat list (search, brand, collection) spans, as links.
export const mainCategoriesOf = (catalog: Catalog, products: ApiProduct[]) => {
  const ids = new Set(products.map((product) => refId(product.mainCategoryId)));
  return catalog.tree
    .filter((node) => ids.has(node.id))
    .map((node) => ({ slug: node.slug, name: node.name, href: node.href }));
};

// For short links like /category/iphone: the first node with that slug, top level first.
export const findNodeBySlug = (catalog: Catalog, slug: string): CategoryNode | undefined =>
  [...catalog.nodeById.values()].sort((a, b) => a.level - b.level).find((each) => each.slug === slug);

export const ancestors = (catalog: Catalog, node: CategoryNode): CategoryNode[] =>
  node.path.slice(0, -1).map((_, index) => findNode(catalog, node.path.slice(0, index + 1))!);

// The header menu: every category level that has something to buy.
export const navFromTree = (nodes: CategoryNode[]): NavItem[] =>
  nodes
    .filter((node) => node.productCount > 0)
    .map((node) => {
      const children = navFromTree(node.children);
      return { label: node.name, href: node.href, ...(children.length ? { children } : {}) };
    });

export const productsUnder = (catalog: Catalog, node: CategoryNode): ApiProduct[] => {
  const field = (["mainCategoryId", "categoryId", "subCategoryId"] as const)[node.level];
  return catalog.products.filter((product) => refId(product[field]) === node.id);
};

// ---------------------------------------------------------------------------
// Cards and listings

const salePrice = (item: { price: number; discount?: number }) => Math.max(0, item.price - (item.discount ?? 0));

export const inStock = (product: ApiProduct) =>
  product.hasVariants ? product.variants.some((variant) => variant.stock > 0) : product.stock > 0;

export const brandOf = (catalog: Catalog, product: ApiProduct) =>
  catalog.brandById.get(refId(product.brandId));

export const toCard = (catalog: Catalog, product: ApiProduct): Product => ({
  id: product._id,
  slug: product.slug,
  name: product.name,
  image: productImage(product.images[0]?.url),
  brand: brandOf(catalog, product)?.name,
  price: salePrice(product),
  compareAt: product.discount > 0 ? product.price : undefined,
  badge: product.isUpcoming ? "COMING SOON" : product.isExclusive ? "EXCLUSIVE" : undefined,
});

export type Offer = {
  product: Product;
  saving: number;
  percent: number;
};

// Everything with money off, biggest percentage first.
export const toOffers = (catalog: Catalog): Offer[] =>
  catalog.products
    .map((product) => toCard(catalog, product))
    .flatMap((card) =>
      card.compareAt && card.compareAt > card.price
        ? [{ product: card, saving: card.compareAt - card.price, percent: Math.round((1 - card.price / card.compareAt) * 100) }]
        : [],
    )
    .sort((a, b) => b.percent - a.percent || b.saving - a.saving);

// "Resolution (Display)" is stored that way to keep names unique; under the
// Display heading it only needs to say "Resolution".
export const attributeLabel = (name: string, group?: string) =>
  group && name.endsWith(` (${group})`) ? name.slice(0, -(group.length + 3)) : name.replace(/ \([^)]*\)$/, "");

export const valueLabels = (attribute: Attribute | undefined, value: AttributeValue): string[] => {
  const label = (raw: string) => attribute?.options?.find((option) => option.value === raw)?.label ?? raw;
  if (Array.isArray(value)) return value.map(label);
  if (typeof value === "boolean") return [value ? "Yes" : "No"];
  if (typeof value === "number") return [String(value)];
  if (attribute?.type === "select") return [label(value)];
  return value.split(/;\s+|\n/).map((line) => line.trim()).filter(Boolean);
};

export type FacetGroup = { id: string; label: string; values: string[] };

export type ListingItem = {
  product: Product;
  child?: string;
  facets: Record<string, string[]>;
};

const AVAILABILITY: FacetGroup = { id: "availability", label: "Availability", values: ["In Stock", "Up Coming", "Out of Stock"] };

// Every attribute the admin ticked "Use as a shop filter", with the values
// these products actually have, in the attribute's own choice order.
export const facetGroupsFor = (catalog: Catalog, items: ListingItem[]): FacetGroup[] => {
  const groups: FacetGroup[] = [AVAILABILITY];
  for (const attribute of catalog.attributes) {
    if (!attribute.isFilterable) continue;
    const id = `attr-${attribute._id}`;
    const present = new Set(items.flatMap((item) => item.facets[id] ?? []));
    if (!present.size) continue;
    const ordered = attribute.options?.map((option) => option.label).filter((label) => present.has(label)) ?? [];
    const rest = [...present].filter((value) => !ordered.includes(value)).sort();
    groups.push({ id, label: attributeLabel(attribute.name), values: [...ordered, ...rest] });
  }
  return groups;
};

// `childLevel` is the category level the listing can be narrowed by (its
// "Category" filter and the links above it).
export const toListing = (catalog: Catalog, products: ApiProduct[], childLevel?: 0 | 1 | 2): ListingItem[] =>
  products.map((product) => {
    const facets: Record<string, string[]> = {
      availability: [product.isUpcoming ? "Up Coming" : inStock(product) ? "In Stock" : "Out of Stock"],
    };
    const add = (attributeId: string, value: AttributeValue) => {
      const attribute = catalog.attributeById.get(attributeId);
      if (!attribute?.isFilterable) return;
      const id = `attr-${attributeId}`;
      facets[id] = [...new Set([...(facets[id] ?? []), ...valueLabels(attribute, value)])];
    };
    for (const each of product.attributes ?? []) add(refId(each.attributeId), each.value);
    for (const variant of product.variants ?? []) for (const each of variant.attributes) add(refId(each.attributeId), each.value);

    const field = childLevel === undefined ? undefined : (["mainCategoryId", "categoryId", "subCategoryId"] as const)[childLevel];
    const childId = field ? refId(product[field]) : "";
    return { product: toCard(catalog, product), child: catalog.nodeById.get(childId)?.slug, facets };
  });

// ---------------------------------------------------------------------------
// Product page

export const toDetail = (catalog: Catalog, product: ApiProduct): ProductDetail => {
  // Variant option groups, in the order the variants use them.
  const groups = new Map<string, { attribute?: Attribute; label: string; values: string[] }>();
  const variants: VariantOffer[] = product.hasVariants
    ? product.variants.map((variant) => {
        const options: Record<string, string> = {};
        for (const each of variant.attributes) {
          const id = refId(each.attributeId);
          const attribute = catalog.attributeById.get(id);
          const name = attributeLabel(attribute?.name ?? (typeof each.attributeId === "string" ? "Option" : each.attributeId.name));
          const value = valueLabels(attribute, each.value).join(", ");
          if (!groups.has(id)) groups.set(id, { attribute, label: name, values: [] });
          const group = groups.get(id)!;
          if (!group.values.includes(value)) group.values.push(value);
          options[name] = value;
        }
        return {
          id: variant._id,
          sku: variant.sku,
          options,
          price: salePrice(variant),
          compareAt: (variant.discount ?? 0) > 0 ? variant.price : undefined,
          stock: variant.stock,
        };
      })
    : [];

  const options: VariantGroup[] = [...groups.values()].map(({ attribute, label, values }) => ({
    label,
    values: attribute?.options
      ? [...values].sort(
          (a, b) =>
            attribute.options!.findIndex((option) => option.label === a) -
            attribute.options!.findIndex((option) => option.label === b),
        )
      : values,
  }));

  const specs: SpecGroup[] = (product.specifications ?? [])
    .map((group) => ({
      title: group.group.name,
      rows: group.attributes
        .map(({ attribute, value }) => ({
          label: attributeLabel(attribute.name, group.group.name),
          value: valueLabels(catalog.attributeById.get(attribute._id), value),
        }))
        .filter((row) => row.value.length),
    }))
    .filter((group) => group.rows.length);

  const blocks: DescriptionBlock[] = (product.description ?? "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({ paragraphs: [paragraph] }));

  return {
    gallery: product.images.length ? product.images.map((image) => productImage(image.url)) : [productImage()],
    inStock: inStock(product),
    highlights: [],
    options: options.length ? options : undefined,
    variants: variants.length ? variants : undefined,
    specs,
    description: blocks.length ? { title: product.name, blocks } : undefined,
  };
};
