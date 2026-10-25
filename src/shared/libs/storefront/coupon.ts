// What a coupon takes off a basket, worked out from the active coupons and
// the catalogue. The backend's createOrder applies the same rules when the
// order goes in; keep the two in step.

import { refId } from "@/redux/features/catalog/catalog.types";
import { formatPrice } from "@/shared/utils/price";
import { couponHeadline, couponTerms, type ActiveCoupon, type Catalog } from "./catalog";

// One basket line: the product and what the line costs after its discount.
export type CouponLine = { productId: string; total: number };

export type CouponCheck = { ok: true; code: string; discount: number } | { ok: false; reason: string };

// A coupon as checkout lists it, with what it would do to this basket.
export type BasketCoupon = {
  code: string;
  headline: string;
  description: string | null;
  terms: string[];
  check: CouponCheck;
};

export const normalizeCode = (code: string) => code.trim().toUpperCase();

const evaluate = (catalog: Catalog, coupon: ActiveCoupon, lines: CouponLine[]): CouponCheck => {
  const products = new Set(coupon.applicableProducts.map(String));
  const categories = new Set(coupon.applicableCategories.map((each) => each._id));
  const mains = new Set(coupon.applicableMainCategories.map((each) => each._id));
  const restricted = products.size + categories.size + mains.size > 0;
  const byId = new Map(catalog.products.map((product) => [product._id, product]));

  // With no products or categories named, the coupon covers the whole basket.
  const applies = (productId: string) => {
    if (!restricted) return true;
    const product = byId.get(productId);
    return (
      products.has(productId) ||
      (!!product && (categories.has(refId(product.categoryId)) || mains.has(refId(product.mainCategoryId))))
    );
  };
  const eligible = lines.filter((line) => applies(line.productId)).reduce((sum, line) => sum + line.total, 0);

  if (eligible <= 0) return { ok: false, reason: "Doesn't apply to anything in your basket." };
  if (coupon.minimumOrderAmount && eligible < coupon.minimumOrderAmount) {
    const short = formatPrice(coupon.minimumOrderAmount - eligible);
    return {
      ok: false,
      reason: restricted ? `Add ${short} more of the products it covers to use it.` : `Add ${short} more to use it.`,
    };
  }

  const off =
    coupon.discountType === "percentage"
      ? Math.min((eligible * coupon.discountValue) / 100, coupon.maximumDiscountAmount ?? Infinity)
      : coupon.discountValue;

  return { ok: true, code: coupon.code, discount: Math.round(Math.min(off, eligible)) };
};

// A code the shopper typed.
export const checkCoupon = (catalog: Catalog, coupons: ActiveCoupon[], code: string, lines: CouponLine[]): CouponCheck => {
  const coupon = coupons.find((each) => each.code === normalizeCode(code));
  return coupon ? evaluate(catalog, coupon, lines) : { ok: false, reason: "That code isn't valid or has expired." };
};

// Every active coupon, the ones that work on this basket first, biggest saving first.
export const basketCoupons = (catalog: Catalog, coupons: ActiveCoupon[], lines: CouponLine[]): BasketCoupon[] =>
  coupons
    .map((coupon) => ({
      code: coupon.code,
      headline: couponHeadline(coupon),
      description: coupon.description?.trim() || null,
      terms: couponTerms(coupon),
      check: evaluate(catalog, coupon, lines),
    }))
    .sort((a, b) => (b.check.ok ? b.check.discount : -1) - (a.check.ok ? a.check.discount : -1));
