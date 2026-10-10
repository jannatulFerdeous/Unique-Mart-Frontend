import type { Metadata } from "next";
import { AttributeGroupFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Edit attribute group" };

export default async function AdminEditAttributeGroupPage({ params }: PageProps<"/admin/attribute-groups/[id]/edit">) {
  const { id } = await params;
  return <AttributeGroupFormScreen id={id} />;
}
