import type { Metadata } from "next";
import { OrderDetailScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Order" };

export default async function AccountOrderPage({ params, searchParams }: PageProps<"/account/orders/[id]">) {
  const [{ id }, { placed }] = await Promise.all([params, searchParams]);
  return <OrderDetailScreen id={id} placed={placed === "1"} />;
}
