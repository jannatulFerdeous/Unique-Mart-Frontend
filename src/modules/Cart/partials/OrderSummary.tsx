"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { lineTotal, type CartLine } from "@/shared/libs/cart";
import { formatPrice } from "@/shared/utils/price";
import { cart_data } from "../config/constants";

// The backend charges no delivery and orders the whole cart at the price
// shown, so the total here is what the order will come to.
export function OrderSummary({ lines, action }: { lines: CartLine[]; action?: ReactNode }) {
  const sold = lines.filter((line) => !line.missing);
  const subtotal = sold.reduce((sum, line) => sum + lineTotal(line), 0);
  const blocked = sold.length !== lines.length;

  return (
    <aside aria-labelledby="order-summary" className="rounded-card border border-line bg-surface p-5 lg:sticky lg:top-6">
      <h2 id="order-summary" className="font-sans font-bold text-ink">
        {cart_data.summary}
      </h2>

      <ul className="mt-4 space-y-3 border-b border-line pb-4">
        {sold.map((line) => {
          const variant = Object.values(line.options).join(" · ");

          return (
            <li key={line.id} className="flex items-center gap-3">
              {line.image ? (
                <Image src={line.image} alt="" sizes="40px" className="size-10 shrink-0 object-contain" />
              ) : (
                <span className="size-10 shrink-0 bg-surface-muted" />
              )}

              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 text-sm text-ink">{line.name}</span>
                <span className="mt-0.5 block text-xs text-ink-subtle">
                  {variant}
                  {variant && line.quantity > 1 ? " · " : ""}
                  {line.quantity > 1 ? <span className="tabular-nums">× {line.quantity}</span> : null}
                </span>
              </span>

              <span className="shrink-0 text-sm font-medium text-ink tabular-nums">
                {formatPrice(lineTotal(line))}
              </span>
            </li>
          );
        })}
      </ul>

      <dl className="mt-4 space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-muted">{cart_data.subtotal}</dt>
          <dd className="font-medium text-ink tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-muted">{cart_data.delivery}</dt>
          <dd className="font-medium text-ink">{cart_data.deliveryFree}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <span className="font-sans font-bold text-ink">{cart_data.total}</span>
        <span className="font-sans text-xl font-bold text-ink tabular-nums">{formatPrice(subtotal)}</span>
      </div>

      {blocked ? (
        <p role="alert" className="mt-5 text-sm font-medium text-danger">
          {cart_data.missingBlocks}
        </p>
      ) : (
        (action ?? (
          <Link
            href="/checkout"
            className="mt-5 block w-full rounded-control bg-tertiary px-6 py-3.5 text-center font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
          >
            {cart_data.checkout}
          </Link>
        ))
      )}

      <p className="mt-3 text-xs text-ink-subtle">{cart_data.note}</p>
    </aside>
  );
}
