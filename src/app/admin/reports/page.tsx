import type { Metadata } from "next";
import { ReportsScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Support requests" };

export default function AdminReportsPage() {
  return <ReportsScreen />;
}
