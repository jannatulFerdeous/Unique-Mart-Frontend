import type { Metadata } from "next";
import { RefundsScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Refunds" };

export default async function AdminRefundsPage({ searchParams }: PageProps<"/admin/refunds">) {
  const { order } = await searchParams;
  return <RefundsScreen initialOrder={typeof order === "string" ? order : undefined} />;
}
