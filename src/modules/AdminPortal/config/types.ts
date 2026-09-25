import type { OrderStatus, PaymentStatus, ProductStatus } from "@/shared/libs/admin/types";

/** A link in the portal's sidebar. `exact` is for the dashboard, which would
 *  otherwise match every route beneath it. */
export type NavItem = {
  href: string;
  label: string;
  /** Lucide icon name, resolved in the sidebar so config stays data. */
  icon: NavIcon;
  exact?: boolean;
  /** Short line under the heading once the screen is open. */
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

/** How a state is painted. `flow` steps are the ordinal fulfilment ramp; the
 *  rest are the reserved status colours. */
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
    /** The warning that this gate is not security. Shown, not buried. */
    warning: string;
    nameLabel: string;
    namePlaceholder: string;
    codeLabel: string;
    codePlaceholder: string;
    hint: string;
    /** The passcode, printed on the card. It is in the bundle either way. */
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

  /** Labels for every state the portal shows, with the tone each is painted in. */
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
    resetData: string;
    resetHint: string;
    rowsShown: string;
    previous: string;
    next: string;
    page: string;
    table: string;
    chart: string;
  };
};
