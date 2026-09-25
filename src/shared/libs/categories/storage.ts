/* The category tree on disk — `storage/categories.json`.
 *
 * Until the portal saves its first change there is no file, and the tree is the
 * one generated from the catalogue into `shared/config/categories`. The first
 * save copies that tree to disk, and from then on the file is the tree: the
 * header menu, the category pages and the portal all read it from here.
 * Re-running the catalogue scrape changes the starting point, not a tree the
 * portal has already taken over. */

import "server-only";
import path from "node:path";
import { categories as generated, rootCategories, type Category } from "@/shared/config/categories";
import { buildCategoryNav, type NavItem } from "@/shared/config/navigation";
import { readJson, removeFile, STORAGE_ROOT, writeJson } from "@/shared/libs/server/files";
import {
  buildCategories,
  MAX_DEPTH,
  NAME_MAX,
  SLUG_PATTERN,
  type CategoryTree,
  type StoredCategory,
} from "./types";

const FILE = path.join(STORAGE_ROOT, "categories.json");

/** The generated tree, restated in the stored shape. The generated `products`
 *  lists are already rolled up, so a node's own products are the ones none of
 *  its children hold. */
export const seedTree = (): CategoryTree => {
  const nodes: Record<string, StoredCategory> = {};

  for (const category of Object.values(generated)) {
    const below = new Set(category.children.flatMap((child) => generated[child]?.products ?? []));
    nodes[category.slug] = {
      slug: category.slug,
      name: category.name,
      parent: category.trail.at(-1) ?? null,
      children: [...category.children],
      products: category.products.filter((product) => !below.has(product)),
      hidden: false,
    };
  }

  return { roots: [...rootCategories], nodes };
};

const isNode = (value: unknown, slug: string): value is StoredCategory => {
  if (typeof value !== "object" || value === null) return false;
  const each = value as Record<string, unknown>;
  return (
    each.slug === slug &&
    SLUG_PATTERN.test(slug) &&
    typeof each.name === "string" &&
    each.name.length > 0 &&
    each.name.length <= NAME_MAX &&
    (each.parent === null || typeof each.parent === "string") &&
    Array.isArray(each.children) &&
    each.children.every((child) => typeof child === "string") &&
    Array.isArray(each.products) &&
    each.products.every((product) => typeof product === "string") &&
    typeof each.hidden === "boolean"
  );
};

/** A stored tree, or null for anything malformed. Structure is checked as well
 *  as shape — every child must name its parent back and nothing may sit deeper
 *  than three levels — because a broken file here breaks the menu on every page. */
export const revive = (value: unknown): CategoryTree | null => {
  if (typeof value !== "object" || value === null) return null;
  const { roots, nodes } = value as { roots?: unknown; nodes?: unknown };
  if (!Array.isArray(roots) || typeof nodes !== "object" || nodes === null) return null;

  const tree = { roots, nodes } as CategoryTree;
  for (const [slug, node] of Object.entries(tree.nodes)) {
    if (!isNode(node, slug)) return null;
  }

  const seen = new Set<string>();
  const walk = (slug: string, parent: string | null, depth: number): boolean => {
    const node = tree.nodes[slug];
    if (!node || node.parent !== parent || depth >= MAX_DEPTH || seen.has(slug)) return false;
    seen.add(slug);
    return node.children.every((child) => walk(child, slug, depth + 1));
  };

  const connected = tree.roots.every((root) => typeof root === "string" && walk(root, null, 0));
  return connected && seen.size === Object.keys(tree.nodes).length ? tree : null;
};

/** The tree the shop runs on: the saved one, or the generated one before the
 *  first save — or if the file on disk is damaged, which is logged, since the
 *  portal's edits are then invisible until someone looks. */
export const readTree = async (): Promise<CategoryTree> => {
  const stored = await readJson(FILE);
  if (stored === null) return seedTree();

  const tree = revive(stored);
  if (!tree) console.error("[categories] storage/categories.json is malformed; using the built-in tree.");
  return tree ?? seedTree();
};

export const writeTree = (tree: CategoryTree): Promise<void> => writeJson(FILE, tree);

/** Forgets every edit. The shop goes back to the generated tree. */
export const resetTree = (): Promise<void> => removeFile(FILE);

/* ------------------------------------------------------------ storefront */

/** Visible categories, rolled up — what the header and category pages read. */
export const getCategories = async (): Promise<Record<string, Category>> =>
  buildCategories(await readTree());

/** The header's category menu. */
export const getCategoryNav = async (): Promise<NavItem[]> => {
  const tree = await readTree();
  return buildCategoryNav(buildCategories(tree), tree.roots);
};
