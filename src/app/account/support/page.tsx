import type { Metadata } from "next";
import { SupportScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Support" };

export default function AccountSupportPage() {
  return <SupportScreen />;
}
