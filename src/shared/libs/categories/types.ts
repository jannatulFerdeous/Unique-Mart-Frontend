/* The category tree the portal edits — shapes and rules both sides share.
 *
 * Three levels, named the way the shop owner talks about them: a Category
 * ("Phone") holds Items ("Samsung"), which hold Sub-items ("Galaxy S"). The
 * header menu shows all three; the category page aggregates whatever sits
 * underneath it.
 *
 * Stored flat, keyed by slug, with each node naming its parent and its children
 * in order. Products are filed on the node they were put on (`products`), and
 * rolled up the tree only when the storefront reads it — so moving a product
 * from one sub-item to another is one edit, not three. */

import type { Category } from "@/shared/config/categories";

export type StoredCategory = {
  /** The URL — `/category/<slug>`. Fixed once created: a customer or a search
   *  engine may already have the link. */
  slug: string;
  name: string;
  parent: string | null;
  /** Child slugs, in menu order. */
  children: string[];
  /** Product slugs filed directly on this node, not on its children. */
  products: string[];
  /** Hidden nodes, and everything under them, drop out of the menu and 404. */
  hidden: boolean;
};

export type CategoryTree = {
  /** Top-level slugs, in menu order. */
  roots: string[];
  nodes: Record<string, StoredCategory>;
};

export const MAX_DEPTH = 3;

/** What each level is called on screen, outermost first. */
export const LEVEL_NAMES = ["Category", "Item", "Sub-item"] as const;

export const NAME_MAX = 60;

/** Letters, digits and single hyphens. Upper case is allowed because two
 *  generated slugs carry it (`iphone-12-pro-max-Cases`) and they are live URLs;
 *  new slugs come out of `toSlug`, which lowers everything. */
export const SLUG_PATTERN = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

export const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");

/** Ancestor slugs, outermost first. Capped, so a hand-edited file with a cycle
 *  in it cannot hang a render. */
export const trailOf = (tree: CategoryTree, slug: string): string[] => {
  const trail: string[] = [];
  let parent = tree.nodes[slug]?.parent ?? null;

  while (parent && trail.length < MAX_DEPTH) {
    trail.unshift(parent);
    parent = tree.nodes[parent]?.parent ?? null;
  }
  return trail;
};

/** 0 for a Category, 1 for an Item, 2 for a Sub-item. */
export const depthOf = (tree: CategoryTree, slug: string): number => trailOf(tree, slug).length;

/** What the storefront reads: visible nodes only, with the trail worked out and
 *  every product under a node rolled up into it, own products first, then each
 *  child's in menu order. The same shape the generated config has, so the
 *  category page does not care which it was handed. */
export const buildCategories = (tree: CategoryTree): Record<string, Category> => {
  const built: Record<string, Category> = {};

  const visit = (slug: string, trail: string[]): string[] => {
    const node = tree.nodes[slug];
    if (!node || node.hidden || trail.length >= MAX_DEPTH || built[slug]) return [];

    const children: string[] = [];
    const products = [...node.products];

    for (const child of node.children) {
      const below = visit(child, [...trail, slug]);
      if (!built[child]) continue;
      children.push(child);
      for (const product of below) if (!products.includes(product)) products.push(product);
    }

    built[slug] = { slug, name: node.name, trail, children, products };
    return products;
  };

  for (const root of tree.roots) visit(root, []);
  return built;
};

/** Every node a product is filed on, by slug. */
export const categoriesOfProduct = (tree: CategoryTree, product: string): string[] =>
  Object.values(tree.nodes)
    .filter((node) => node.products.includes(product))
    .map((node) => node.slug);

/** "Phone › Samsung › Galaxy S" — how a node is named where its level is not
 *  obvious, like a product's category list. */
export const pathName = (tree: CategoryTree, slug: string): string =>
  [...trailOf(tree, slug), slug].map((each) => tree.nodes[each]?.name ?? each).join(" › ");

export type Filing = {
  /** Top-level category slugs the product sits under. */
  roots: Set<string>;
  /** Every node it is filed on, named in full. */
  paths: string[];
};

/** Where every product is filed, by product slug — built once per tree rather
 *  than walked per table row. */
export const indexFiling = (tree: CategoryTree): Map<string, Filing> => {
  const index = new Map<string, Filing>();

  for (const node of Object.values(tree.nodes)) {
    if (!node.products.length) continue;
    const root = trailOf(tree, node.slug)[0] ?? node.slug;
    const path = pathName(tree, node.slug);

    for (const product of node.products) {
      const filing = index.get(product) ?? { roots: new Set<string>(), paths: [] };
      filing.roots.add(root);
      filing.paths.push(path);
      index.set(product, filing);
    }
  }
  return index;
};
