import type { OrderStatus } from "@/redux/features/order/order.types";
import type { Tone } from "./types";

export const ORDERS_HREF = "/account/orders";

export const ORDERS_PAGE_SIZE = 10;

// The backend's order flow, in order, plus cancelled.
export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: Tone; blurb: string }> = {
  pending: { label: "Pending", tone: "flow-1", blurb: "We've got your order and will confirm it shortly." },
  confirmed: { label: "Confirmed", tone: "flow-2", blurb: "Your order is confirmed." },
  processing: { label: "Processing", tone: "flow-3", blurb: "We're packing your order." },
  shipped: { label: "Shipped", tone: "flow-4", blurb: "Your order is on its way." },
  delivered: { label: "Delivered", tone: "good", blurb: "Your order has been delivered." },
  cancelled: { label: "Cancelled", tone: "critical", blurb: "This order was cancelled." },
};

// The backend lets customers cancel anything not yet delivered or cancelled.
export const canCancel = (status: OrderStatus) => status !== "delivered" && status !== "cancelled";

// Short, readable order number from the Mongo id.
export const orderNumber = (id: string) => `#${id.slice(-8).toUpperCase()}`;
