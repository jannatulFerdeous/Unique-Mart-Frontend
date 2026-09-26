"use client";

import Image from "next/image";
import { lineKey, lineTotal, type CartLine } from "@/shared/libs/cart";
import { FREE_SHIPPING_FROM, shippingFor } from "@/shared/config/shipping";
import { formatPrice } from "@/shared/utils/price";
import { cart_data } from "../config/constants";
import { lineImage } from "../lineImage";

export function OrderSummary({ selected }: { selected: CartLine[] }) {
  const subtotal = selected.reduce((sum, line) => sum + lineTotal(line), 0);
  const delivery = shippingFor(subtotal);
  const total = subtotal + delivery;
  const empty = selected.length === 0;

  return (
    <aside
      aria-labelledby="order-summary"
      className="rounded-card border border-line bg-surface p-5 lg:sticky lg:top-6"
    >
      <h2 id="order-summary" className="font-sans font-bold text-ink">
        {cart_data.summary}
      </h2>

      {empty ? (
        <p className="mt-4 text-sm text-ink-muted">{cart_data.nothingSelected}</p>
      ) : (
        <ul className="mt-4 space-y-3 border-b border-line pb-4">
          {selected.map((line) => {
            const image = lineImage(line);
            const variant = [line.color, ...Object.values(line.options ?? {})]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={lineKey(line)} className="flex items-center gap-3">
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    sizes="40px"
                    className="size-10 shrink-0 object-contain"
                  />
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
      )}

      <dl className="mt-4 space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-muted">{cart_data.subtotal}</dt>
          <dd className="font-medium text-ink tabular-nums">{formatPrice(subtotal)}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-muted">{cart_data.delivery}</dt>
          <dd className="font-medium text-ink tabular-nums">
            {delivery === 0 ? cart_data.deliveryFree : formatPrice(delivery)}
          </dd>
        </div>
      </dl>

      {delivery > 0 && (
        <p className="mt-2 text-xs text-ink-subtle">
          {cart_data.deliveryNote.replace("{threshold}", formatPrice(FREE_SHIPPING_FROM))}
        </p>
      )}

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <span className="font-sans font-bold text-ink">{cart_data.total}</span>
        <span className="font-sans text-xl font-bold text-ink tabular-nums">
          {formatPrice(total)}
        </span>
      </div>

      <button
        type="button"
        disabled={empty}
        className="mt-5 w-full rounded-control bg-tertiary px-6 py-3.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover disabled:pointer-events-none disabled:opacity-50"
      >
        {cart_data.checkout}
      </button>

      <p className="mt-3 text-xs text-ink-subtle">{cart_data.storageNote}</p>
    </aside>
  );
}
