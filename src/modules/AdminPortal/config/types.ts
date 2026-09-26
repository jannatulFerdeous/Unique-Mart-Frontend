import type { OrderStatus, PaymentStatus, ProductStatus } from "@/shared/libs/admin/types";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  exact?: boolean;
  blurb: string;
};

export type NavIcon =
  | "dashboard"
  | "banners"
  | "settings";

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
    eyebrow: string;
    title: string;
    body: string;
    warning: string;
    nameLabel: string;
    namePlaceholder: string;
    codeLabel: string;
    codePlaceholder: string;
    hint: string;
    passcode: string;
    submit: string;
    wrong: string;
    back: string;
  };

  shell: {
    brand: string;
    subtitle: string;
    viewSite: string;
    signOut: string;
    menu: string;
    closeMenu: string;
    signedInAs: string;
  };

  nav: NavGroup[];

  orderStatus: Record<OrderStatus, { label: string; tone: Tone }>;
  paymentStatus: Record<PaymentStatus, { label: string; tone: Tone }>;
  productStatus: Record<ProductStatus, { label: string; tone: Tone }>;

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
