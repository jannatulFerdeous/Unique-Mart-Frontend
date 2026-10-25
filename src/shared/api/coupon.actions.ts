"use server";

import {
  basketCoupons,
  checkCoupon,
  type BasketCoupon,
  type CouponCheck,
  type CouponLine,
} from "@/shared/libs/storefront/coupon";
import { getActiveCoupons, getCatalog } from "./storefront";

// Checkout's coupons run here, next to the cached catalogue, because the cart
// route doesn't send product categories. They only read public data (active
// coupons and products), so need no sign-in.

const toBasket = (lines: unknown): CouponLine[] =>
  Array.isArray(lines)
    ? lines.flatMap((line) =>
        line && typeof line.productId === "string" && Number.isFinite(line.total) && line.total > 0
          ? [{ productId: line.productId, total: Number(line.total) }]
          : [],
      )
    : [];

// Every coupon running now, with what each would take off this basket.
export async function listCoupons(lines: unknown): Promise<BasketCoupon[]> {
  const [catalog, coupons] = await Promise.all([getCatalog(), getActiveCoupons()]);
  return basketCoupons(catalog, coupons, toBasket(lines));
}

// A code the shopper typed.
export async function applyCoupon(code: unknown, lines: unknown): Promise<CouponCheck> {
  if (typeof code !== "string" || !code.trim()) return { ok: false, reason: "Enter a coupon code." };
  const [catalog, coupons] = await Promise.all([getCatalog(), getActiveCoupons()]);
  return checkCoupon(catalog, coupons, code, toBasket(lines));
}
