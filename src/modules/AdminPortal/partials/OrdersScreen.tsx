"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, CircleCheck } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useCancelOrderMutation, useGetMyOrderQuery, useGetMyOrdersQuery } from "@/redux/features/order/orderApi";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/redux/features/order/order.types";
import { formatDate, formatDateTime } from "@/shared/libs/admin/format";
import { productImage } from "@/shared/libs/storefront/catalog";
import { cn } from "@/shared/utils/cn";
import { formatPrice } from "@/shared/utils/price";
import { Button, ButtonLink } from "../components/Button";
import { ConfirmAction } from "../components/ConfirmAction";
import { FilterSelect } from "../components/Field";
import { NoticeLine } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { Table, TableScroll, Td, TdNum, Th, ThNum, Tr } from "../components/Table";
import { ORDERS_HREF, ORDERS_PAGE_SIZE, ORDER_STATUS_META, canCancel, orderNumber } from "../config/orders";
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

export function OrderDetailScreen({ id, placed }: { id: string; placed?: boolean }) {
  const { data: order, isLoading, isError, error, refetch } = useGetMyOrderQuery(id);
  const [cancel, { isLoading: cancelling }] = useCancelOrderMutation();
  const [feedback, setFeedback] = useState<{ tone: "good" | "danger"; text: string } | null>(null);

  const back = (
    <ButtonLink href={ORDERS_HREF} variant="ghost" size="sm">
      <ArrowLeft className="size-4" aria-hidden />
      All orders
    </ButtonLink>
  );

  if (isLoading || isError || !order) {
    return (
      <>
        <ScreenHeader title="Order" actions={back} />
        <Panel>
          {isLoading ? (
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
          Thank you! Your order is placed. You&apos;ll pay in cash when it arrives.
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
            <p className="mt-2 text-sm text-ink-muted">{meta.blurb}</p>
            {canCancel(order.orderStatus) && (
              <div className="mt-4" aria-busy={cancelling}>
                <ConfirmAction label="Cancel order" confirmLabel="Yes, cancel it" cancelLabel="Keep it" onConfirm={cancelOrder} />
              </div>
            )}
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
            <p className="mt-3 text-xs text-ink-subtle">Cash on delivery</p>
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
