import type { Metadata } from "next";
import { CouponsScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Coupons" };

export default function AdminCouponsPage() {
  return <CouponsScreen />;
}
