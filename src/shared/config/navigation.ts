import { categories, categoryPath, rootCategories } from "./categories";

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

/** The navbar is the category tree — one source, so a menu entry can never
 *  point at a category that does not exist. The tree itself is generated from
 *  the catalogue by `scripts/scrape-catalogue.mjs`; edit that, not this.
 *
 *  Depth is capped at three because `CategoryMenu` renders a two-level flyout
 *  under each section, and the fourth level is per-model case categories that
 *  belong on the category page's own sidebar rather than in a hover menu. */
const toNavItem = (slug: string, depth = 0): NavItem | null => {
  const category = categories[slug];
  if (!category) return null;

  const children =
    depth < 2
      ? category.children
          .map((child) => toNavItem(child, depth + 1))
          .filter((child): child is NavItem => child !== null)
      : [];

  return {
    label: category.name,
    href: categoryPath(category.slug),
    ...(children.length ? { children } : {}),
  };
};

export const categoryNav: NavItem[] = rootCategories
  .map((slug) => toNavItem(slug))
  .filter((item): item is NavItem => item !== null);

export const utilityNav: NavItem[] = [
  { label: "Offers", href: "/offers" },
  { label: "Store Locator", href: "/store-locator" },
];
