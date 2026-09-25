"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { lineKey, useCart } from "@/shared/libs/cart";
import { cart_data } from "./config/constants";
import { CartRow } from "./partials/CartRow";
import { OrderSummary } from "./partials/OrderSummary";

/* The basket.
 *
 * A client component all the way down, because the basket lives in this
 * browser — there is nothing for the server to render but the empty state. The
 * page is still prerendered and still has its metadata; `useCart` hands back an
 * empty basket during prerender and React swaps in the real one on hydration. */
export function Cart() {
  const { lines, selected, setAllSelected, clear } = useCart();
  const [confirming, setConfirming] = useState(false);

  const allTicked = lines.length > 0 && lines.every((line) => line.selected);

  return (
    <>
      <ProductBreadcrumb
        trail={[
          { label: cart_data.crumbHome, href: "/" },
          { label: cart_data.crumbCart },
        ]}
      />

      <div className="container-page py-8">
        <h1 className="font-sans font-bold text-ink">{cart_data.title}</h1>

        {lines.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-card border border-line bg-surface px-6 py-20 text-center">
            <ShoppingCart className="size-10 text-ink-subtle" aria-hidden />
            <p className="font-sans font-bold text-ink">{cart_data.emptyTitle}</p>
            <p className="max-w-sm text-ink-muted">{cart_data.emptyBody}</p>
            <Link
              href="/offers"
              className="mt-2 rounded-control bg-tertiary px-6 py-3 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
            >
              {cart_data.emptyAction}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section aria-label={cart_data.title} className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <label className="flex items-center gap-2.5 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={allTicked}
                    onChange={(event) => setAllSelected(event.target.checked)}
                    className="size-5 accent-tertiary"
                  />
                  {cart_data.selectAll}
                </label>

                <p role="status" className="text-sm text-ink-muted tabular-nums">
                  {cart_data.selectedCount.replace("{n}", String(selected.length))}
                </p>
              </div>

              <ul>
                {lines.map((line) => (
                  <CartRow key={lineKey(line)} line={line} />
                ))}
              </ul>

              {/* Two clicks rather than a native `confirm()`: a blocking
                  browser dialog looks like the page has hung, and it cannot be
                  styled or read out with the rest of the page. */}
              {confirming ? (
                <p className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-ink">{cart_data.clearConfirm}</span>
                  <button
                    type="button"
                    autoFocus
                    onBlur={() => setConfirming(false)}
                    onClick={() => {
                      clear();
                      setConfirming(false);
                    }}
                    className="rounded-control border border-danger px-3 py-1.5 font-medium text-danger transition-colors hover:bg-danger-soft"
                  >
                    {cart_data.clear}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="text-ink-muted underline"
                  >
                    Keep it
                  </button>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="mt-5 text-sm text-ink-muted underline transition-colors hover:text-danger"
                >
                  {cart_data.clear}
                </button>
              )}
            </section>

            <OrderSummary selected={selected} />
          </div>
        )}
      </div>
    </>
  );
}
