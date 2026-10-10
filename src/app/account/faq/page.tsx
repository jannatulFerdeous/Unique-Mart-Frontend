import type { Metadata } from "next";
import { AccountFaqScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "FAQ" };

export default function AccountFaqPage() {
  return <AccountFaqScreen />;
}
