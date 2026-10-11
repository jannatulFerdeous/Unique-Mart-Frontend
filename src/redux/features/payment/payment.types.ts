// Mirror the backend enum in `payment.constant.ts`.
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "cancelled", "refunded", "partially_refunded"] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

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
  paymentMethod: "sslcommerz";
  paymentStatus: PaymentStatus;
  paidAt?: string;
};

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
export type PaymentRefunds = {
  orderId: string;
  paymentStatus: PaymentStatus;
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
