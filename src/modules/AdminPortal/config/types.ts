export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  exact?: boolean;
  blurb: string;
};

export type NavIcon =
  | "dashboard"
  | "payments"
  | "banners"
  | "products"
  | "brands"
  | "mainCategories"
  | "categories"
  | "subCategories"
  | "attributeGroups"
  | "attributes"
  | "users"
  | "settings"
  | "profile"
  | "orders"
  | "reviews"
  | "addresses"
  | "faq"
  | "coupons"
  | "newsletter"
  | "refunds"
  | "orderStatus"
  | "support";

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type Tone =
  | "neutral"
  | "flow-1"
  | "flow-2"
  | "flow-3"
  | "flow-4"
  | "flow-5"
  | "good"
  | "warning"
  | "serious"
  | "critical";

export type AdminData = {
  gate: {
    loading: string;
    signInTitle: string;
    signInBody: string;
    signIn: string;
    noAccessTitle: string;
    noAccessBody: string;
    goHome: string;
    back: string;
  };

  shell: {
    brand: string;
    subtitle: string;
    viewSite: string;
    signOut: string;
    menu: string;
    closeMenu: string;
    menuTitle: string;
    signedInAs: string;
  };

  nav: NavGroup[];

  common: {
    search: string;
    clear: string;
    all: string;
    delete: string;
    confirm: string;
    cancel: string;
    save: string;
    saved: string;
    edit: string;
    view: string;
    close: string;
    selected: string;
    noResults: string;
    rowsShown: string;
    previous: string;
    next: string;
    page: string;
    table: string;
    chart: string;
  };
};
