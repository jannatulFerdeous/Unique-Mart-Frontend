import type { AppDispatch } from "@/redux/store";
import { orderApi } from "@/redux/features/order/orderApi";
import { ORDER_STATUSES, type OrderStatus, type StaffOrder } from "@/redux/features/order/order.types";
import { paymentOrderId } from "@/redux/features/payment/paymentApi";
import type { StaffPayment } from "@/redux/features/payment/payment.types";
import { downloadSheet, fetchAllPages, fileDate, type SheetColumn, type SheetRow } from "@/shared/libs/admin/excel";
import type { Importer, PlannedRow } from "../../components/ExcelActions";
import { ORDER_STATUS_META, PAYMENT_STATUS_META, orderNumber, paymentMethodLabel, statusBlockedBy } from "../orders";
import { fetchAllPayments } from "./payments";

const PAGE = 100;

const fetchAllOrders = (dispatch: AppDispatch, orderStatus?: OrderStatus) =>
  fetchAllPages(
    async (page) =>
      (
        await dispatch(
          orderApi.endpoints.getStaffOrders.initiate({ page, limit: PAGE, orderStatus }, { subscribe: false, forceRefetch: true }),
        ).unwrap()
      ).items,
    PAGE,
  );

const customer = (order: StaffOrder) => (order.userId && typeof order.userId === "object" ? order.userId : null);

type OrderRow = { order: StaffOrder; payment?: StaffPayment };

const COLUMNS: SheetColumn<OrderRow>[] = [
  { header: "Order", width: 12, value: ({ order }) => orderNumber(order._id) },
  { header: "Order ID", width: 27, value: ({ order }) => order._id },
  { header: "Placed", width: 18, value: ({ order }) => new Date(order.createdAt).toLocaleString("en-GB") },
  { header: "Status", width: 13, value: ({ order }) => ORDER_STATUS_META[order.orderStatus].label },
  { header: "Customer", width: 22, value: ({ order }) => customer(order)?.name ?? order.shippingAddress.fullName },
  { header: "Email", width: 28, value: ({ order }) => customer(order)?.email ?? "" },
  { header: "Phone", width: 15, value: ({ order }) => order.shippingAddress.phone },
  { header: "Address", width: 34, value: ({ order }) => order.shippingAddress.address },
  { header: "City / district", width: 16, value: ({ order }) => order.shippingAddress.city },
  { header: "Postal code", width: 12, value: ({ order }) => order.shippingAddress.postalCode },
  { header: "Country", width: 13, value: ({ order }) => order.shippingAddress.country },
  { header: "Items", width: 44, value: ({ order }) => order.items.map((item) => `${item.name} × ${item.quantity}`).join("; ") },
  { header: "Item count", width: 11, value: ({ order }) => order.items.reduce((sum, item) => sum + item.quantity, 0) },
  { header: "Subtotal (Tk)", width: 13, value: ({ order }) => order.subtotal },
  { header: "Delivery (Tk)", width: 13, value: ({ order }) => order.deliveryCharge },
  { header: "Total (Tk)", width: 12, value: ({ order }) => order.totalAmount },
  { header: "Payment method", width: 30, value: ({ payment }) => (payment ? paymentMethodLabel(payment.paymentMethod, payment) : "Not started") },
  {
    header: "Payment status",
    width: 18,
    value: ({ payment }) =>
      !payment ? "" : payment.paymentMethod === "cod" && payment.paymentStatus === "pending" ? "Pay on delivery" : PAYMENT_STATUS_META[payment.paymentStatus].label,
  },
];

// Every order with the chosen status (or all), with its payment.
export async function downloadOrders(dispatch: AppDispatch, orderStatus?: OrderStatus) {
  const [orders, payments] = await Promise.all([fetchAllOrders(dispatch, orderStatus), fetchAllPayments(dispatch)]);
  const byOrder = new Map(payments.map((payment) => [paymentOrderId(payment), payment]));
  await downloadSheet(
    `orders-${fileDate()}.xlsx`,
    "Orders",
    COLUMNS,
    orders.map((order) => ({ order, payment: byOrder.get(order._id) })),
  );
}

// "Shipped", "shipped" or "SHIPPED" → "shipped".
const toStatus = (text: string): OrderStatus | null =>
  ORDER_STATUSES.find((status) => status === text.toLowerCase() || ORDER_STATUS_META[status].label.toLowerCase() === text.toLowerCase()) ??
  null;

const FINAL: OrderStatus[] = ["delivered", "cancelled"];

// Upload: an order (its ID, or its #number) and the status to move it to.
export const orderImporter = (dispatch: AppDispatch): Importer => ({
  noun: "order statuses",
  help:
    "Change many orders' status at once. Each row needs “Order ID” (or “Order”, the #number) and “Status”: Confirmed, Processing, Shipped, Delivered or Cancelled. Tip: download the orders, change the Status column, and upload the same file.",
  template: () =>
    downloadSheet(`order-status-template.xlsx`, "Orders", [
      { header: "Order ID", width: 27, value: () => "6ace73bdc1f52f14ef043d96" },
      { header: "Status", width: 13, value: () => "Shipped" },
    ], [null]),
  plan: async (rows: SheetRow[]) => {
    const [orders, payments] = await Promise.all([fetchAllOrders(dispatch), fetchAllPayments(dispatch)]);
    const byId = new Map(orders.map((order) => [order._id.toLowerCase(), order]));
    const byNumber = new Map(orders.map((order) => [orderNumber(order._id), order]));
    const paymentOf = new Map(payments.map((payment) => [paymentOrderId(payment), payment]));

    return rows.map(({ row, cells }): PlannedRow => {
      const idText = (cells["Order ID"] ?? "").toLowerCase();
      const numberText = (cells["Order"] ?? "").toUpperCase().replace(/^#?/, "#");
      const order = byId.get(idText) ?? (numberText.length > 1 ? byNumber.get(numberText) : undefined);
      const label = order ? orderNumber(order._id) : cells["Order ID"] || cells["Order"] || "(no order)";
      if (!order) return { row, label, action: "skip", error: "No order with that ID or number." };

      const next = toStatus(cells["Status"] ?? "");
      if (!next) return { row, label, action: "skip", error: `“${cells["Status"] || "(empty)"}” isn't a status.` };
      if (next === order.orderStatus) return { row, label, action: "skip", detail: `Already ${ORDER_STATUS_META[next].label.toLowerCase()}` };
      if (FINAL.includes(order.orderStatus)) {
        return { row, label, action: "skip", error: `It's ${ORDER_STATUS_META[order.orderStatus].label.toLowerCase()} and can't change any more.` };
      }
      const payment = paymentOf.get(order._id);
      const blocked = statusBlockedBy(next, payment?.paymentStatus ?? null, payment?.paymentMethod ?? null);
      if (blocked) return { row, label, action: "skip", error: blocked };

      return {
        row,
        label,
        action: "update",
        detail: `${ORDER_STATUS_META[order.orderStatus].label} → ${ORDER_STATUS_META[next].label}`,
        apply: () => dispatch(orderApi.endpoints.updateOrderStatus.initiate({ id: order._id, orderStatus: next })).unwrap(),
      };
    });
  },
});
