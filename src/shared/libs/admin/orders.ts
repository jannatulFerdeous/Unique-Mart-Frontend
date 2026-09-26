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


const SHIPPING_FLAT = 120;
const FREE_SHIPPING_FROM = 50_000;

export const ORDER_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
];

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

export const subtotalOf = (items: OrderItem[]): number =>
  items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

export const shippingFor = (subtotal: number): number =>
  subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;

const COUNT = 164;
const HISTORY_DAYS = 120;

const seed = (): Order[] => {
  const random = rng(480_915);
  const pool = allProducts;

  const rows = Array.from({ length: COUNT }, (_, index) => {
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
        quantity: product.price < 10_000 && random() < 0.4 ? 2 : 1,
      });
    }

    const subtotal = subtotalOf(items);
    const shipping = shippingFor(subtotal);
    const discount = random() < 0.2 ? Math.min(2000, Math.round((subtotal * 0.05) / 100) * 100) : 0;

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

  return rows.sort((a, b) => b.placedAt.localeCompare(a.placedAt));
};



export const orders = createStore(seed);

export const useOrders = (): Order[] => orders.use();

export const findOrder = (id: string): Order | undefined =>
  orders.read().find((order) => order.id === id);

const patch = (id: string, change: (order: Order) => Order) => {
  orders.update((current) =>
    current.map((order) => (order.id === id ? change(order) : order)),
  );
};

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

export const isRevenue = (order: Order): boolean =>
  order.status !== "cancelled" && order.status !== "refunded";

export const revenueOf = (rows: Order[]): number =>
  rows.filter(isRevenue).reduce((sum, order) => sum + order.total, 0);

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

export const ordersFor = (rows: Order[], customerId: string): Order[] =>
  rows.filter((order) => order.customerId === customerId);
