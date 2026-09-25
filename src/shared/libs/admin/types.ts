/* The shapes the admin portal works in.
 *
 * These are deliberately the shapes a real backend would return, not the
 * shapes the storefront's static config happens to have. The portal is the
 * first part of this site that needs stock counts, orders, payments and
 * customers at all, so it is where that vocabulary gets written down. When an
 * API lands, this file is the contract to hold it to. */

export type ProductStatus = "live" | "draft" | "archived";

/** A catalogue row as the portal edits it.
 *
 *  No image field: the ~100 products that ship in `shared/config/products`
 *  carry a bundled `StaticImageData`, which cannot survive `JSON.stringify`.
 *  The bundled shot is looked up by slug at render instead, and a product
 *  added here keeps a plain `imageUrl`. */
export type AdminProduct = {
  slug: string;
  name: string;
  brand?: string;
  /** Free text, matched against the storefront's category names by eye for
   *  now — the category tree in `shared/config/categories` is 2,400 lines of
   *  navigation and filing every product into it is its own task. */
  category?: string;
  price: number;
  /** Was-price. Set it above `price` and the storefront shows a discount. */
  compareAt?: number;
  rating?: number;
  badge?: string;
  /** Units on hand. Zero reads "out of stock" everywhere it is shown. */
  stock: number;
  /** Below this the row reads "low" and the product joins the reorder list. */
  reorderAt: number;
  sku: string;
  status: ProductStatus;
  /** ISO 8601. */
  createdAt: string;
  imageUrl?: string;
  description?: string;
  /** True for products seeded from the shipped catalogue. They can be edited
   *  and archived like any other, but the portal says where they came from. */
  fromCatalogue: boolean;
};

/* --------------------------------------------------------------- ordering */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "bkash" | "nagad" | "card" | "bank" | "cod";

export type OrderItem = {
  slug: string;
  /** Copied at the time of sale. A later rename must not rewrite history. */
  name: string;
  unitPrice: number;
  quantity: number;
};

export type OrderPayment = {
  method: PaymentMethod;
  status: PaymentStatus;
  /** Gateway or bKash transaction id. Absent until money moves. */
  reference?: string;
  paidAt?: string;
  refundedAt?: string;
};

export type Order = {
  /** Human-facing, because it is read down a phone line: "UM-10428". */
  id: string;
  customerId: string;
  placedAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment: OrderPayment;
  address: {
    line: string;
    city: string;
    district: string;
    phone: string;
  };
  note?: string;
};

/* -------------------------------------------------------------- customers */

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedAt: string;
  /** Blocked accounts keep their history; they just cannot order again. */
  blocked: boolean;
  /** True for the visitor signed in on this browser, surfaced so the portal
   *  shows at least one account that is really there. */
  fromSession?: boolean;
};

/* ------------------------------------------------------------------ carts */

export type CartLine = {
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

/** A basket that has not become an order. Guest baskets have no customer. */
export type Cart = {
  id: string;
  customerId: string | null;
  /** Guest baskets still leave a name if the visitor started checkout. */
  guestLabel?: string;
  updatedAt: string;
  lines: CartLine[];
};

/* ---------------------------------------------------------------- reviews */

/** Where a review the portal is showing actually lives.
 *
 *  `storefront` reviews were written by this browser through the product page
 *  and are read live out of that store — deleting one really deletes it.
 *  `sample` reviews are the portal's own demo rows, so the moderation queue is
 *  not empty before the site has any traffic. */
export type ReviewSource = "storefront" | "sample";

export type AdminReview = {
  id: string;
  source: ReviewSource;
  /** Product slug. */
  slug: string;
  /** Product name at read time, for the table. */
  product: string;
  author: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  /** Hidden reviews stay in the store but are marked as pulled. Only sample
   *  rows can be hidden — a storefront review has nowhere to record it yet. */
  hidden: boolean;
};

/* --------------------------------------------------------------- settings */

export type StoreSettings = {
  storeName: string;
  supportPhone: string;
  supportEmail: string;
  /** Free delivery at or above this. */
  freeShippingFrom: number;
  shippingFlat: number;
  /** Which methods checkout offers, in the order it offers them. */
  methods: { id: PaymentMethod; label: string; enabled: boolean }[];
  /** Below this, a product joins the reorder list by default. */
  defaultReorderAt: number;
};
