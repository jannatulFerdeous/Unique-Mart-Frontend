/* Everything the dashboard shows, derived rather than stored.
 *
 * No metric has its own store. A "total revenue" field that has to be kept in
 * step with the orders it came from is a field that will eventually disagree
 * with them, and the disagreement is invisible — the number still looks like a
 * number. So every figure in this file is arithmetic over the order rows, run on
 * render. The catalogue is a hundred products and the history is a few hundred
 * orders; this is cheap, and it cannot go stale. */

import { isRevenue } from "./orders";
import { cartValue, isAbandoned } from "./carts";
import { isLowStock, isOutOfStock } from "./products";
import type { AdminProduct, Cart, Customer, Order, OrderStatus, PaymentMethod } from "./types";

/** A day on the revenue chart. */
export type DayPoint = {
  /** `YYYY-MM-DD`, local. The key the chart groups on. */
  date: string;
  revenue: number;
  orders: number;
};

/** Local calendar day for an ISO timestamp.
 *
 *  Local, not UTC: a shop in Dhaka closes at midnight Dhaka time, and slicing
 *  on UTC would file the evening's orders under tomorrow. */
const dayKey = (iso: string): string => {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

/** Revenue and order count per day for the last `days` days, oldest first.
 *
 *  Every day in the window is present, including the quiet ones. A chart that
 *  silently drops empty days compresses the gaps and draws a busier shop than
 *  the one that exists. */
export const revenueSeries = (rows: Order[], days = 30): DayPoint[] => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));

  const buckets = new Map<string, DayPoint>();
  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + offset);
    const key = dayKey(date.toISOString());
    buckets.set(key, { date: key, revenue: 0, orders: 0 });
  }

  for (const order of rows) {
    if (!isRevenue(order)) continue;
    const bucket = buckets.get(dayKey(order.placedAt));
    if (!bucket) continue;
    bucket.revenue += order.total;
    bucket.orders += 1;
  }

  return [...buckets.values()];
};

/** Orders placed within the last `days` days. */
export const within = (rows: Order[], days: number): Order[] => {
  const cutoff = Date.now() - days * 86_400_000;
  return rows.filter((order) => new Date(order.placedAt).getTime() >= cutoff);
};

/** The window before the one `within` returns, for a like-for-like comparison. */
export const previous = (rows: Order[], days: number): Order[] => {
  const end = Date.now() - days * 86_400_000;
  const start = end - days * 86_400_000;
  return rows.filter((order) => {
    const at = new Date(order.placedAt).getTime();
    return at >= start && at < end;
  });
};

/** Per-cent change, or null when there is no baseline to compare against.
 *
 *  Null rather than 100%: going from nothing to something is not a percentage,
 *  and "+∞%" on a dashboard is a bug that looks like a triumph. */
export const delta = (current: number, before: number): number | null => {
  if (before <= 0) return null;
  return ((current - before) / before) * 100;
};

export type Kpis = {
  revenue: number;
  revenueDelta: number | null;
  orders: number;
  ordersDelta: number | null;
  /** Average order value across revenue-bearing orders in the window. */
  average: number;
  /** Orders that have not shipped yet — the work waiting on the shop today. */
  openOrders: number;
  /** Money owed: confirmed orders whose payment has not landed. */
  unpaid: number;
  newCustomers: number;
  abandonedCarts: number;
  abandonedValue: number;
  lowStock: number;
  outOfStock: number;
  /** Stock on hand at cost of sale, i.e. what the shelves are worth. */
  inventoryValue: number;
};

export const kpis = (
  rows: Order[],
  customers: Customer[],
  carts: Cart[],
  products: AdminProduct[],
  days = 30,
): Kpis => {
  const current = within(rows, days);
  const before = previous(rows, days);

  const earning = current.filter(isRevenue);
  const revenue = earning.reduce((sum, order) => sum + order.total, 0);
  const beforeRevenue = before.filter(isRevenue).reduce((sum, order) => sum + order.total, 0);

  const cutoff = Date.now() - days * 86_400_000;

  const abandoned = carts.filter(isAbandoned);

  return {
    revenue,
    revenueDelta: delta(revenue, beforeRevenue),
    orders: current.length,
    ordersDelta: delta(current.length, before.length),
    average: earning.length ? revenue / earning.length : 0,
    openOrders: rows.filter(
      (order) => order.status === "pending" || order.status === "confirmed" || order.status === "packed",
    ).length,
    unpaid: rows
      .filter(
        (order) =>
          isRevenue(order) &&
          (order.payment.status === "unpaid" || order.payment.status === "pending"),
      )
      .reduce((sum, order) => sum + order.total, 0),
    newCustomers: customers.filter((customer) => new Date(customer.joinedAt).getTime() >= cutoff)
      .length,
    abandonedCarts: abandoned.length,
    abandonedValue: abandoned.reduce((sum, cart) => sum + cartValue(cart), 0),
    lowStock: products.filter(isLowStock).length,
    outOfStock: products.filter(isOutOfStock).length,
    inventoryValue: products.reduce((sum, product) => sum + product.stock * product.price, 0),
  };
};

/** How many orders sit at each status. Every status is present, so the bar list
 *  does not change shape as the shop empties. */
export const statusCounts = (rows: Order[]): Record<OrderStatus, number> => {
  const counts: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    packed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    refunded: 0,
  };
  for (const order of rows) counts[order.status] += 1;
  return counts;
};

export type SoldProduct = {
  slug: string;
  name: string;
  units: number;
  revenue: number;
};

/** Best sellers by money, not by units: twenty phone cases are not a better
 *  week than one MacBook, and a shop ordering stock needs to know which. */
export const topProducts = (rows: Order[], limit = 6): SoldProduct[] => {
  const totals = new Map<string, SoldProduct>();

  for (const order of rows) {
    if (!isRevenue(order)) continue;
    for (const item of order.items) {
      const held = totals.get(item.slug) ?? {
        slug: item.slug,
        name: item.name,
        units: 0,
        revenue: 0,
      };
      held.units += item.quantity;
      held.revenue += item.unitPrice * item.quantity;
      totals.set(item.slug, held);
    }
  }

  return [...totals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
};

export type MethodSplit = {
  method: PaymentMethod;
  orders: number;
  amount: number;
};

/** Which methods the money actually comes in through. Paid and refunded only —
 *  an unpaid cash-on-delivery order has not told us anything yet. */
export const methodSplit = (rows: Order[]): MethodSplit[] => {
  const totals = new Map<PaymentMethod, MethodSplit>();

  for (const order of rows) {
    if (order.payment.status !== "paid") continue;
    const held = totals.get(order.payment.method) ?? {
      method: order.payment.method,
      orders: 0,
      amount: 0,
    };
    held.orders += 1;
    held.amount += order.total;
    totals.set(order.payment.method, held);
  }

  return [...totals.values()].sort((a, b) => b.amount - a.amount);
};

/** Products at or below their reorder point, emptiest first. */
export const reorderList = (products: AdminProduct[], limit = 8): AdminProduct[] =>
  products
    .filter((product) => product.status !== "archived" && product.stock <= product.reorderAt)
    .sort((a, b) => a.stock - b.stock || b.price - a.price)
    .slice(0, limit);
