import type { Metadata } from "next";
import { AttributeFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Add attribute" };

export default function AdminNewAttributePage() {
  return <AttributeFormScreen />;
}
