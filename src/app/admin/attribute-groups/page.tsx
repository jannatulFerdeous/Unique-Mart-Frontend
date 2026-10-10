import type { Metadata } from "next";
import { AttributeGroupsScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Attribute groups" };

export default function AdminAttributeGroupsPage() {
  return <AttributeGroupsScreen />;
}
