import type { OrderStatus } from "@/redux/features/order/order.types";
import type {
  PaymentDetails,
  PaymentMethod,
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

export const PAYMENT_METHOD_NAME: Record<PaymentMethod, string> = {
  sslcommerz: "Paid online with SSLCommerz",
  cod: "Cash on delivery",
};

// How an SSLCommerz payment was made, from what SSLCommerz reported once it
// was verified. Null when it hasn't said (unpaid, or paid before it was kept).
// card_type is "<network or wallet>-<bank or provider>", e.g. "VISA-Dutch
// Bangla" or "BKASH-BKash"; card_brand is the kind: a card network,
// "MOBILEBANKING" or "IB" (internet banking).
export const paymentChannel = (details: PaymentDetails) => {
  const brand = details.cardBrand?.trim().toUpperCase() ?? "";
  const type = details.cardType?.trim() ?? "";
  if (!brand && !type) return null;

  const dash = type.indexOf("-");
  const typeName = dash === -1 ? type : type.slice(0, dash).trim();
  const typeProvider = dash === -1 ? "" : type.slice(dash + 1).trim();
  const provider = typeProvider || details.cardIssuer || typeName;
  const last4 = details.cardNumber?.match(/(\d{4})$/)?.[1];
  const ending = last4 ? ` ····${last4}` : "";

  if (brand === "MOBILEBANKING") {
    return { kind: "Mobile banking", label: `Mobile banking · ${provider}`, customer: `Paid with ${provider}` };
  }
  if (brand === "IB" || brand === "INTERNETBANKING") {
    return { kind: "Internet banking", label: `Internet banking · ${provider}`, customer: `Paid by internet banking (${provider})` };
  }
  const network = brand || typeName;
  const bank = details.cardIssuer || typeProvider;
  return {
    kind: "Card",
    label: `Card · ${network}${ending}${bank ? ` (${bank})` : ""}`,
    customer: `Paid by ${network} card${ending}`,
  };
};

// One line for how a payment is (or will be) made.
export const paymentMethodLabel = (method: PaymentMethod, details: PaymentDetails) =>
  method === "cod" ? "Cash on delivery" : (paymentChannel(details)?.label ?? "SSLCommerz");

// A cash-on-delivery payment is pending until the order is delivered, which
// isn't "in progress" the way an SSLCommerz payment is.
export const paymentMetaFor = (status: PaymentStatus | null, method: PaymentMethod | null) =>
  method === "cod" && status === "pending"
    ? { label: "Pay on delivery", tone: "warning" as Tone }
    : PAYMENT_STATUS_META[status ?? "none"];

// What a pending order is waiting for.
export const orderBlurbFor = (status: OrderStatus, method: PaymentMethod | null) =>
  status === "pending" && method === "cod"
    ? "We'll confirm your order soon. Pay in cash when it arrives."
    : ORDER_STATUS_META[status].blurb;

export const ADMIN_ORDERS_HREF = "/admin/orders";

// What staff can move an order to; it starts out pending.
export const STAFF_ORDER_STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"] as const satisfies readonly OrderStatus[];

// Why the backend would refuse this move given the payment, or null if it
// wouldn't. `payment` is null when the customer never started paying. Cash on
// delivery orders can be confirmed or cancelled while their payment is pending.
export const statusBlockedBy = (
  next: OrderStatus,
  payment: PaymentStatus | null,
  method: PaymentMethod | null,
): string | null => {
  const cod = method === "cod";
  if (next === "confirmed" && payment !== "paid" && !cod) return "Only paid orders can be confirmed.";
  if (next === "cancelled" && payment === "pending" && !cod) return "A payment is in progress. Wait for its result.";
  if (next === "cancelled" && (payment === "paid" || payment === "partially_refunded")) return "Refund the payment in full first.";
  return null;
};

export const REFUNDS_HREF = "/admin/refunds";

export const PAYMENTS_HREF = "/admin/payments";

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

// The backend starts a payment for a pending order that isn't paid. A pending
// payment may be one the shopper left (reloaded or closed SSLCommerz): the
// backend asks SSLCommerz about it first and records it if it was paid. Never
// for cash on delivery.
export const canPay = (status: OrderStatus, payment: PaymentStatus | null, method: PaymentMethod | null) =>
  method !== "cod" &&
  status === "pending" &&
  (payment === null || payment === "pending" || payment === "failed" || payment === "cancelled");

// The backend won't cancel a shipped, delivered or cancelled order, nor one
// that's being paid for or has been paid (that needs a refund first). A cash
// on delivery payment is pending until delivery, so it doesn't block.
export const canCancel = (status: OrderStatus, payment: PaymentStatus | null, method: PaymentMethod | null) =>
  !["shipped", "delivered", "cancelled"].includes(status) &&
  !((payment === "pending" && method !== "cod") || payment === "paid" || payment === "partially_refunded");

// Short, readable order number from the Mongo id.
export const orderNumber = (id: string) => `#${id.slice(-8).toUpperCase()}`;
