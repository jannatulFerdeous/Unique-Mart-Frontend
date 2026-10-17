import type { AppDispatch } from "@/redux/store";
import { paymentApi, paymentOrderId } from "@/redux/features/payment/paymentApi";
import type { PaymentListParams, StaffPayment } from "@/redux/features/payment/payment.types";
import { downloadSheet, fetchAllPages, fileDate, type SheetColumn } from "@/shared/libs/admin/excel";
import { PAYMENT_STATUS_META, orderNumber, paymentMethodLabel } from "../orders";

const PAGE = 100;

export const fetchAllPayments = (dispatch: AppDispatch, filters: Omit<PaymentListParams, "page" | "limit"> = {}) =>
  fetchAllPages(
    async (page) =>
      (
        await dispatch(
          paymentApi.endpoints.getPayments.initiate({ ...filters, page, limit: PAGE }, { subscribe: false, forceRefetch: true }),
        ).unwrap()
      ).items,
    PAGE,
  );

const customer = (payment: StaffPayment) =>
  payment.userId && typeof payment.userId === "object" ? payment.userId : null;

const COLUMNS: SheetColumn<StaffPayment>[] = [
  { header: "Order", width: 12, value: (each) => (paymentOrderId(each) ? orderNumber(paymentOrderId(each)) : "") },
  { header: "Order ID", width: 27, value: (each) => paymentOrderId(each) },
  { header: "Customer", width: 22, value: (each) => customer(each)?.name ?? "" },
  { header: "Email", width: 28, value: (each) => customer(each)?.email ?? "" },
  { header: "Method", width: 34, value: (each) => paymentMethodLabel(each.paymentMethod, each) },
  { header: "Amount (Tk)", width: 13, value: (each) => each.amount },
  { header: "Refunded (Tk)", width: 14, value: (each) => each.refundedAmount },
  { header: "Status", width: 18, value: (each) => (each.paymentMethod === "cod" && each.paymentStatus === "pending" ? "Pay on delivery" : PAYMENT_STATUS_META[each.paymentStatus].label) },
  { header: "Paid on", width: 18, value: (each) => (each.paidAt ? new Date(each.paidAt).toLocaleString("en-GB") : "") },
  { header: "Started", width: 18, value: (each) => new Date(each.createdAt).toLocaleString("en-GB") },
  { header: "Card / account", width: 20, value: (each) => each.cardNumber },
  { header: "Card type", width: 22, value: (each) => each.cardType },
  { header: "Issuer", width: 24, value: (each) => each.cardIssuer },
  { header: "Country", width: 14, value: (each) => each.cardIssuerCountry },
  { header: "Transaction ID", width: 26, value: (each) => each.sslcommerzTransactionId },
  { header: "Bank transaction ID", width: 22, value: (each) => each.sslcommerzBankTransactionId },
];

// Every payment the filters match, one row each.
export async function downloadPayments(dispatch: AppDispatch, filters: Omit<PaymentListParams, "page" | "limit">) {
  const payments = await fetchAllPayments(dispatch, filters);
  await downloadSheet(`payments-${fileDate()}.xlsx`, "Payments", COLUMNS, payments);
}
