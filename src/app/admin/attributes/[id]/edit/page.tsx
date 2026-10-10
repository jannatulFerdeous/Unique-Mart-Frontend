import type { Metadata } from "next";
import { AttributeFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Edit attribute" };

export default async function AdminEditAttributePage({ params }: PageProps<"/admin/attributes/[id]/edit">) {
  const { id } = await params;
  return <AttributeFormScreen id={id} />;
}
