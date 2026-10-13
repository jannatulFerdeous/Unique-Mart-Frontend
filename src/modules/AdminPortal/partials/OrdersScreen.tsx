"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, CircleCheck } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useCancelOrderMutation, useGetMyOrderQuery, useGetMyOrdersQuery } from "@/redux/features/order/orderApi";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/redux/features/order/order.types";
import { useCreatePaymentMutation, useGetOrderPaymentQuery } from "@/redux/features/payment/paymentApi";
import type { PaymentResult } from "@/redux/features/payment/payment.types";
import { formatDate, formatDateTime } from "@/shared/libs/admin/format";
import { productImage } from "@/shared/libs/storefront/catalog";
import { cn } from "@/shared/utils/cn";
import { goToPayment, openPaymentWindow, usePaymentPopup } from "@/shared/libs/paymentPopup";
import { formatPrice } from "@/shared/utils/price";
import { Button, ButtonLink } from "../components/Button";
import { ConfirmAction } from "../components/ConfirmAction";
import { FilterSelect } from "../components/Field";
import { NoticeLine } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { Table, TableScroll, Td, TdNum, Th, ThNum, Tr } from "../components/Table";
import {
  ORDERS_HREF,
  ORDERS_PAGE_SIZE,
  ORDER_STATUS_META,
  PAYMENT_METHOD_NAME,
  PAYMENT_POLL_MS,
  PAYMENT_RESULT_NOTICE,
  canCancel,
  canPay,
  orderBlurbFor,
  orderNumber,
  paymentChannel,
  paymentMetaFor,
} from "../config/orders";
import { blurbFor } from "./AdminSidebar";

const itemCount = (order: Order) => order.items.reduce((sum, item) => sum + item.quantity, 0);

// ---------------------------------------------------------------------------
// My Orders

export function OrdersScreen() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const { data, isLoading, isFetching, isError, error, refetch } = useGetMyOrdersQuery({
    page,
    limit: ORDERS_PAGE_SIZE,
    orderStatus: status || undefined,
  });

  const orders = data?.items ?? [];
  // The backend's total is capped at the page size, so a full page may mean more.
  const hasNext = orders.length === ORDERS_PAGE_SIZE;

  return (
    <>
      <ScreenHeader
        title="My Orders"
        blurb={blurbFor(ORDERS_HREF)}
        actions={
          <FilterSelect
            label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as OrderStatus | "");
              setPage(1);
            }}
          >
            <option value="">All orders</option>
            {ORDER_STATUSES.map((value) => (
              <option key={value} value={value}>
                {ORDER_STATUS_META[value].label}
              </option>
            ))}
          </FilterSelect>
        }
      />

      <Panel bodyClassName="py-0 md:py-0">
        {isLoading ? (
          <EmptyState title="Loading your orders…" />
        ) : isError ? (
          <EmptyState
            title="Couldn't load your orders"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : orders.length === 0 ? (
          page > 1 ? (
            <EmptyState title="No more orders" action={<Button onClick={() => setPage(1)}>Back to page 1</Button>} />
          ) : (
            <EmptyState
              title={status ? "No orders with that status" : "You haven't ordered anything yet"}
              body={status ? undefined : "When you place an order, you can follow it here."}
              action={status ? undefined : <ButtonLink href="/" variant="primary">Start shopping</ButtonLink>}
            />
          )
        ) : (
          <>
            <TableScroll>
              <Table className={cn("transition-opacity", isFetching && "opacity-60")}>
                <caption className="sr-only">My orders</caption>
                <thead>
                  <tr>
                    <Th>Order</Th>
                    <Th>Placed</Th>
                    <ThNum>Items</ThNum>
                    <ThNum>Total</ThNum>
                    <Th>Status</Th>
                    <Th>
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const meta = ORDER_STATUS_META[order.orderStatus];
                    return (
                      <Tr key={order._id}>
                        <Td className="font-medium text-ink">{orderNumber(order._id)}</Td>
                        <Td className="whitespace-nowrap text-ink-muted">
                          <time dateTime={order.createdAt} title={formatDateTime(order.createdAt)}>
                            {formatDate(order.createdAt)}
                          </time>
                        </Td>
                        <TdNum>{itemCount(order)}</TdNum>
                        <TdNum className="font-medium text-ink">{formatPrice(order.totalAmount)}</TdNum>
                        <Td>
                          <StatusPill label={meta.label} tone={meta.tone} />
                        </Td>
                        <Td className="text-right">
                          <ButtonLink href={`${ORDERS_HREF}/${order._id}`} size="sm">
                            View
                            <span className="sr-only"> order {orderNumber(order._id)}</span>
                          </ButtonLink>
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableScroll>

            <nav
              aria-label="Pages"
              className="-mx-4 flex flex-wrap items-center justify-end gap-2 px-4 py-3 text-sm md:-mx-5 md:px-5"
            >
              <Button size="sm" disabled={page === 1 || isFetching} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="size-4" aria-hidden />
                Previous
              </Button>
              <span className="px-1 text-ink-muted tabular-nums">Page {page}</span>
              <Button size="sm" disabled={!hasNext || isFetching} onClick={() => setPage(page + 1)}>
                Next
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </nav>
          </>
        )}
      </Panel>
    </>
  );
}

// ---------------------------------------------------------------------------
// One order

// `placed` is set straight after checkout; `paid` is what SSLCommerz sent the
// shopper back with.
export function OrderDetailScreen({ id, placed, paid }: { id: string; placed?: boolean; paid?: PaymentResult }) {
  const { data: order, isLoading, isError, error, refetch } = useGetMyOrderQuery(id);
  const payment = useGetOrderPaymentQuery(id);
  const method = payment.data?.paymentMethod ?? null;
  // While SSLCommerz hasn't reported back, keep asking; a second subscription
  // to the same entry polls only while it's pending. Cash on delivery stays
  // pending until delivery, so there's nothing to ask.
  const awaiting = payment.data?.paymentStatus === "pending" && method !== "cod";
  useGetOrderPaymentQuery(id, { skip: !awaiting, pollingInterval: PAYMENT_POLL_MS, skipPollingIfUnfocused: true });
  const [cancel, { isLoading: cancelling }] = useCancelOrderMutation();
  const [createPayment, { isLoading: starting }] = useCreatePaymentMutation();
  const [leaving, setLeaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "good" | "danger"; text: string } | null>(
    paid ? PAYMENT_RESULT_NOTICE[paid] : null,
  );
  const popup = usePaymentPopup((_orderId, result) => setFeedback(PAYMENT_RESULT_NOTICE[result]));

  const back = (
    <ButtonLink href={ORDERS_HREF} variant="ghost" size="sm">
      <ArrowLeft className="size-4" aria-hidden />
      All orders
    </ButtonLink>
  );

  if (isLoading || payment.isLoading || isError || !order) {
    return (
      <>
        <ScreenHeader title="Order" actions={back} />
        <Panel>
          {isLoading || payment.isLoading ? (
            <EmptyState title="Loading your order…" />
          ) : (
            <EmptyState
              title="Couldn't load this order"
              body={apiErrorMessage(error)}
              action={<Button onClick={() => refetch()}>Try again</Button>}
            />
          )}
        </Panel>
      </>
    );
  }

  const meta = ORDER_STATUS_META[order.orderStatus];
  const { shippingAddress: to } = order;
  // If the payment status can't be read, assume it's unpaid; the backend refuses anything it shouldn't allow.
  const paymentStatus = payment.data?.paymentStatus ?? null;
  const paymentMeta = paymentMetaFor(paymentStatus, method);
  const cod = method === "cod";
  // The pop-up from this page is still open.
  const paying = Boolean(popup.orderId) && !popup.closed;

  const pay = async () => {
    setFeedback(null);
    // Opened now, during the click, or the browser blocks it.
    const opened = openPaymentWindow();
    try {
      const { checkoutUrl } = await createPayment({ orderId: order._id }).unwrap();
      // A blocked pop-up sends this whole tab to SSLCommerz instead.
      goToPayment(opened, checkoutUrl);
      if (opened) popup.start(order._id, opened);
      else setLeaving(true);
    } catch (problem) {
      opened?.close();
      setFeedback({ tone: "danger", text: apiErrorMessage(problem, "Couldn't start the payment. Please try again.") });
    }
  };

  const cancelOrder = async () => {
    try {
      await cancel(order._id).unwrap();
      setFeedback({ tone: "good", text: "Your order is cancelled." });
    } catch (problem) {
      setFeedback({ tone: "danger", text: apiErrorMessage(problem) });
    }
  };

  return (
    <>
      <ScreenHeader
        title={`Order ${orderNumber(order._id)}`}
        blurb={`Placed ${formatDateTime(order.createdAt)}`}
        actions={back}
      />

      {placed && !feedback && (
        <p role="status" className="flex items-center gap-2 rounded-control bg-good-soft px-4 py-3 text-sm font-medium text-ink">
          <CircleCheck className="size-5 shrink-0 text-good" aria-hidden />
          {cod
            ? "Thank you! Your order is placed. Pay in cash when it arrives."
            : "Thank you! Your order is placed. Pay for it below and we'll confirm it."}
        </p>
      )}
      <NoticeLine notice={feedback && { scope: "account", ...feedback }} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Panel title="Items" bodyClassName="py-0 md:py-0">
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item._id} className="flex items-center gap-4 py-4">
                <Image
                  src={productImage(item.image)}
                  alt=""
                  sizes="56px"
                  className="size-14 shrink-0 rounded-control object-contain"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink-subtle">SKU {item.sku}</p>
                  <p className="mt-0.5 text-sm text-ink-muted tabular-nums">
                    {formatPrice(item.price - item.discount)} × {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 font-medium text-ink tabular-nums">{formatPrice(item.subtotal)}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="flex flex-col gap-5">
          <Panel title="Status">
            <StatusPill label={meta.label} tone={meta.tone} />
            <p className="mt-2 text-sm text-ink-muted">{orderBlurbFor(order.orderStatus, method)}</p>
            {canCancel(order.orderStatus, paymentStatus, method) && (
              <div className="mt-4" aria-busy={cancelling}>
                <ConfirmAction label="Cancel order" confirmLabel="Yes, cancel it" cancelLabel="Keep it" onConfirm={cancelOrder} />
              </div>
            )}
          </Panel>

          <Panel title="Payment">
            <StatusPill label={paymentMeta.label} tone={paymentMeta.tone} />
            {payment.data?.paidAt && (
              <p className="mt-2 text-sm text-ink-muted">Paid {formatDateTime(payment.data.paidAt)}</p>
            )}
            {payment.data && payment.data.refundedAmountBdt > 0 && (
              <p className="mt-2 text-sm text-ink-muted">{formatPrice(payment.data.refundedAmountBdt)} refunded</p>
            )}
            {paymentStatus === "pending" && !cod && (
              <p className="mt-2 text-sm text-ink-muted">
                {paying
                  ? "Finish paying in the SSLCommerz window."
                  : "We haven't heard from SSLCommerz yet. If you didn't finish paying, you can try again."}
              </p>
            )}
            {cod && paymentStatus === "pending" && (
              <p className="mt-2 text-sm text-ink-muted">
                Have {formatPrice(order.totalAmount)} ready in cash when your order arrives.
              </p>
            )}
            {paying && (
              <Button className="mt-4 w-full" onClick={popup.focus}>
                Show the payment window
              </Button>
            )}
            {!paying && canPay(order.orderStatus, paymentStatus, method) && (
              <Button variant="primary" className="mt-4 w-full" onClick={pay} disabled={starting || leaving}>
                {starting || leaving
                  ? "Opening SSLCommerz…"
                  : paymentStatus === "pending"
                    ? `Try paying ${formatPrice(order.totalAmount)} again`
                    : `Pay ${formatPrice(order.totalAmount)} now`}
              </Button>
            )}
            <p className="mt-3 text-xs text-ink-subtle">
              {(payment.data && paymentChannel(payment.data)?.customer) ?? PAYMENT_METHOD_NAME[method ?? "sslcommerz"]}
            </p>
          </Panel>

          <Panel title="Summary">
            <dl className="space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal)} />
              {order.discount > 0 && (
                <Row
                  label={order.couponCode ? `Coupon ${order.couponCode}` : "Discount"}
                  value={`−${formatPrice(order.discount)}`}
                />
              )}
              <Row label="Delivery" value={order.deliveryCharge > 0 ? formatPrice(order.deliveryCharge) : "Free"} />
              <div className="flex justify-between gap-4 border-t border-line pt-2 font-bold text-ink">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(order.totalAmount)}</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Delivering to">
            <address className="text-sm text-ink-muted not-italic">
              <span className="block font-medium text-ink">{to.fullName}</span>
              {to.address}
              <br />
              {to.city} {to.postalCode}, {to.country}
              <br />
              {to.phone}
            </address>
          </Panel>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-ink tabular-nums">{value}</dd>
    </div>
  );
}
