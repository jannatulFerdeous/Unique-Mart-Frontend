import type { Metadata } from "next";
import { UsersScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return <UsersScreen />;
}
