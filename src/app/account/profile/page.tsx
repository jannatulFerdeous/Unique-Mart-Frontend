import type { Metadata } from "next";
import { ProfileScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Account Info" };

export default function AccountProfilePage() {
  return <ProfileScreen />;
}
