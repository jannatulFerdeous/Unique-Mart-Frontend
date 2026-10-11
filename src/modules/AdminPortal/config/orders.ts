import type { OrderStatus } from "@/redux/features/order/order.types";
import type {
  PaymentRefunds,
  PaymentResult,
  PaymentStatus,
  RefundStatus,
} from "@/redux/features/payment/payment.types";
import type { Tone } from "./types";

export const ORDERS_HREF = "/account/orders";

export const ORDERS_PAGE_SIZE = 10;

// The backend's order flow, in order, plus cancelled.
export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: Tone; blurb: string }> = {
  pending: { label: "Pending", tone: "flow-1", blurb: "We'll confirm your order once it's paid." },
  confirmed: { label: "Confirmed", tone: "flow-2", blurb: "Your order is confirmed." },
  processing: { label: "Processing", tone: "flow-3", blurb: "We're packing your order." },
  shipped: { label: "Shipped", tone: "flow-4", blurb: "Your order is on its way." },
  delivered: { label: "Delivered", tone: "good", blurb: "Your order has been delivered." },
  cancelled: { label: "Cancelled", tone: "critical", blurb: "This order was cancelled." },
};

// `none` is an order nobody has started paying for yet.
export const PAYMENT_STATUS_META: Record<PaymentStatus | "none", { label: string; tone: Tone }> = {
  none: { label: "Not paid", tone: "warning" },
  pending: { label: "Payment in progress", tone: "flow-1" },
  paid: { label: "Paid", tone: "good" },
  failed: { label: "Payment failed", tone: "critical" },
  cancelled: { label: "Payment cancelled", tone: "serious" },
  refunded: { label: "Refunded", tone: "neutral" },
  partially_refunded: { label: "Partly refunded", tone: "neutral" },
};

export const ADMIN_ORDERS_HREF = "/admin/orders";

// What staff can move an order to; it starts out pending.
export const STAFF_ORDER_STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"] as const satisfies readonly OrderStatus[];

// Why the backend would refuse this move given the payment, or null if it
// wouldn't. `payment` is null when the customer never started paying.
export const statusBlockedBy = (next: OrderStatus, payment: PaymentStatus | null): string | null => {
  if (next === "confirmed" && payment !== "paid") return "Only paid orders can be confirmed.";
  if (next === "cancelled" && payment === "pending") return "A payment is in progress. Wait for its result.";
  if (next === "cancelled" && (payment === "paid" || payment === "partially_refunded")) return "Refund the payment in full first.";
  return null;
};

export const REFUNDS_HREF = "/admin/refunds";

export const REFUND_STATUS_META: Record<RefundStatus, { label: string; tone: Tone }> = {
  pending: { label: "Not sent yet", tone: "warning" },
  processing: { label: "With SSLCommerz", tone: "flow-2" },
  refunded: { label: "Refunded", tone: "good" },
  failed: { label: "Rejected", tone: "critical" },
  cancelled: { label: "Cancelled", tone: "serious" },
};

// The backend refunds only paid payments, and only up to what's left once
// completed and in-flight refunds are taken off.
export const refundable = (payment: PaymentRefunds) =>
  ["paid", "partially_refunded"].includes(payment.paymentStatus)
    ? Math.max(
        0,
        Math.round(
          (payment.capturedAmountBdt -
            payment.refundedAmountBdt -
            payment.refunds
              .filter((refund) => refund.status === "pending" || refund.status === "processing")
              .reduce((total, refund) => total + refund.amount, 0)) *
            100,
        ) / 100,
      )
    : 0;

// Pulls an order id out of whatever was pasted: the id, an order page URL, or
// SSLCommerz's value_a field.
export const findOrderId = (text: string) => text.match(/[a-f\d]{24}/i)?.[0].toLowerCase() ?? null;

// How often an order page re-checks a payment SSLCommerz hasn't settled yet.
export const PAYMENT_POLL_MS = 10_000;

// What SSLCommerz sent the shopper back with.
export const PAYMENT_RESULT_NOTICE: Record<PaymentResult, { tone: "good" | "danger"; text: string }> = {
  success: { tone: "good", text: "Payment received. Thank you! We'll confirm your order shortly." },
  failed: { tone: "danger", text: "Your payment didn't go through. You can try again below." },
  cancelled: { tone: "danger", text: "You cancelled the payment. Pay below whenever you're ready." },
};

// The backend starts a payment only for a pending order with no payment, or
// one whose last attempt failed or was cancelled.
export const canPay = (status: OrderStatus, payment: PaymentStatus | null) =>
  status === "pending" && (payment === null || payment === "failed" || payment === "cancelled");

// The backend won't cancel a shipped, delivered or cancelled order, nor one
// that's being paid for or has been paid (that needs a refund first).
export const canCancel = (status: OrderStatus, payment: PaymentStatus | null) =>
  !["shipped", "delivered", "cancelled"].includes(status) &&
  !(payment === "pending" || payment === "paid" || payment === "partially_refunded");

// Short, readable order number from the Mongo id.
export const orderNumber = (id: string) => `#${id.slice(-8).toUpperCase()}`;
