/* Orders, and the payment attached to each.
 *
 * Payments are not a second store. A payment exists because an order exists, and
 * two stores would drift the moment one screen marked a payment paid and the
 * other still called the order unpaid. So the payments screen is a view over
 * these rows — `paymentsOf` below — and "mark paid" and "refund" are order
 * mutations. One source of truth, one place to fix.
 *
 * The rows are seeded deterministically from the shipped catalogue: real product
 * names at real prices, so the dashboard's revenue and its best-sellers are
 * arithmetic over things that exist rather than invented figures. */

import { allProducts } from "@/shared/config/products";
import { createStore, daysAgo, localId, rng } from "./store";
import type {
  Cart,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "./types";

const KEY = "unique-mart.admin.orders.v1";

/** Delivery, as the seeded history charged it. Current rates live in
 *  `settings`; an order keeps what it was actually billed. */
const SHIPPING_FLAT = 120;
const FREE_SHIPPING_FROM = 50_000;

export const ORDER_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
];

/** Statuses an order can be moved to from here.
 *
 *  Forward one step along the flow, or out of it. Deliberately not a free
 *  choice: a delivered order that can be flipped back to "pending" is how a
 *  warehouse loses track of a parcel, and a refunded one is finished. */
export const nextStatuses = (status: OrderStatus): OrderStatus[] => {
  if (status === "delivered") return ["refunded"];
  if (status === "cancelled" || status === "refunded") return [];

  const step = ORDER_FLOW[ORDER_FLOW.indexOf(status) + 1];
  return step ? [step, "cancelled"] : ["cancelled"];
};

const METHODS: PaymentMethod[] = ["bkash", "nagad", "card", "bank", "cod"];

const DISTRICTS: [string, string][] = [
  ["Dhaka", "Dhaka"],
  ["Chattogram", "Chattogram"],
  ["Sylhet", "Sylhet"],
  ["Khulna", "Khulna"],
  ["Rajshahi", "Rajshahi"],
  ["Narayanganj", "Dhaka"],
  ["Cumilla", "Chattogram"],
  ["Gazipur", "Dhaka"],
];

const ROADS = ["Green Road", "Mirpur Road", "Bailey Road", "Airport Road", "CDA Avenue", "Zindabazar"];

/** Sum of the line totals. Never stored twice — every caller derives it. */
export const subtotalOf = (items: OrderItem[]): number =>
  items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

export const shippingFor = (subtotal: number): number =>
  subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;

/** How many orders to seed. Spread over 120 days, which is enough history for
 *  a 30-day revenue chart to have a shape and a 90-day comparison to mean
 *  something. */
const COUNT = 164;
const HISTORY_DAYS = 120;

const seed = (): Order[] => {
  const random = rng(480_915);
  const pool = allProducts;

  const rows = Array.from({ length: COUNT }, (_, index) => {
    /* Squared, so orders cluster into the recent past the way a growing shop's
       would. A flat spread makes every dashboard trend line dead level. */
    const age = Math.round(random() ** 2 * HISTORY_DAYS);

    const lines = 1 + Math.floor(random() * 3);
    const items: OrderItem[] = [];
    for (let line = 0; line < lines; line += 1) {
      const product = pool[Math.floor(random() * pool.length)];
      if (items.some((item) => item.slug === product.slug)) continue;
      items.push({
        slug: product.slug,
        name: product.name,
        unitPrice: product.price,
        /* Two of something cheap is common, two flagships is not. */
        quantity: product.price < 10_000 && random() < 0.4 ? 2 : 1,
      });
    }

    const subtotal = subtotalOf(items);
    const shipping = shippingFor(subtotal);
    /* A round promo on about a fifth of orders — enough that the discount
       column is not dead, few enough that it reads as a promotion. */
    const discount = random() < 0.2 ? Math.min(2000, Math.round((subtotal * 0.05) / 100) * 100) : 0;

    /* Status follows age: today's orders are still being picked, last month's
       arrived. The small tail of cancellations and refunds is what gives the
       payments screen something to act on. */
    const roll = random();
    let status: OrderStatus;
    if (roll < 0.05) status = "cancelled";
    else if (roll < 0.08) status = "refunded";
    else if (age > 12) status = "delivered";
    else if (age > 6) status = "shipped";
    else if (age > 3) status = "packed";
    else if (age > 1) status = "confirmed";
    else status = "pending";

    const method = METHODS[Math.floor(random() * METHODS.length)];

    /* Cash on delivery is unpaid until the courier hands it over; everything
       else is taken at checkout, so a pending card order is a pending payment. */
    let payment: PaymentStatus;
    if (status === "refunded") payment = "refunded";
    else if (status === "cancelled") payment = method === "cod" ? "unpaid" : "failed";
    else if (method === "cod") payment = status === "delivered" ? "paid" : "unpaid";
    else payment = status === "pending" ? "pending" : "paid";

    const [city, district] = DISTRICTS[Math.floor(random() * DISTRICTS.length)];
    const placedAt = daysAgo(age + random() * 0.9);

    return {
      id: `UM-${10_000 + index * 3}`,
      customerId: `CU-${2000 + Math.floor(random() * 46)}`,
      placedAt,
      items,
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
      status,
      payment: {
        method,
        status: payment,
        ...(payment === "paid" || payment === "refunded"
          ? {
              reference: `${method.toUpperCase()}${String(Math.floor(random() * 1e9)).padStart(9, "0")}`,
              paidAt: placedAt,
            }
          : {}),
        ...(payment === "refunded" ? { refundedAt: daysAgo(Math.max(0, age - 2)) } : {}),
      },
      address: {
        line: `House ${1 + Math.floor(random() * 90)}, ${ROADS[Math.floor(random() * ROADS.length)]}`,
        city,
        district,
        phone: `01${3 + Math.floor(random() * 7)}${String(Math.floor(random() * 1e8)).padStart(8, "0")}`,
      },
    } satisfies Order;
  });

  // Newest first, which is the order every screen wants them in.
  return rows.sort((a, b) => b.placedAt.localeCompare(a.placedAt));
};

const isOrder = (value: unknown): value is Order => {
  if (typeof value !== "object" || value === null) return false;
  const each = value as Record<string, unknown>;
  return (
    typeof each.id === "string" &&
    each.id.length > 0 &&
    Array.isArray(each.items) &&
    typeof each.total === "number" &&
    Number.isFinite(each.total) &&
    typeof each.status === "string" &&
    typeof each.payment === "object" &&
    each.payment !== null
  );
};

const revive = (value: unknown): Order[] | null => {
  if (!Array.isArray(value)) return null;
  const rows = value.filter(isOrder);
  return rows.length ? rows : null;
};

export const orders = createStore(KEY, seed, revive);

export const useOrders = (): Order[] => orders.use();

export const findOrder = (id: string): Order | undefined =>
  orders.read().find((order) => order.id === id);

const patch = (id: string, change: (order: Order) => Order) => {
  orders.update((current) =>
    current.map((order) => (order.id === id ? change(order) : order)),
  );
};

/** Moves an order along. Cash-on-delivery settles on delivery, so that one
 *  transition also books the money — which is what actually happens when a
 *  courier hands the parcel over. */
export const setOrderStatus = (id: string, status: OrderStatus) => {
  patch(id, (order) => {
    const settles =
      status === "delivered" && order.payment.method === "cod" && order.payment.status !== "paid";

    return {
      ...order,
      status,
      payment: settles
        ? {
            ...order.payment,
            status: "paid",
            paidAt: new Date().toISOString(),
            reference: order.payment.reference ?? `COD${order.id.replace(/\D/g, "")}`,
          }
        : order.payment,
    };
  });
};

export const markPaid = (id: string, reference?: string) => {
  patch(id, (order) => ({
    ...order,
    payment: {
      ...order.payment,
      status: "paid",
      paidAt: new Date().toISOString(),
      reference: reference?.trim() || order.payment.reference || `MANUAL${order.id.replace(/\D/g, "")}`,
    },
  }));
};

export const markPaymentFailed = (id: string) => {
  patch(id, (order) => ({
    ...order,
    payment: { ...order.payment, status: "failed" },
  }));
};

/** Refunds an order: the money goes back and the order leaves the flow. Both
 *  happen together, because a refunded payment on a "delivered" order is the
 *  kind of half-state that makes a ledger untrustworthy. */
export const refundOrder = (id: string) => {
  patch(id, (order) => ({
    ...order,
    status: "refunded",
    payment: {
      ...order.payment,
      status: "refunded",
      refundedAt: new Date().toISOString(),
    },
  }));
};

export const setOrderNote = (id: string, note: string) => {
  patch(id, (order) => ({ ...order, note: note.trim() || undefined }));
};

export const deleteOrder = (id: string) => {
  orders.update((current) => current.filter((order) => order.id !== id));
};

export const resetOrders = () => orders.reset();

/** Turns a basket into a pending order, which is what the carts screen's
 *  "convert" action does. Returns the new order so the caller can link to it. */
export const orderFromCart = (cart: Cart, customerId: string | null): Order => {
  const items = cart.lines.map((line) => ({
    slug: line.slug,
    name: line.name,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
  }));
  const subtotal = subtotalOf(items);
  const shipping = shippingFor(subtotal);

  const order: Order = {
    id: `UM-${localId("c").slice(-6).toUpperCase()}`,
    customerId: customerId ?? cart.customerId ?? "CU-guest",
    placedAt: new Date().toISOString(),
    items,
    subtotal,
    shipping,
    discount: 0,
    total: subtotal + shipping,
    status: "pending",
    payment: { method: "cod", status: "unpaid" },
    address: { line: "", city: "", district: "", phone: "" },
    note: "Raised from an open basket in the admin portal.",
  };

  orders.update((current) => [order, ...current]);
  return order;
};

/* ------------------------------------------------------------- read models */

/** Money actually earned. Cancelled and refunded orders are excluded, so the
 *  dashboard's headline is revenue rather than gross order value. */
export const isRevenue = (order: Order): boolean =>
  order.status !== "cancelled" && order.status !== "refunded";

export const revenueOf = (rows: Order[]): number =>
  rows.filter(isRevenue).reduce((sum, order) => sum + order.total, 0);

/** One payment per order, flattened for the payments screen. */
export type PaymentRow = {
  orderId: string;
  customerId: string;
  placedAt: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  paidAt?: string;
  refundedAt?: string;
};

export const paymentsOf = (rows: Order[]): PaymentRow[] =>
  rows.map((order) => ({
    orderId: order.id,
    customerId: order.customerId,
    placedAt: order.placedAt,
    amount: order.total,
    ...order.payment,
  }));

/** Orders belonging to one account, newest first. */
export const ordersFor = (rows: Order[], customerId: string): Order[] =>
  rows.filter((order) => order.customerId === customerId);
