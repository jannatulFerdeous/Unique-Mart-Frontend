export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const utilityNav: NavItem[] = [
  { label: "Offers", href: "/offers" },
  { label: "Store Locator", href: "/store-locator" },
];
