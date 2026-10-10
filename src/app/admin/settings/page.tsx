import type { Metadata } from "next";
import { SettingsScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return <SettingsScreen />;
}
