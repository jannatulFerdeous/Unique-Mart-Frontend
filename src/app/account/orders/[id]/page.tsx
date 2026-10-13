import type { Metadata } from "next";
import { OrderDetailScreen } from "@/modules/AdminPortal";
import { PAYMENT_RESULTS } from "@/redux/features/payment/payment.types";

export const metadata: Metadata = { title: "Order" };

export default async function AccountOrderPage({ params, searchParams }: PageProps<"/account/orders/[id]">) {
  const [{ id }, { placed, payment }] = await Promise.all([params, searchParams]);
  const paid = PAYMENT_RESULTS.find((result) => result === payment);
  return <OrderDetailScreen id={id} placed={placed === "1"} paid={paid} />;
}
