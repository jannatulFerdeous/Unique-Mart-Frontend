"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Plus } from "lucide-react";
// Only the form, not the whole dashboard module.
import { AddressForm, ADDRESS_LABEL_NAME } from "@/modules/AdminPortal/components/AddressForm";
import { CartNotice, OrderSummary } from "@/modules/Cart";
import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { apiErrorMessage } from "@/redux/api/errors";
import { useGetAddressesQuery } from "@/redux/features/address/addressApi";
import type { Address } from "@/redux/features/address/address.types";
import { useClearCartMutation } from "@/redux/features/cart/cartApi";
import { useCreateOrderMutation } from "@/redux/features/order/orderApi";
import { useCart } from "@/shared/libs/cart";
import { useSignInFirst } from "@/shared/libs/useSignInFirst";
import { cn } from "@/shared/utils/cn";
import { checkout_data as copy } from "./config/constants";

const primaryAction =
  "mt-2 rounded-control bg-tertiary px-6 py-3 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover";

export function Checkout() {
  const { signedIn, goSignIn } = useSignInFirst();
  const cart = useCart();
  const addresses = useGetAddressesQuery(undefined, { skip: !signedIn });

  return (
    <>
      <ProductBreadcrumb
        trail={[{ label: "Home", href: "/" }, { label: "Cart List", href: "/cart" }, { label: copy.title }]}
      />

      <div className="container-page py-8">
        <h1 className="font-sans font-bold text-ink">{copy.title}</h1>

        {!signedIn ? (
          <CartNotice title={copy.signInTitle} body={copy.signInBody}>
            <button type="button" onClick={goSignIn} className={primaryAction}>
              {copy.signIn}
            </button>
          </CartNotice>
        ) : cart.isLoading || addresses.isLoading ? (
          <CartNotice title={copy.loading} />
        ) : cart.isError || addresses.isError ? (
          <CartNotice title={copy.errorTitle} body={apiErrorMessage(cart.error ?? addresses.error)}>
            <button
              type="button"
              onClick={() => {
                cart.refetch();
                addresses.refetch();
              }}
              className={primaryAction}
            >
              {copy.retry}
            </button>
          </CartNotice>
        ) : cart.lines.length === 0 ? (
          <CartNotice title={copy.emptyTitle} body={copy.emptyBody}>
            <Link href="/" className={primaryAction}>
              {copy.emptyAction}
            </Link>
          </CartNotice>
        ) : (
          <CheckoutForm addresses={addresses.data ?? []} lines={cart.lines} />
        )}
      </div>
    </>
  );
}

function CheckoutForm({ addresses, lines }: { addresses: Address[]; lines: ReturnType<typeof useCart>["lines"] }) {
  const router = useRouter();
  const [chosen, setChosen] = useState<string | null>(null);
  const [adding, setAdding] = useState(addresses.length === 0);
  const [failure, setFailure] = useState<string | null>(null);
  const [createOrder, { isLoading: placing }] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();

  // The pick, else the default address, else the first one.
  const selected = addresses.find((each) => each._id === chosen) ?? addresses.find((each) => each.isDefault) ?? addresses[0];

  const place = async () => {
    if (!selected) return;
    setFailure(null);
    try {
      const order = await createOrder({ shippingAddressId: selected._id }).unwrap();
      // The backend copies the cart into the order but leaves the cart full.
      await clearCart().unwrap().catch(() => undefined);
      router.push(`/account/orders/${order._id}?placed=1`);
    } catch (problem) {
      setFailure(apiErrorMessage(problem, "Couldn't place your order. Please try again."));
    }
  };

  return (
    <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0 space-y-6">
        <section aria-labelledby="checkout-address" className="rounded-card border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="checkout-address" className="font-sans font-bold text-ink">
              {copy.addressHeading}
            </h2>
            {!adding && (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-tertiary hover:underline"
              >
                <Plus className="size-4" aria-hidden />
                {copy.addAddress}
              </button>
            )}
          </div>

          {addresses.length > 0 && (
            <div role="radiogroup" aria-labelledby="checkout-address" className="mt-4 grid gap-3 sm:grid-cols-2">
              {addresses.map((address) => {
                const current = address._id === selected?._id;
                return (
                  <label
                    key={address._id}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-control border p-4 transition-colors",
                      current ? "border-tertiary bg-tertiary-soft" : "border-line hover:border-line-strong",
                    )}
                  >
                    <input
                      type="radio"
                      name="shipping-address"
                      checked={current}
                      onChange={() => setChosen(address._id)}
                      className="mt-1 size-4 shrink-0 accent-tertiary"
                    />
                    <span className="min-w-0 text-sm">
                      <span className="flex flex-wrap items-center gap-2 font-medium text-ink">
                        {address.fullName}
                        <span className="rounded-control bg-surface-muted px-1.5 py-0.5 text-xs text-ink-muted">
                          {ADDRESS_LABEL_NAME[address.label]}
                        </span>
                        {address.isDefault && <span className="text-xs text-tertiary">{copy.default}</span>}
                      </span>
                      <span className="mt-1 block text-ink-muted">
                        {address.address}, {address.city} {address.postalCode}, {address.country}
                      </span>
                      <span className="block text-ink-muted">{address.phone}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {adding && (
            <div className={cn(addresses.length > 0 && "mt-5 border-t border-line pt-5")}>
              {addresses.length === 0 && (
                <p className="mt-2 mb-4 flex items-center gap-2 text-sm text-ink-muted">
                  <MapPin className="size-4" aria-hidden />
                  {copy.firstAddress}
                </p>
              )}
              <AddressForm
                makeDefault={addresses.length === 0}
                onSaved={(saved) => {
                  setChosen(saved._id);
                  setAdding(false);
                }}
                onCancel={addresses.length > 0 ? () => setAdding(false) : undefined}
              />
            </div>
          )}
        </section>

        <section aria-labelledby="checkout-payment" className="rounded-card border border-line bg-surface p-5">
          <h2 id="checkout-payment" className="font-sans font-bold text-ink">
            {copy.paymentHeading}
          </h2>
          <p className="mt-3 rounded-control border border-tertiary bg-tertiary-soft p-4 text-sm">
            <span className="block font-medium text-ink">{copy.cashOnDelivery}</span>
            <span className="mt-0.5 block text-ink-muted">{copy.cashNote}</span>
          </p>
        </section>
      </div>

      <div>
        <OrderSummary
          lines={lines}
          action={
            <button
              type="button"
              onClick={place}
              disabled={!selected || adding || placing}
              className="mt-5 w-full rounded-control bg-tertiary px-6 py-3.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover disabled:pointer-events-none disabled:opacity-50"
            >
              {placing ? copy.placing : copy.place}
            </button>
          }
        />
        {!selected && !adding && <p className="mt-3 text-sm text-ink-muted">{copy.needAddress}</p>}
        {failure && (
          <p role="alert" className="mt-3 text-sm font-medium text-danger">
            {failure}
          </p>
        )}
      </div>
    </div>
  );
}
