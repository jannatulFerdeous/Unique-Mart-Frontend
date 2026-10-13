"use client";

import { useState, type FormEvent } from "react";
import { apiErrorMessage } from "@/redux/api/errors";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import {
  useCheckRefundStatusMutation,
  useCreateRefundMutation,
  useGetRefundsQuery,
  useRetryRefundMutation,
} from "@/redux/features/payment/paymentApi";
import type { PaymentRefunds, Refund } from "@/redux/features/payment/payment.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatDate, formatDateTime, formatMoneyExact } from "@/shared/libs/admin/format";
import { cn } from "@/shared/utils/cn";
import { Button } from "../components/Button";
import { Field, Input, Textarea } from "../components/Field";
import { OrderLookup } from "../components/OrderLookup";
import { NoticeLine } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { Table, TableScroll, Td, TdNum, Th, ThNum, Tr } from "../components/Table";
import {
  PAYMENT_STATUS_META,
  REFUNDS_HREF,
  REFUND_STATUS_META,
  findOrderId,
  orderNumber,
  refundable,
} from "../config/orders";
import { blurbFor } from "./AdminSidebar";

const REMARKS_MAX = 255;

export function RefundsScreen({ initialOrder }: { initialOrder?: string }) {
  const notice = useAppSelector(selectNotice("refunds"));
  const [orderId, setOrderId] = useState(() => findOrderId(initialOrder ?? ""));

  return (
    <>
      <ScreenHeader title="Refunds" blurb={blurbFor(REFUNDS_HREF)} />
      <OrderLookup title="Find a paid order" href={REFUNDS_HREF} initial={initialOrder} onFound={setOrderId} />
      <NoticeLine notice={notice} />
      {orderId && <OrderRefunds key={orderId} orderId={orderId} />}
    </>
  );
}

function OrderRefunds({ orderId }: { orderId: string }) {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetRefundsQuery(orderId);

  if (isLoading || isError || !data) {
    const missing = isError && typeof error === "object" && "status" in error && error.status === 404;
    return (
      <Panel>
        {isLoading ? (
          <EmptyState title="Loading the payment…" />
        ) : missing ? (
          <EmptyState
            title="No payment for this order"
            body="Check the ID. If it's right, the customer never started paying, so there's nothing to refund."
          />
        ) : (
          <EmptyState
            title="Couldn't load this payment"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        )}
      </Panel>
    );
  }

  const left = refundable(data);
  const meta = PAYMENT_STATUS_META[data.paymentStatus];
  const settled = ["paid", "partially_refunded", "refunded"].includes(data.paymentStatus);
  // Newest first.
  const refunds = [...data.refunds].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className={cn("flex min-w-0 flex-col gap-5 transition-opacity", isFetching && "opacity-60")}>
        <Panel
          title={`Order ${orderNumber(orderId)}`}
          description={orderId}
          actions={<StatusPill label={meta.label} tone={meta.tone} />}
        >
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <Amount label={settled ? "Charged" : "Order total"} value={settled ? data.capturedAmountBdt : data.amountBdt} />
            <Amount label="Refunded" value={data.refundedAmountBdt} />
            <Amount label="In progress" value={data.pendingRefundAmountBdt} />
            <Amount label="Can still refund" value={left} strong />
          </dl>
        </Panel>

        <Panel title="Refund history" bodyClassName="py-0 md:py-0">
          {refunds.length === 0 ? (
            <EmptyState title="No refunds yet" />
          ) : (
            <TableScroll>
              <Table>
                <caption className="sr-only">Refunds on order {orderNumber(orderId)}</caption>
                <thead>
                  <tr>
                    <Th>Requested</Th>
                    <ThNum>Amount</ThNum>
                    <Th>Status</Th>
                    <Th>Reason</Th>
                    <Th>
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((refund) => (
                    <RefundRow key={refund.refundTransId} orderId={orderId} refund={refund} />
                  ))}
                </tbody>
              </Table>
            </TableScroll>
          )}
        </Panel>
      </div>

      <Panel title="Give a refund">
        {left > 0 ? (
          <RefundForm orderId={orderId} left={left} />
        ) : (
          <p className="text-sm text-ink-muted">{nothingToRefund(data)}</p>
        )}
      </Panel>
    </div>
  );
}

const nothingToRefund = (payment: PaymentRefunds) =>
  payment.paymentStatus === "refunded"
    ? "This order has been refunded in full."
    : ["paid", "partially_refunded"].includes(payment.paymentStatus)
      ? "Everything paid is already refunded or on its way back."
      : `Only paid orders can be refunded. This payment is ${PAYMENT_STATUS_META[payment.paymentStatus].label.toLowerCase()}.`;

function Amount({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div>
      <dt className="text-ink-muted">{label}</dt>
      <dd className={cn("mt-0.5 text-ink tabular-nums", strong && "font-bold")}>{formatMoneyExact(value)}</dd>
    </div>
  );
}

function RefundRow({ orderId, refund }: { orderId: string; refund: Refund }) {
  const dispatch = useAppDispatch();
  const [retry, retrying] = useRetryRefundMutation();
  const [check, checking] = useCheckRefundStatusMutation();
  const busy = retrying.isLoading || checking.isLoading;
  const meta = REFUND_STATUS_META[refund.status];
  const args = { orderId, refundTransId: refund.refundTransId };
  // Without SSLCommerz's reference the request may never have arrived.
  const canRetry = refund.status === "pending" && !refund.refundRefId;
  const canCheck = Boolean(refund.refundRefId) && (refund.status === "pending" || refund.status === "processing");

  const act = async (action: () => Promise<string>) => {
    try {
      dispatch(showNotice({ scope: "refunds", tone: "good", text: await action() }));
    } catch (problem) {
      dispatch(showNotice({ scope: "refunds", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  const resend = () =>
    act(async () => {
      await retry(args).unwrap();
      return "SSLCommerz has the refund now. Check its status in a while.";
    });

  const refresh = () =>
    act(async () => {
      const { status } = await check(args).unwrap();
      return status === "refunded"
        ? `${formatMoneyExact(refund.amount)} is back with the customer.`
        : status === "cancelled"
          ? "SSLCommerz cancelled this refund. You can give a new one."
          : "SSLCommerz is still processing this refund.";
    });

  return (
    <Tr aria-busy={busy}>
      <Td className="whitespace-nowrap text-ink-muted">
        <time dateTime={refund.createdAt} title={formatDateTime(refund.createdAt)}>
          {formatDate(refund.createdAt)}
        </time>
      </Td>
      <TdNum className="font-medium text-ink">{formatMoneyExact(refund.amount)}</TdNum>
      <Td>
        <StatusPill label={meta.label} tone={meta.tone} />
        {refund.completedAt && <p className="mt-1 text-xs text-ink-subtle">{formatDate(refund.completedAt)}</p>}
      </Td>
      <Td className="max-w-64 text-ink-muted">
        <p className="line-clamp-2" title={refund.remarks}>
          {refund.remarks}
        </p>
      </Td>
      <Td className="text-right whitespace-nowrap">
        {canRetry && (
          <Button size="sm" onClick={resend} disabled={busy}>
            {retrying.isLoading ? "Sending…" : "Send again"}
          </Button>
        )}
        {canCheck && (
          <Button size="sm" onClick={refresh} disabled={busy}>
            {checking.isLoading ? "Checking…" : "Check status"}
          </Button>
        )}
      </Td>
    </Tr>
  );
}

// Mirrors the backend `createRefundValidationSchema`: an optional amount to
// the paisa, and remarks of 1–255 characters.
function RefundForm({ orderId, left }: { orderId: string; left: number }) {
  const dispatch = useAppDispatch();
  const [createRefund, { isLoading }] = useCreateRefundMutation();
  const [whole, setWhole] = useState(true);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; remarks?: string }>({});
  const [armed, setArmed] = useState(false);

  const value = whole ? left : Number(amount);

  const review = (event: FormEvent) => {
    event.preventDefault();
    const next = {
      amount: whole
        ? undefined
        : !/^\d+(\.\d{1,2})?$/.test(amount.trim()) || value < 0.01
          ? "Enter an amount like 250 or 99.50."
          : value > left
            ? `You can refund up to ${formatMoneyExact(left)}.`
            : undefined,
      remarks: remarks.trim() ? undefined : "Say why. SSLCommerz keeps this with the refund.",
    };
    setErrors(next);
    setArmed(!next.amount && !next.remarks);
  };

  const send = async () => {
    setArmed(false);
    try {
      await createRefund({ orderId, remarks: remarks.trim(), ...(whole ? {} : { amount: value }) }).unwrap();
      dispatch(
        showNotice({
          scope: "refunds",
          tone: "good",
          text: `${formatMoneyExact(value)} refund sent to SSLCommerz. Check its status in the history once they've processed it.`,
        }),
      );
      setWhole(true);
      setAmount("");
      setRemarks("");
    } catch (problem) {
      dispatch(showNotice({ scope: "refunds", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  return (
    <form onSubmit={review} className="flex flex-col gap-4" aria-busy={isLoading}>
      <fieldset className="min-w-0">
        <legend className="mb-1.5 block text-sm font-medium text-ink">How much</legend>
        <div className="flex flex-col gap-2 text-sm text-ink">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="refund-amount"
              checked={whole}
              onChange={() => {
                setWhole(true);
                setArmed(false);
              }}
              className="accent-tertiary"
            />
            Everything left ({formatMoneyExact(left)})
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="refund-amount"
              checked={!whole}
              onChange={() => {
                setWhole(false);
                setArmed(false);
              }}
              className="accent-tertiary"
            />
            Part of it
          </label>
        </div>
      </fieldset>

      {!whole && (
        <Field label="Amount (Tk)" error={errors.amount} hint={`Up to ${formatMoneyExact(left)}`}>
          <Input
            inputMode="decimal"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setArmed(false);
            }}
            placeholder="e.g. 250"
            aria-invalid={Boolean(errors.amount) || undefined}
          />
        </Field>
      )}

      <Field label="Reason" error={errors.remarks} hint={`${remarks.length}/${REMARKS_MAX}`}>
        <Textarea
          value={remarks}
          maxLength={REMARKS_MAX}
          onChange={(event) => {
            setRemarks(event.target.value);
            setArmed(false);
          }}
          placeholder="e.g. Item out of stock"
          aria-invalid={Boolean(errors.remarks) || undefined}
        />
      </Field>

      {armed ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-ink">
            Refund <strong className="tabular-nums">{formatMoneyExact(value)}</strong> to the customer? This can&apos;t be
            undone.
          </p>
          <div className="flex gap-2">
            <Button variant="danger" onClick={send} autoFocus>
              Yes, refund
            </Button>
            <Button variant="ghost" onClick={() => setArmed(false)}>
              Not yet
            </Button>
          </div>
        </div>
      ) : (
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Sending to SSLCommerz…" : "Review refund"}
        </Button>
      )}
    </form>
  );
}
