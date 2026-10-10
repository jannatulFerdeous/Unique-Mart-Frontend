"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { apiErrorMessage } from "@/redux/api/errors";
import { useClearCartMutation } from "@/redux/features/cart/cartApi";
import { useCart } from "@/shared/libs/cart";
import { toast } from "@/shared/libs/toast";
import { useSignInFirst } from "@/shared/libs/useSignInFirst";
import { cart_data } from "./config/constants";
import { CartRow } from "./partials/CartRow";
import { OrderSummary } from "./partials/OrderSummary";

export function Cart() {
  const { signedIn, goSignIn } = useSignInFirst();
  const { lines, isLoading, isError, error, refetch } = useCart();
  const [clear, { isLoading: clearing }] = useClearCartMutation();
  const [confirming, setConfirming] = useState(false);

  const empty = async () => {
    setConfirming(false);
    try {
      await clear().unwrap();
    } catch (problem) {
      toast("danger", apiErrorMessage(problem, "Couldn't empty your basket. Please try again."));
    }
  };

  return (
    <>
      <ProductBreadcrumb trail={[{ label: cart_data.crumbHome, href: "/" }, { label: cart_data.crumbCart }]} />

      <div className="container-page py-8">
        <h1 className="font-sans font-bold text-ink">{cart_data.title}</h1>

        {!signedIn ? (
          <CartNotice title={cart_data.signInTitle} body={cart_data.signInBody}>
            <button type="button" onClick={goSignIn} className={primaryAction}>
              {cart_data.signInAction}
            </button>
          </CartNotice>
        ) : isLoading ? (
          <CartNotice title={cart_data.loading} />
        ) : isError ? (
          <CartNotice title={cart_data.errorTitle} body={apiErrorMessage(error)}>
            <button type="button" onClick={() => refetch()} className={primaryAction}>
              {cart_data.retry}
            </button>
          </CartNotice>
        ) : lines.length === 0 ? (
          <CartNotice title={cart_data.emptyTitle} body={cart_data.emptyBody}>
            <Link href="/offers" className={primaryAction}>
              {cart_data.emptyAction}
            </Link>
          </CartNotice>
        ) : (
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section aria-label={cart_data.title} className="min-w-0">
              <ul className="border-t border-line">
                {lines.map((line) => (
                  <CartRow key={line.id} line={line} />
                ))}
              </ul>

              {confirming ? (
                <p className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-ink">{cart_data.clearConfirm}</span>
                  <button
                    type="button"
                    autoFocus
                    onBlur={() => setConfirming(false)}
                    onClick={empty}
                    className="rounded-control border border-danger px-3 py-1.5 font-medium text-danger transition-colors hover:bg-danger-soft"
                  >
                    {cart_data.clear}
                  </button>
                  <button type="button" onClick={() => setConfirming(false)} className="text-ink-muted underline">
                    {cart_data.keep}
                  </button>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  disabled={clearing}
                  className="mt-5 text-sm text-ink-muted underline transition-colors hover:text-danger"
                >
                  {cart_data.clear}
                </button>
              )}
            </section>

            <OrderSummary lines={lines} />
          </div>
        )}
      </div>
    </>
  );
}

const primaryAction =
  "mt-2 rounded-control bg-tertiary px-6 py-3 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover";

export function CartNotice({ title, body, children }: { title: string; body?: string; children?: ReactNode }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3 rounded-card border border-line bg-surface px-6 py-20 text-center">
      <ShoppingCart className="size-10 text-ink-subtle" aria-hidden />
      <p className="font-sans font-bold text-ink">{title}</p>
      {body && <p className="max-w-sm text-ink-muted">{body}</p>}
      {children}
    </div>
  );
}
