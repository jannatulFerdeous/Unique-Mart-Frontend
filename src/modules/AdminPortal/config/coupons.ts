import type { Coupon } from "@/redux/features/coupon/coupon.types";
import { formatPrice } from "@/shared/utils/price";
import type { Tone } from "./types";

export const COUPONS_HREF = "/admin/coupons";

export const COUPONS_BLURB = "Discount codes: how much they take off, what they apply to and when they run.";

export const describeDiscount = (coupon: Pick<Coupon, "discountType" | "discountValue" | "maximumDiscountAmount">) =>
  coupon.discountType === "percentage"
    ? `${coupon.discountValue}% off${coupon.maximumDiscountAmount ? `, up to ${formatPrice(coupon.maximumDiscountAmount)}` : ""}`
    : `${formatPrice(coupon.discountValue)} off`;

// Where a coupon stands today, beyond its on/off switch.
export const couponWindow = (coupon: Pick<Coupon, "startDate" | "endDate" | "status" | "usageLimit" | "usedCount">): { label: string; tone: Tone } => {
  const now = Date.now();
  if (coupon.status === "inactive") return { label: "Off", tone: "neutral" };
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) return { label: "Used up", tone: "serious" };
  if (new Date(coupon.endDate).getTime() < now) return { label: "Expired", tone: "critical" };
  if (new Date(coupon.startDate).getTime() > now) return { label: "Scheduled", tone: "warning" };
  return { label: "Running", tone: "good" };
};

// <input type="date"> works in local days; the backend stores instants.
export const toDayInput = (iso: string) => {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const startOfDay = (day: string) => new Date(`${day}T00:00:00`).toISOString();

export const endOfDay = (day: string) => new Date(`${day}T23:59:59`).toISOString();
