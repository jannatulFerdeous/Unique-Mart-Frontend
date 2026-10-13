"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { paymentOrderId, useGetPaymentsQuery } from "@/redux/features/payment/paymentApi";
import {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  type PaymentMethod,
  type PaymentStatus,
  type StaffPayment,
} from "@/redux/features/payment/payment.types";
import { formatDate, formatDateTime } from "@/shared/libs/admin/format";
import { cn } from "@/shared/utils/cn";
import { formatPrice } from "@/shared/utils/price";
import { Button, ButtonLink } from "../components/Button";
import { FilterSelect } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { Table, TableScroll, Td, TdNum, Th, ThNum, Tr } from "../components/Table";
import {
  ADMIN_ORDERS_HREF,
  ORDERS_PAGE_SIZE,
  PAYMENTS_HREF,
  PAYMENT_STATUS_META,
  REFUNDS_HREF,
  orderNumber,
  paymentMetaFor,
  paymentMethodLabel,
} from "../config/orders";
import { blurbFor } from "./AdminSidebar";

const METHOD_LABEL: Record<PaymentMethod, string> = {
  sslcommerz: "SSLCommerz",
  cod: "Cash on delivery",
};

const customerOf = (payment: StaffPayment) =>
  payment.userId && typeof payment.userId === "object" ? payment.userId : null;

// Refunds go back through SSLCommerz, and only on money it took.
const refundable = (payment: StaffPayment) =>
  payment.paymentMethod === "sslcommerz" &&
  (payment.paymentStatus === "paid" ||
    payment.paymentStatus === "partially_refunded" ||
    payment.paymentStatus === "refunded");

export function PaymentsScreen() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const { data, isLoading, isFetching, isError, error, refetch } = useGetPaymentsQuery({
    page,
    limit: ORDERS_PAGE_SIZE,
    paymentStatus: status || undefined,
    paymentMethod: method || undefined,
  });

  const payments = data?.items ?? [];
  // The backend's total is capped at the page size, so a full page may mean more.
  const hasNext = payments.length === ORDERS_PAGE_SIZE;
  const filtered = Boolean(status || method);

  return (
    <>
      <ScreenHeader
        title="Payments"
        blurb={blurbFor(PAYMENTS_HREF)}
        actions={
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as PaymentStatus | "");
                setPage(1);
              }}
            >
              <option value="">Any status</option>
              {PAYMENT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {PAYMENT_STATUS_META[value].label}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Method"
              value={method}
              onChange={(event) => {
                setMethod(event.target.value as PaymentMethod | "");
                setPage(1);
              }}
            >
              <option value="">Any method</option>
              {PAYMENT_METHODS.map((value) => (
                <option key={value} value={value}>
                  {METHOD_LABEL[value]}
                </option>
              ))}
            </FilterSelect>
          </div>
        }
      />

      <Panel bodyClassName="py-0 md:py-0">
        {isLoading ? (
          <EmptyState title="Loading payments…" />
        ) : isError ? (
          <EmptyState
            title="Couldn't load the payments"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : payments.length === 0 ? (
          page > 1 ? (
            <EmptyState title="No more payments" action={<Button onClick={() => setPage(1)}>Back to page 1</Button>} />
          ) : (
            <EmptyState
              title={filtered ? "No payments match" : "No payments yet"}
              body={filtered ? undefined : "A payment appears here once a customer starts paying or orders cash on delivery."}
            />
          )
        ) : (
          <>
            <TableScroll>
              <Table className={cn("transition-opacity", isFetching && "opacity-60")}>
                <caption className="sr-only">Payments</caption>
                <thead>
                  <tr>
                    <Th>Order</Th>
                    <Th>Customer</Th>
                    <Th>Method</Th>
                    <ThNum>Amount</ThNum>
                    <Th>Status</Th>
                    <Th>Paid on</Th>
                    <Th>
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const orderId = paymentOrderId(payment);
                    const customer = customerOf(payment);
                    const meta = paymentMetaFor(payment.paymentStatus, payment.paymentMethod);
                    return (
                      <Tr key={payment._id}>
                        <Td className="font-medium whitespace-nowrap text-ink">
                          {orderId ? orderNumber(orderId) : "—"}
                          <span className="block text-xs font-normal text-ink-subtle">
                            <time dateTime={payment.createdAt} title={formatDateTime(payment.createdAt)}>
                              {formatDate(payment.createdAt)}
                            </time>
                          </span>
                        </Td>
                        <Td className="min-w-40">
                          <span className="block text-ink">{customer?.name ?? "Account no longer exists"}</span>
                          {customer?.email && <span className="block text-xs text-ink-subtle">{customer.email}</span>}
                        </Td>
                        <Td className="min-w-44 text-ink-muted">
                          {paymentMethodLabel(payment.paymentMethod, payment)}
                          {payment.cardIssuerCountry && (
                            <span className="block text-xs text-ink-subtle">{payment.cardIssuerCountry}</span>
                          )}
                        </Td>
                        <TdNum className="font-medium text-ink">
                          {formatPrice(payment.amount)}
                          {payment.refundedAmount > 0 && (
                            <span className="block text-xs font-normal text-ink-subtle">
                              {formatPrice(payment.refundedAmount)} refunded
                            </span>
                          )}
                        </TdNum>
                        <Td>
                          <StatusPill label={meta.label} tone={meta.tone} />
                        </Td>
                        <Td className="whitespace-nowrap text-ink-muted">
                          {payment.paidAt ? (
                            <time dateTime={payment.paidAt} title={formatDateTime(payment.paidAt)}>
                              {formatDate(payment.paidAt)}
                            </time>
                          ) : (
                            "—"
                          )}
                        </Td>
                        <Td className="text-right">
                          {orderId && (
                            <div className="flex justify-end gap-2">
                              <ButtonLink href={`${ADMIN_ORDERS_HREF}?order=${orderId}`} size="sm">
                                Order
                                <span className="sr-only"> {orderNumber(orderId)}</span>
                              </ButtonLink>
                              {refundable(payment) && (
                                <ButtonLink href={`${REFUNDS_HREF}?order=${orderId}`} size="sm">
                                  Refunds
                                  <span className="sr-only"> for order {orderNumber(orderId)}</span>
                                </ButtonLink>
                              )}
                            </div>
                          )}
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
