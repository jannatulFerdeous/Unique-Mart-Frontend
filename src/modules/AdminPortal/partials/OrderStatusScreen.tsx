"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import {
  useGetStaffOrderQuery,
  useGetStaffOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/order/orderApi";
import { ORDER_STATUSES, type OrderStatus, type StaffOrder } from "@/redux/features/order/order.types";
import { useGetRefundsQuery } from "@/redux/features/payment/paymentApi";
import type { PaymentRefunds, PaymentStatus } from "@/redux/features/payment/payment.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatDate, formatDateTime, formatMoneyExact } from "@/shared/libs/admin/format";
import { productImage } from "@/shared/libs/storefront/catalog";
import { cn } from "@/shared/utils/cn";
import { formatPrice } from "@/shared/utils/price";
import { Button, ButtonLink } from "../components/Button";
import { FilterSelect } from "../components/Field";
import { NoticeLine } from "../components/ListControls";
import { OrderLookup } from "../components/OrderLookup";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { Table, TableScroll, Td, TdNum, Th, ThNum, Tr } from "../components/Table";
import {
  ADMIN_ORDERS_HREF,
  ORDERS_PAGE_SIZE,
  ORDER_STATUS_META,
  REFUNDS_HREF,
  STAFF_ORDER_STATUSES,
  findOrderId,
  orderNumber,
  paymentMetaFor,
  paymentMethodLabel,
  statusBlockedBy,
} from "../config/orders";
import { blurbFor } from "./AdminSidebar";

// Moves that can't be taken back: the backend won't update a delivered or
// cancelled order again.
const FINAL: OrderStatus[] = ["delivered", "cancelled"];

// The lookup puts the order in the address; the page reads it from there.
const noop = () => {};

const customerOf = (order: StaffOrder) => (order.userId && typeof order.userId === "object" ? order.userId : null);

export function OrderStatusScreen({ initialOrder }: { initialOrder?: string }) {
  const notice = useAppSelector(selectNotice("orders"));
  // The open order lives in the address (?order=…), so it can be shared.
  const orderId = findOrderId(initialOrder ?? "");

  return (
    <>
      <ScreenHeader
        title={orderId ? `Order ${orderNumber(orderId)}` : "Orders"}
        blurb={orderId ? undefined : blurbFor(ADMIN_ORDERS_HREF)}
        actions={
          orderId && (
            <ButtonLink href={ADMIN_ORDERS_HREF} variant="ghost" size="sm">
              <ArrowLeft className="size-4" aria-hidden />
              All orders
            </ButtonLink>
          )
        }
      />
      <NoticeLine notice={notice} />
      {orderId ? (
        <ManageOrder key={orderId} orderId={orderId} />
      ) : (
        <>
          <AllOrders />
          <OrderLookup title="Find an order by ID" href={ADMIN_ORDERS_HREF} onFound={noop} />
        </>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Every customer's orders

function AllOrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const { data, isLoading, isFetching, isError, error, refetch } = useGetStaffOrdersQuery({
    page,
    limit: ORDERS_PAGE_SIZE,
    orderStatus: status || undefined,
  });

  const orders = data?.items ?? [];
  // The backend's total is capped at the page size, so a full page may mean more.
  const hasNext = orders.length === ORDERS_PAGE_SIZE;

  return (
    <Panel
      title="All orders"
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
      bodyClassName="py-0 md:py-0"
    >
      {isLoading ? (
        <EmptyState title="Loading orders…" />
      ) : isError ? (
        <EmptyState
          title="Couldn't load the orders"
          body={apiErrorMessage(error)}
          action={<Button onClick={() => refetch()}>Try again</Button>}
        />
      ) : orders.length === 0 ? (
        page > 1 ? (
          <EmptyState title="No more orders" action={<Button onClick={() => setPage(1)}>Back to page 1</Button>} />
        ) : (
          <EmptyState title={status ? "No orders with that status" : "No orders yet"} />
        )
      ) : (
        <>
          <TableScroll>
            <Table className={cn("transition-opacity", isFetching && "opacity-60")}>
              <caption className="sr-only">All orders</caption>
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Products</Th>
                  <Th>Placed</Th>
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
                  const customer = customerOf(order);
                  return (
                    <Tr key={order._id}>
                      <Td className="font-medium text-ink">{orderNumber(order._id)}</Td>
                      <Td className="min-w-40">
                        <span className="block text-ink">{customer?.name ?? order.shippingAddress.fullName}</span>
                        {customer?.email && <span className="block text-xs text-ink-subtle">{customer.email}</span>}
                      </Td>
                      <Td className="min-w-48">
                        <ul className="space-y-0.5">
                          {order.items.map((item) => (
                            <li key={item._id} className="text-ink">
                              {item.name} <span className="text-ink-subtle tabular-nums">× {item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </Td>
                      <Td className="whitespace-nowrap text-ink-muted">
                        <time dateTime={order.createdAt} title={formatDateTime(order.createdAt)}>
                          {formatDate(order.createdAt)}
                        </time>
                      </Td>
                      <TdNum className="font-medium text-ink">{formatPrice(order.totalAmount)}</TdNum>
                      <Td>
                        <StatusPill label={meta.label} tone={meta.tone} />
                      </Td>
                      <Td className="text-right">
                        <ButtonLink href={`${ADMIN_ORDERS_HREF}?order=${order._id}`} size="sm">
                          Manage
                          <span className="sr-only"> order {orderNumber(order._id)}</span>
                        </ButtonLink>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableScroll>

          <nav aria-label="Pages" className="-mx-4 flex flex-wrap items-center justify-end gap-2 px-4 py-3 text-sm md:-mx-5 md:px-5">
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
  );
}

// ---------------------------------------------------------------------------
// One order

function ManageOrder({ orderId }: { orderId: string }) {
  const dispatch = useAppDispatch();
  const fetched = useGetStaffOrderQuery(orderId);
  const payment = useGetRefundsQuery(orderId);
  const [update, { isLoading }] = useUpdateOrderStatusMutation();
  const [next, setNext] = useState<OrderStatus | "">("");
  const [armed, setArmed] = useState(false);

  // 404 on the payment just means nobody has started paying.
  const noPayment = payment.isError && typeof payment.error === "object" && "status" in payment.error && payment.error.status === 404;
  if (fetched.isLoading || payment.isLoading || fetched.isError || !fetched.data || (payment.isError && !noPayment)) {
    const problem = fetched.isError ? fetched : payment;
    return (
      <Panel>
        {fetched.isLoading || payment.isLoading ? (
          <EmptyState title="Loading the order…" />
        ) : (
          <EmptyState
            title={fetched.isError ? "Couldn't load this order" : "Couldn't load this order's payment"}
            body={apiErrorMessage(problem.error)}
            action={<Button onClick={() => problem.refetch()}>Try again</Button>}
          />
        )}
      </Panel>
    );
  }

  const order = fetched.data;
  const paymentStatus: PaymentStatus | null = payment.data?.paymentStatus ?? null;
  const method = payment.data?.paymentMethod ?? null;
  const paymentMeta = paymentMetaFor(paymentStatus, method);
  const current = order.orderStatus;
  const closed = FINAL.includes(current);
  const blocked = next ? statusBlockedBy(next, paymentStatus, method) : null;

  const choose = (value: OrderStatus | "") => {
    setNext(value);
    setArmed(false);
  };

  const save = async () => {
    if (!next) return;
    setArmed(false);
    try {
      // The order and its payment refetch on their own after this.
      const updated = await update({ id: orderId, orderStatus: next }).unwrap();
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
          title="Items"
          description={orderId}
          actions={<StatusPill label={ORDER_STATUS_META[current].label} tone={ORDER_STATUS_META[current].tone} />}
        >
          <OrderSummary order={order} />
        </Panel>

        <Panel
          title="Payment"
          actions={
            // Refunds go back through SSLCommerz, so cash on delivery has none.
            payment.data &&
            method !== "cod" && (
              <ButtonLink href={`${REFUNDS_HREF}?order=${orderId}`} size="sm">
                Refunds
              </ButtonLink>
            )
          }
        >
          <StatusPill label={paymentMeta.label} tone={paymentMeta.tone} />
          {payment.data ? (
            <PaymentDetailsList payment={payment.data} />
          ) : (
            <p className="mt-2 text-sm text-ink-muted">The customer hasn&apos;t started paying.</p>
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
              const reason = status === current ? "It's already here." : statusBlockedBy(status, paymentStatus, method);
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

// Everything known about how the order is (being) paid. SSLCommerz's details
// arrive once it verifies a payment.
function PaymentDetailsList({ payment }: { payment: PaymentRefunds }) {
  const rows: [string, string | undefined][] = [
    ["Method", paymentMethodLabel(payment.paymentMethod, payment)],
    ["Amount", formatMoneyExact(payment.amountBdt)],
    ["Refunded", payment.refundedAmountBdt > 0 ? formatMoneyExact(payment.refundedAmountBdt) : undefined],
    ["Paid on", payment.paidAt ? formatDateTime(payment.paidAt) : undefined],
    ["Card / account", payment.cardNumber],
    ["Issued by", payment.cardIssuer],
    ["Country", payment.cardIssuerCountry],
    ["SSLCommerz type", payment.cardType],
    ["Transaction ID", payment.transactionId],
    ["Bank transaction ID", payment.bankTransactionId],
    ["Gateway time", payment.gatewayTranDate],
  ];

  return (
    <dl className="mt-3 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm">
      {rows
        .filter((row): row is [string, string] => Boolean(row[1]))
        .map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-ink-muted">{label}</dt>
            <dd className="break-all text-ink tabular-nums">{value}</dd>
          </div>
        ))}
    </dl>
  );
}

function OrderSummary({ order }: { order: StaffOrder }) {
  const { shippingAddress: to } = order;
  const customer = customerOf(order);
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
      <div className="grid gap-4 border-t border-line pt-4 text-sm sm:grid-cols-3">
        <div>
          <p className="text-ink-muted">Total</p>
          <p className="mt-0.5 font-bold text-ink tabular-nums">{formatPrice(order.totalAmount)}</p>
          <p className="mt-1 text-xs text-ink-subtle">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-ink-muted">Customer</p>
          {customer ? (
            <>
              <p className="mt-0.5 font-medium text-ink">{customer.name}</p>
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="block break-all text-ink-muted hover:text-tertiary hover:underline">
                  {customer.email}
                </a>
              )}
            </>
          ) : (
            <p className="mt-0.5 text-ink-muted">Account no longer exists</p>
          )}
        </div>
        <address className="text-ink-muted not-italic">
          <span className="block text-ink-muted">Delivering to</span>
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
