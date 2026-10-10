import type { Metadata } from "next";
import { UserFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Edit user" };

export default async function AdminEditUserPage({ params }: PageProps<"/admin/users/[id]/edit">) {
  const { id } = await params;
  return <UserFormScreen id={id} />;
}
