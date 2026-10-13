import type { Metadata } from "next";
import { OrderStatusScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const { order } = await searchParams;
  return <OrderStatusScreen initialOrder={typeof order === "string" ? order : undefined} />;
}
