import type { Metadata } from "next";
import { CouponFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Add coupon" };

export default function AdminNewCouponPage() {
  return <CouponFormScreen />;
}
