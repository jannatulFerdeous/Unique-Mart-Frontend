import type { Metadata } from "next";
import { UserFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Add user" };

export default function AdminNewUserPage() {
  return <UserFormScreen />;
}
