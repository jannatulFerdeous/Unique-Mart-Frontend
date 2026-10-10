import type { Metadata } from "next";
import { CouponFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Edit coupon" };

export default async function AdminEditCouponPage({ params }: PageProps<"/admin/coupons/[id]/edit">) {
  const { id } = await params;
  return <CouponFormScreen id={id} />;
}
