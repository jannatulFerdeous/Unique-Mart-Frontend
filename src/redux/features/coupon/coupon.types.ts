// Mirror the backend enums in `coupon.constant.ts`.
export const DISCOUNT_TYPES = ["percentage", "fixed"] as const;
export const COUPON_STATUSES = ["active", "inactive"] as const;

export type DiscountType = (typeof DISCOUNT_TYPES)[number];
export type CouponStatus = (typeof COUPON_STATUSES)[number];

type Named = { _id: string; name: string; slug: string };

// Mirrors the backend Coupon document; the list and single routes populate
// the "applies to" references.
export type Coupon = {
  _id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  applicableProducts: (Named | string)[];
  applicableCategories: (Named | string)[];
  applicableMainCategories: (Named | string)[];
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number | null;
  startDate: string;
  endDate: string;
  status: CouponStatus;
  createdAt: string;
  updatedAt: string;
};

// Mirrors the backend `createCouponValidationSchema`.
export type CouponFields = {
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  applicableProducts: string[];
  applicableCategories: string[];
  applicableMainCategories: string[];
  usageLimit: number | null;
  perUserLimit: number | null;
  startDate: string;
  endDate: string;
  status: CouponStatus;
};

export type SaveCouponArgs = { id?: string; fields: Partial<CouponFields> };

export const COUPON_LIMITS = { code: { min: 3, max: 50 }, description: 500 } as const;

export const idsOf = (refs: (Named | string)[]) => refs.map((ref) => (typeof ref === "string" ? ref : ref._id));
