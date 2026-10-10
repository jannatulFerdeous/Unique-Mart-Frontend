import type { Metadata } from "next";
import { AttributeGroupFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Add attribute group" };

export default function AdminNewAttributeGroupPage() {
  return <AttributeGroupFormScreen />;
}
