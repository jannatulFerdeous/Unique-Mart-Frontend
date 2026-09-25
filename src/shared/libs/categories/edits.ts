/* Every change the portal can make to the category tree, as plain functions of
 * the tree. Each returns a new tree or throws an `EditError` carrying the
 * sentence to show and the status to send — so the route handlers are only
 * plumbing, and the rules live in one place. */

import {
  depthOf,
  MAX_DEPTH,
  NAME_MAX,
  SLUG_PATTERN,
  toSlug,
  type CategoryTree,
  type StoredCategory,
} from "./types";

export class EditError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

const clone = (tree: CategoryTree): CategoryTree => structuredClone(tree);

const find = (tree: CategoryTree, slug: string): StoredCategory => {
  const node = tree.nodes[slug];
  if (!node) throw new EditError("That category no longer exists. Reload the page.", 404);
  return node;
};

const cleanName = (value: unknown): string => {
  const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (!name) throw new EditError("Give it a name.");
  if (name.length > NAME_MAX) throw new EditError(`Names are ${NAME_MAX} characters at most.`);
  return name;
};

/** The list a node sits in: its parent's children, or the top level. */
const siblings = (tree: CategoryTree, node: StoredCategory): string[] =>
  node.parent ? find(tree, node.parent).children : tree.roots;

/** A slug nobody has. Names repeat across the tree — there is a "Samsung"
 *  under phones, tablets, watches and cases — so a clash takes the parent's
 *  slug as a suffix, the way the generated tree already does
 *  (`samsung-tablet`), and a number only if that is taken too. */
const freeSlug = (tree: CategoryTree, name: string, parent: string | null): string => {
  const base = toSlug(name);
  if (!base) throw new EditError("Use at least one letter or number in the name.");

  const candidates = [base, parent ? `${base}-${parent}` : null].filter(
    (each): each is string => !!each,
  );
  for (const candidate of candidates) if (!tree.nodes[candidate]) return candidate;

  for (let n = 2; ; n += 1) {
    const candidate = `${candidates.at(-1)}-${n}`;
    if (!tree.nodes[candidate]) return candidate;
  }
};

export const createCategory = (
  source: CategoryTree,
  input: { name?: unknown; parent?: unknown },
): { tree: CategoryTree; slug: string } => {
  const tree = clone(source);
  const name = cleanName(input.name);
  const parent = typeof input.parent === "string" && input.parent ? input.parent : null;

  if (parent) {
    find(tree, parent);
    if (depthOf(tree, parent) + 1 >= MAX_DEPTH) {
      throw new EditError("Sub-items are the deepest level. Add this beside it instead.");
    }
  }

  const list = parent ? tree.nodes[parent].children : tree.roots;
  if (list.some((slug) => tree.nodes[slug]?.name.toLowerCase() === name.toLowerCase())) {
    throw new EditError(`There is already a "${name}" here.`);
  }

  const slug = freeSlug(tree, name, parent);
  tree.nodes[slug] = { slug, name, parent, children: [], products: [], hidden: false };
  list.push(slug);
  return { tree, slug };
};

export const renameCategory = (source: CategoryTree, slug: string, value: unknown): CategoryTree => {
  const tree = clone(source);
  const node = find(tree, slug);
  const name = cleanName(value);

  const clash = siblings(tree, node).some(
    (each) => each !== slug && tree.nodes[each]?.name.toLowerCase() === name.toLowerCase(),
  );
  if (clash) throw new EditError(`There is already a "${name}" here.`);

  node.name = name;
  return tree;
};

export const setHidden = (source: CategoryTree, slug: string, hidden: boolean): CategoryTree => {
  const tree = clone(source);
  find(tree, slug).hidden = hidden;
  return tree;
};

export const moveCategory = (
  source: CategoryTree,
  slug: string,
  direction: "up" | "down",
): CategoryTree => {
  const tree = clone(source);
  const list = siblings(tree, find(tree, slug));
  const from = list.indexOf(slug);
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= list.length) return tree;

  [list[from], list[to]] = [list[to], list[from]];
  return tree;
};

/** Removes a node. Refused while it still has children — deleting "Phone"
 *  should not quietly take eighty sub-items with it. Its own products are
 *  unfiled, not deleted: they still exist, they just are not listed here. */
export const deleteCategory = (source: CategoryTree, slug: string): CategoryTree => {
  const tree = clone(source);
  const node = find(tree, slug);
  if (node.children.length) {
    throw new EditError(
      `"${node.name}" still has ${node.children.length} inside it. Delete or hide those first.`,
      409,
    );
  }

  const list = siblings(tree, node);
  list.splice(list.indexOf(slug), 1);
  delete tree.nodes[slug];
  return tree;
};

const cleanProducts = (value: unknown): string[] => {
  if (!Array.isArray(value)) throw new EditError("Send the products as a list of slugs.");
  const slugs = value.filter(
    (each): each is string => typeof each === "string" && SLUG_PATTERN.test(each) && each.length <= 160,
  );
  if (slugs.length !== value.length) throw new EditError("One of those products has an invalid address.");
  return [...new Set(slugs)];
};

/** Sets the products filed directly on one node. */
export const setCategoryProducts = (
  source: CategoryTree,
  slug: string,
  value: unknown,
): CategoryTree => {
  const tree = clone(source);
  find(tree, slug).products = cleanProducts(value);
  return tree;
};

/** Files one product on exactly these nodes — the product editor's view of the
 *  same data. Taken off every node not listed, put on every node listed. */
export const fileProduct = (source: CategoryTree, product: string, value: unknown): CategoryTree => {
  const [slug] = cleanProducts([product]);
  if (!Array.isArray(value) || !value.every((each) => typeof each === "string")) {
    throw new EditError("Send the categories as a list of slugs.");
  }

  const tree = clone(source);
  const wanted = new Set(value as string[]);
  for (const each of wanted) find(tree, each);

  for (const node of Object.values(tree.nodes)) {
    const has = node.products.includes(slug);
    if (wanted.has(node.slug) && !has) node.products.push(slug);
    if (!wanted.has(node.slug) && has) node.products = node.products.filter((each) => each !== slug);
  }
  return tree;
};
