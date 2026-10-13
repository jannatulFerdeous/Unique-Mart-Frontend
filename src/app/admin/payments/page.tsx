import type { Metadata } from "next";
import { PaymentsScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Payments" };

export default function AdminPaymentsPage() {
  return <PaymentsScreen />;
}
