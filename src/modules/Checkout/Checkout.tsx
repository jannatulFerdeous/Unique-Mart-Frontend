"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, MapPin, Plus } from "lucide-react";
// Only the form, not the whole dashboard module.
import { AddressForm, ADDRESS_LABEL_NAME } from "@/modules/AdminPortal/components/AddressForm";
import { CartNotice, OrderSummary } from "@/modules/Cart";
import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { apiErrorMessage } from "@/redux/api/errors";
import { useGetAddressesQuery } from "@/redux/features/address/addressApi";
import type { Address } from "@/redux/features/address/address.types";
import { useCreateOrderMutation } from "@/redux/features/order/orderApi";
import { useCreatePaymentMutation } from "@/redux/features/payment/paymentApi";
import { PAYMENT_METHODS, type PaymentMethod } from "@/redux/features/payment/payment.types";
import { deliveryChargeFor } from "@/shared/config/shipping";
import { useCart, type CartLine } from "@/shared/libs/cart";
import { goToPayment, openPaymentWindow, usePaymentPopup } from "@/shared/libs/paymentPopup";
import { useSignInFirst } from "@/shared/libs/useSignInFirst";
import { cn } from "@/shared/utils/cn";
import { formatPrice } from "@/shared/utils/price";
import { COUPONS_AT_CHECKOUT, checkout_data as copy } from "./config/constants";
import { CouponBox, type AppliedCoupon } from "./partials/CouponBox";

const primaryAction =
  "mt-2 rounded-control bg-tertiary px-6 py-3 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover";

export function Checkout() {
  const router = useRouter();
  const { signedIn, goSignIn } = useSignInFirst();
  const cart = useCart();
  const addresses = useGetAddressesQuery(undefined, { skip: !signedIn });
  // The basket as it was when the order went in. The backend empties the cart,
  // but the page stays here while the shopper pays in the pop-up.
  const [held, setHeld] = useState<CartLine[] | null>(null);
  const lines = held ?? cart.lines;
  const payment = usePaymentPopup((orderId, result) => router.push(`/account/orders/${orderId}?payment=${result}`));

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
        ) : !held && (cart.isLoading || addresses.isLoading) ? (
          <CartNotice title={copy.loading} />
        ) : !held && (cart.isError || addresses.isError) ? (
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
        ) : lines.length === 0 ? (
          <CartNotice title={copy.emptyTitle} body={copy.emptyBody}>
            <Link href="/" className={primaryAction}>
              {copy.emptyAction}
            </Link>
          </CartNotice>
        ) : (
          <CheckoutForm addresses={addresses.data ?? []} lines={lines} onHold={setHeld} payment={payment} />
        )}
      </div>
    </>
  );
}

function CheckoutForm({
  addresses,
  lines,
  onHold,
  payment,
}: {
  addresses: Address[];
  lines: CartLine[];
  onHold: (lines: CartLine[] | null) => void;
  payment: ReturnType<typeof usePaymentPopup>;
}) {
  const router = useRouter();
  const [chosen, setChosen] = useState<string | null>(null);
  const [adding, setAdding] = useState(addresses.length === 0);
  const [method, setMethod] = useState<PaymentMethod>("sslcommerz");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  // An order that went in but whose payment couldn't be started.
  const [unpaid, setUnpaid] = useState<{ orderId: string; reason: string } | null>(null);
  const [createOrder] = useCreateOrderMutation();
  const [createPayment] = useCreatePaymentMutation();

  // The pick, else the default address, else the first one.
  const selected = addresses.find((each) => each._id === chosen) ?? addresses.find((each) => each.isDefault) ?? addresses[0];
  // Set by the address's district; unknown until there is one.
  const delivery = selected ? deliveryChargeFor(selected) : undefined;

  // Places the order (the backend empties the cart). Cash on delivery goes
  // straight to the order; full payment hands over to SSLCommerz in a pop-up.
  const place = async () => {
    if (!selected) return;
    setFailure(null);
    setLeaving(true);
    // Opened now, during the click, or the browser blocks it.
    const popup = method === "sslcommerz" ? openPaymentWindow() : null;
    onHold(lines);
    let orderId: string;
    try {
      orderId = (await createOrder({
          shippingAddressId: selected._id,
          paymentMethod: method,
          ...(coupon && { couponCode: coupon.code }),
        }).unwrap())._id;
    } catch (problem) {
      popup?.close();
      onHold(null);
      setLeaving(false);
      setFailure(apiErrorMessage(problem, "Couldn't place your order. Please try again."));
      return;
    }
    if (method === "cod") {
      router.push(`/account/orders/${orderId}?placed=1`);
      return;
    }
    try {
      const { checkoutUrl } = await createPayment({ orderId }).unwrap();
      // A blocked pop-up sends this whole tab to SSLCommerz instead.
      goToPayment(popup, checkoutUrl);
      if (popup) {
        payment.start(orderId, popup);
        setLeaving(false);
      }
    } catch (problem) {
      popup?.close();
      // The order is placed; say why SSLCommerz didn't open, and it can be paid from its page.
      setLeaving(false);
      setUnpaid({ orderId, reason: apiErrorMessage(problem, copy.unpaidFallback) });
    }
  };

  const shownOrder = payment.orderId ?? unpaid?.orderId;
  if (shownOrder) {
    return (
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="checkout-paying" className="min-w-0 rounded-card border border-line bg-surface p-5">
          <h2 id="checkout-paying" className="flex items-center gap-2 font-sans font-bold text-ink">
            <CreditCard className="size-5 text-tertiary" aria-hidden />
            {unpaid ? copy.unpaidHeading : copy.payingHeading}
          </h2>
          {unpaid ? (
            <>
              <p role="alert" className="mt-3 text-sm font-medium text-danger">
                {unpaid.reason}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{copy.unpaidBody}</p>
            </>
          ) : (
            <p role="status" className="mt-3 text-sm text-ink-muted">
              {payment.closed ? copy.payingClosed : copy.payingBody}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            {!unpaid && !payment.closed && (
              <button
                type="button"
                onClick={payment.focus}
                className="rounded-control bg-tertiary px-5 py-2.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
              >
                {copy.showWindow}
              </button>
            )}
            <Link
              href={`/account/orders/${shownOrder}?placed=1`}
              className="rounded-control border border-line px-5 py-2.5 font-medium text-ink transition-colors hover:border-line-strong"
            >
              {copy.viewOrder}
            </Link>
          </div>
        </section>

        <OrderSummary
          lines={lines}
          delivery={delivery}
          discount={coupon}
          action={unpaid ? false : <p className="mt-5 text-sm text-ink-muted">{copy.methods.sslcommerz.placing}</p>}
        />
      </div>
    );
  }

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
                      <span className="mt-1 block font-medium text-ink tabular-nums">
                        {copy.deliveryTo.replace("{price}", formatPrice(deliveryChargeFor(address)))}
                      </span>
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
          <div role="radiogroup" aria-labelledby="checkout-payment" className="mt-4 grid gap-3 sm:grid-cols-2">
            {PAYMENT_METHODS.map((each) => {
              const current = each === method;
              const Icon = each === "cod" ? Banknote : CreditCard;
              return (
                <label
                  key={each}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-control border p-4 transition-colors",
                    current ? "border-tertiary bg-tertiary-soft" : "border-line hover:border-line-strong",
                  )}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={current}
                    onChange={() => setMethod(each)}
                    className="mt-1 size-4 shrink-0 accent-tertiary"
                  />
                  <span className="min-w-0 text-sm">
                    <span className="flex items-center gap-2 font-medium text-ink">
                      <Icon className="size-4 text-ink-muted" aria-hidden />
                      {copy.methods[each].label}
                    </span>
                    <span className="mt-1 block text-ink-muted">{copy.methods[each].note}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      </div>

      <div>
        <OrderSummary
          lines={lines}
          delivery={delivery}
          discount={coupon}
          coupon={COUPONS_AT_CHECKOUT && <CouponBox lines={lines} applied={coupon} onApplied={setCoupon} />}
          action={
            <button
              type="button"
              onClick={place}
              disabled={!selected || adding || leaving}
              className="mt-5 w-full rounded-control bg-tertiary px-6 py-3.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover disabled:pointer-events-none disabled:opacity-50"
            >
              {leaving ? copy.methods[method].placing : copy.methods[method].place}
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
