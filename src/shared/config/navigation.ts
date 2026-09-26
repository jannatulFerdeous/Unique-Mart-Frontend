import { categoryPath, type Category } from "./categories";

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const buildCategoryNav = (
  categories: Record<string, Category>,
  roots: string[],
): NavItem[] => {
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

  return roots.map((slug) => toNavItem(slug)).filter((item): item is NavItem => item !== null);
};

export const utilityNav: NavItem[] = [
  { label: "Offers", href: "/offers" },
  { label: "Store Locator", href: "/store-locator" },
];
