import type { ApiMeta } from "../../api/types";
import type { OrderStatus } from "../order/order.types";

// Mirror the backend enum in `payment.constant.ts`.
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "cancelled", "refunded", "partially_refunded"] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// Mirror the backend `PAYMENT_METHOD_VALUES`. `cod` is cash on delivery: its
// payment stays pending until the order is delivered.
export const PAYMENT_METHODS = ["sslcommerz", "cod"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// How the customer paid, as SSLCommerz reported it once the payment was
// verified. Missing on cash on delivery and on payments made before it was kept.
export type PaymentDetails = {
  cardType?: string; // e.g. "VISA-Dutch Bangla", "BKASH-BKash"
  cardBrand?: string; // e.g. "VISA", "MASTERCARD", "MOBILEBANKING", "IB"
  cardIssuer?: string;
  cardNumber?: string; // masked, e.g. "418117XXXXXX6675"
  cardIssuerCountry?: string;
  gatewayTranDate?: string;
};

// What GET /payments/orders/:orderId/status answers. Amounts are in BDT.
export type Payment = {
  orderId: string;
  amountBdt: number;
  transactionAmount: number;
  transactionCurrency: string;
  exchangeRate: number;
  capturedAmountBdt: number;
  refundedAmountBdt: number;
  pendingRefundAmountBdt: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string;
} & Pick<PaymentDetails, "cardType" | "cardBrand" | "cardIssuer" | "cardNumber">;

// One row of GET /payments (admins): the payment with its order and customer.
// Either ref is null if that order or account is gone.
export type StaffPayment = {
  _id: string;
  orderId: { _id: string; totalAmount: number; orderStatus: OrderStatus; createdAt: string } | string | null;
  userId: { _id: string; name: string; email?: string } | string | null;
  amount: number;
  capturedAmountBdt: number;
  refundedAmount: number;
  pendingRefundAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  sslcommerzTransactionId?: string;
  sslcommerzBankTransactionId?: string;
  createdAt: string;
  updatedAt: string;
} & PaymentDetails;

export type PaymentListParams = {
  page: number;
  limit: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
};

export type PaymentList = { items: StaffPayment[]; meta: ApiMeta };

// What POST /payments/create answers: the SSLCommerz page to send the shopper to.
export type PaymentSession = {
  paymentId: string;
  orderId: string;
  transactionId: string;
  amountBdt: number;
  transactionAmount: number;
  currency: string;
  exchangeRate: number;
  checkoutUrl: string;
};

// Mirrors the backend `createPaymentValidationSchema`. The shop charges in
// BDT, the backend's default, so no currency is sent.
export type CreatePaymentArgs = { orderId: string };

// Mirror the backend `REFUND_STATUS_VALUES`.
export const REFUND_STATUSES = ["pending", "processing", "refunded", "failed", "cancelled"] as const;

export type RefundStatus = (typeof REFUND_STATUSES)[number];

// One refund on a payment. `refundRefId` is SSLCommerz's reference; until it
// arrives the request may not have reached SSLCommerz and can be retried.
export type Refund = {
  refundTransId: string;
  refundRefId?: string;
  amount: number;
  status: RefundStatus;
  remarks: string;
  requestedBy: string;
  createdAt: string;
  completedAt?: string;
};

// What GET /payments/orders/:orderId/refunds answers (admins only).
export type PaymentRefunds = PaymentDetails & {
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  transactionId?: string;
  bankTransactionId?: string;
  amountBdt: number;
  capturedAmountBdt: number;
  refundedAmountBdt: number;
  pendingRefundAmountBdt: number;
  refunds: Refund[];
};

// Mirrors the backend `createRefundValidationSchema`; no amount refunds what's left.
export type CreateRefundArgs = { orderId: string; amount?: number; remarks: string };

export type RefundArgs = { orderId: string; refundTransId: string };

// Where SSLCommerz sends the shopper back to (the backend's PAYMENT_RESULT_URL).
export const PAYMENT_RESULTS = ["success", "failed", "cancelled"] as const;

export type PaymentResult = (typeof PAYMENT_RESULTS)[number];

// What /payment/result posts to the page that opened the SSLCommerz pop-up.
export const PAYMENT_MESSAGE = "unique-mart:payment-result";

export type PaymentMessage = { type: typeof PAYMENT_MESSAGE; orderId: string; result: PaymentResult | null };
