"use client";

import { useEffect, useState, type FormEvent } from "react";
import { TicketPercent } from "lucide-react";
import { applyCoupon, listCoupons } from "@/shared/api/coupon.actions";
import { lineTotal, type CartLine } from "@/shared/libs/cart";
import type { BasketCoupon } from "@/shared/libs/storefront/coupon";
import { cn } from "@/shared/utils/cn";
import { formatPrice } from "@/shared/utils/price";
import { checkout_data as copy } from "../config/constants";

export type AppliedCoupon = { code: string; amount: number };

// How many coupons show before "Show more".
const SHOWN = 3;

// Every coupon running now, like a voucher list: each says what it would save
// on this basket, or what's missing, and applies with one tap. A code can
// still be typed. The checks run on the server; the order is sent with the code.
export function CouponBox({
  lines,
  applied,
  onApplied,
}: {
  lines: CartLine[];
  applied: AppliedCoupon | null;
  onApplied: (coupon: AppliedCoupon | null) => void;
}) {
  const basket = lines.flatMap((line) =>
    line.productId && !line.missing ? [{ productId: line.productId, total: lineTotal(line) }] : [],
  );
  // The cart hands over new line objects on every render; refetch only when the basket changes.
  const basketKey = JSON.stringify(basket);
  const [listed, setListed] = useState<{ key: string; coupons: BasketCoupon[] | null } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let current = true;
    listCoupons(JSON.parse(basketKey))
      .then((coupons) => current && setListed({ key: basketKey, coupons }))
      .catch(() => current && setListed({ key: basketKey, coupons: null }));
    return () => {
      current = false;
    };
  }, [basketKey]);

  const loading = listed?.key !== basketKey;
  const coupons = loading ? [] : (listed.coupons ?? []);
  // Nothing running: no list, and no code would work either.
  if (!loading && listed.coupons?.length === 0) return null;
  const shown = open ? coupons : coupons.slice(0, SHOWN);

  return (
    <section aria-labelledby="checkout-coupons" className="mt-4 border-b border-line pb-4">
      <h3 id="checkout-coupons" className="flex items-center gap-2 font-sans font-bold text-ink">
        <TicketPercent className="size-4 text-tertiary" aria-hidden />
        {copy.couponsHeading}
      </h3>

      {loading ? (
        <p role="status" className="mt-2 text-sm text-ink-muted">
          {copy.couponsLoading}
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {shown.map((coupon) => (
            <CouponRow
              key={coupon.code}
              coupon={coupon}
              inUse={applied?.code === coupon.code}
              onApply={() => coupon.check.ok && onApplied({ code: coupon.code, amount: coupon.check.discount })}
              onRemove={() => onApplied(null)}
            />
          ))}
        </ul>
      )}

      {coupons.length > SHOWN && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mt-2 text-sm font-medium text-tertiary hover:underline"
        >
          {open ? copy.couponsLess : copy.couponsMore.replace("{n}", String(coupons.length - SHOWN))}
        </button>
      )}

      <CodeForm basket={basket} onApplied={onApplied} />
    </section>
  );
}

function CouponRow({
  coupon,
  inUse,
  onApply,
  onRemove,
}: {
  coupon: BasketCoupon;
  inUse: boolean;
  onApply: () => void;
  onRemove: () => void;
}) {
  const { check } = coupon;

  return (
    <li
      className={cn(
        "rounded-control border p-3 transition-colors",
        inUse ? "border-tertiary bg-tertiary-soft" : "border-line",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={cn("font-bold", check.ok ? "text-tertiary" : "text-ink-muted")}>{coupon.headline}</span>
            <span className="rounded-control border border-dashed border-line-strong px-1.5 py-0.5 font-mono text-xs text-ink">
              {coupon.code}
            </span>
          </p>
          {coupon.description && <p className="mt-1 line-clamp-2 text-sm text-ink">{coupon.description}</p>}
          <p className="mt-1 text-xs text-ink-subtle">{coupon.terms.join(" · ")}</p>
        </div>

        {inUse ? (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 text-sm font-medium text-tertiary hover:underline"
          >
            {copy.couponRemove}
          </button>
        ) : (
          <button
            type="button"
            onClick={onApply}
            disabled={!check.ok}
            aria-label={`${copy.couponUse} ${coupon.code}`}
            className="shrink-0 rounded-control bg-tertiary px-3 py-1.5 text-sm font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover disabled:pointer-events-none disabled:bg-surface-muted disabled:text-ink-subtle"
          >
            {copy.couponUse}
          </button>
        )}
      </div>

      <p className={cn("mt-2 text-xs font-medium", check.ok ? "text-tertiary" : "text-ink-muted")}>
        {check.ok
          ? `${inUse ? `${copy.couponInUse} · ` : ""}${copy.couponSaves.replace("{amount}", formatPrice(check.discount))}`
          : check.reason}
      </p>
    </li>
  );
}

// "Have a code?": for a code the shopper was given.
function CodeForm({
  basket,
  onApplied,
}: {
  basket: { productId: string; total: number }[];
  onApplied: (coupon: AppliedCoupon) => void;
}) {
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!code.trim() || checking) return;
    setChecking(true);
    setProblem(null);
    try {
      const result = await applyCoupon(code, basket);
      if (result.ok) {
        onApplied({ code: result.code, amount: result.discount });
        setCode("");
      } else {
        setProblem(result.reason);
      }
    } catch {
      setProblem(copy.couponFailed);
    } finally {
      setChecking(false);
    }
  };

  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-sm font-medium text-ink-muted hover:text-ink">{copy.couponHaveCode}</summary>
      <form onSubmit={submit} className="mt-2">
        <label htmlFor="checkout-coupon" className="sr-only">
          {copy.couponLabel}
        </label>
        <div className="flex gap-2">
          <input
            id="checkout-coupon"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={copy.couponPlaceholder}
            autoComplete="off"
            aria-invalid={problem ? true : undefined}
            aria-describedby={problem ? "checkout-coupon-problem" : undefined}
            className="min-w-0 flex-1 rounded-control border border-line-strong bg-surface px-3 py-2 text-sm text-ink uppercase placeholder:normal-case placeholder:text-ink-subtle"
          />
          <button
            type="submit"
            disabled={!code.trim() || checking}
            className="shrink-0 rounded-control border border-line-strong px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-50"
          >
            {checking ? copy.couponApplying : copy.couponApply}
          </button>
        </div>
        {problem && (
          <p id="checkout-coupon-problem" role="alert" className="mt-1.5 text-sm text-danger">
            {problem}
          </p>
        )}
      </form>
    </details>
  );
}
