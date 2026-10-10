import type { Metadata } from "next";
import { OrdersScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "My Orders" };

export default function AccountOrdersPage() {
  return <OrdersScreen />;
}
