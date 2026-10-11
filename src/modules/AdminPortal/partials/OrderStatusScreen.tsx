"use client";

import { useState } from "react";
import Image from "next/image";
import { apiErrorMessage } from "@/redux/api/errors";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useUpdateOrderStatusMutation } from "@/redux/features/order/orderApi";
import type { Order, OrderStatus } from "@/redux/features/order/order.types";
import { useGetRefundsQuery } from "@/redux/features/payment/paymentApi";
import type { PaymentStatus } from "@/redux/features/payment/payment.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatDateTime, formatMoneyExact } from "@/shared/libs/admin/format";
import { productImage } from "@/shared/libs/storefront/catalog";
import { formatPrice } from "@/shared/utils/price";
import { Button, ButtonLink } from "../components/Button";
import { NoticeLine } from "../components/ListControls";
import { OrderLookup } from "../components/OrderLookup";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import {
  ADMIN_ORDERS_HREF,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  REFUNDS_HREF,
  STAFF_ORDER_STATUSES,
  findOrderId,
  orderNumber,
  statusBlockedBy,
} from "../config/orders";
import { blurbFor } from "./AdminSidebar";

// Moves that can't be taken back: the backend won't update a delivered or
// cancelled order again.
const FINAL: OrderStatus[] = ["delivered", "cancelled"];

export function OrderStatusScreen({ initialOrder }: { initialOrder?: string }) {
  const notice = useAppSelector(selectNotice("orders"));
  const [orderId, setOrderId] = useState(() => findOrderId(initialOrder ?? ""));

  return (
    <>
      <ScreenHeader title="Orders" blurb={blurbFor(ADMIN_ORDERS_HREF)} />
      <OrderLookup title="Find an order" href={ADMIN_ORDERS_HREF} initial={initialOrder} onFound={setOrderId} />
      <NoticeLine notice={notice} />
      {orderId && <ManageOrder key={orderId} orderId={orderId} />}
    </>
  );
}

function ManageOrder({ orderId }: { orderId: string }) {
  const dispatch = useAppDispatch();
  // Admins can read any order's payment, though not the order itself.
  const payment = useGetRefundsQuery(orderId);
  const [update, { isLoading }] = useUpdateOrderStatusMutation();
  // What the backend answered with after the last update.
  const [order, setOrder] = useState<Order | null>(null);
  const [next, setNext] = useState<OrderStatus | "">("");
  const [armed, setArmed] = useState(false);

  const noPayment = payment.isError && typeof payment.error === "object" && "status" in payment.error && payment.error.status === 404;
  if (payment.isLoading || (payment.isError && !noPayment)) {
    return (
      <Panel>
        {payment.isLoading ? (
          <EmptyState title="Loading the order…" />
        ) : (
          <EmptyState
            title="Couldn't load this order's payment"
            body={apiErrorMessage(payment.error)}
            action={<Button onClick={() => payment.refetch()}>Try again</Button>}
          />
        )}
      </Panel>
    );
  }

  const paymentStatus: PaymentStatus | null = payment.data?.paymentStatus ?? null;
  const paymentMeta = PAYMENT_STATUS_META[paymentStatus ?? "none"];
  const current = order?.orderStatus;
  const closed = current ? FINAL.includes(current) : false;
  const blocked = next ? statusBlockedBy(next, paymentStatus) : null;

  const choose = (value: OrderStatus | "") => {
    setNext(value);
    setArmed(false);
  };

  const save = async () => {
    if (!next) return;
    setArmed(false);
    try {
      const updated = await update({ id: orderId, orderStatus: next }).unwrap();
      setOrder(updated);
      setNext("");
      dispatch(
        showNotice({
          scope: "orders",
          tone: "good",
          text: `Order ${orderNumber(orderId)} is now ${ORDER_STATUS_META[updated.orderStatus].label.toLowerCase()}.`,
        }),
      );
    } catch (problem) {
      dispatch(showNotice({ scope: "orders", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex min-w-0 flex-col gap-5">
        <Panel
          title={`Order ${orderNumber(orderId)}`}
          description={orderId}
          actions={current && <StatusPill label={ORDER_STATUS_META[current].label} tone={ORDER_STATUS_META[current].tone} />}
        >
          {order ? (
            <OrderSummary order={order} />
          ) : (
            <p className="text-sm text-ink-muted">
              The backend doesn&apos;t let staff open another customer&apos;s order, so its items, address and current status
              show here once you&apos;ve updated it.
            </p>
          )}
        </Panel>

        <Panel
          title="Payment"
          actions={
            payment.data && (
              <ButtonLink href={`${REFUNDS_HREF}?order=${orderId}`} size="sm">
                Refunds
              </ButtonLink>
            )
          }
        >
          <StatusPill label={paymentMeta.label} tone={paymentMeta.tone} />
          {payment.data ? (
            <p className="mt-2 text-sm text-ink-muted tabular-nums">
              {formatMoneyExact(payment.data.amountBdt)} order total
              {payment.data.refundedAmountBdt > 0 && ` · ${formatMoneyExact(payment.data.refundedAmountBdt)} refunded`}
            </p>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">
              The customer hasn&apos;t started paying. If the ID is wrong, the update below will say the order wasn&apos;t found.
            </p>
          )}
        </Panel>
      </div>

      <Panel title="Change status">
        {closed && current ? (
          <p className="text-sm text-ink-muted">
            This order is {ORDER_STATUS_META[current].label.toLowerCase()}, so it can&apos;t change any more.
          </p>
        ) : (
          <fieldset className="flex min-w-0 flex-col gap-2" aria-busy={isLoading}>
            <legend className="mb-1.5 block text-sm font-medium text-ink">Move it to</legend>
            {STAFF_ORDER_STATUSES.map((status) => {
              const reason = status === current ? "It's already here." : statusBlockedBy(status, paymentStatus);
              return (
                <label
                  key={status}
                  className={reason ? "flex items-start gap-2 text-sm text-ink-subtle" : "flex items-start gap-2 text-sm text-ink"}
                >
                  <input
                    type="radio"
                    name="order-status"
                    checked={next === status}
                    disabled={Boolean(reason) || isLoading}
                    onChange={() => choose(status)}
                    className="mt-0.5 accent-tertiary"
                  />
                  <span>
                    {ORDER_STATUS_META[status].label}
                    {reason && <span className="block text-xs">{reason}</span>}
                  </span>
                </label>
              );
            })}

            <div className="mt-3">
              {armed && next ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-ink">
                    Mark it {ORDER_STATUS_META[next].label.toLowerCase()}? It can&apos;t be changed after that.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="danger" onClick={save} autoFocus>
                      Yes, mark it {ORDER_STATUS_META[next].label.toLowerCase()}
                    </Button>
                    <Button variant="ghost" onClick={() => setArmed(false)}>
                      Not yet
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={!next || Boolean(blocked) || isLoading}
                  onClick={() => (next && FINAL.includes(next) ? setArmed(true) : save())}
                >
                  {isLoading ? "Saving…" : next ? `Mark ${ORDER_STATUS_META[next].label.toLowerCase()}` : "Choose a status"}
                </Button>
              )}
            </div>
            {next === "confirmed" && (
              <p className="mt-1 text-xs text-ink-subtle">Confirming takes the items out of stock.</p>
            )}
          </fieldset>
        )}
      </Panel>
    </div>
  );
}

function OrderSummary({ order }: { order: Order }) {
  const { shippingAddress: to } = order;
  return (
    <div className="flex flex-col gap-4">
      <ul className="divide-y divide-line">
        {order.items.map((item) => (
          <li key={item._id} className="flex items-center gap-3 py-3 first:pt-0">
            <Image
              src={productImage(item.image)}
              alt=""
              sizes="48px"
              className="size-12 shrink-0 rounded-control object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{item.name}</p>
              <p className="text-xs text-ink-subtle">
                SKU {item.sku} · {item.quantity} × {formatPrice(item.price - item.discount)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-medium text-ink tabular-nums">{formatPrice(item.subtotal)}</p>
          </li>
        ))}
      </ul>
      <div className="grid gap-4 border-t border-line pt-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-ink-muted">Total</p>
          <p className="mt-0.5 font-bold text-ink tabular-nums">{formatPrice(order.totalAmount)}</p>
          <p className="mt-1 text-xs text-ink-subtle">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <address className="text-ink-muted not-italic">
          <span className="block font-medium text-ink">{to.fullName}</span>
          {to.address}, {to.city} {to.postalCode}, {to.country}
          <br />
          <a href={`tel:${to.phone}`} className="hover:text-tertiary hover:underline">
            {to.phone}
          </a>
        </address>
      </div>
    </div>
  );
}
