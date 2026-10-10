import type { Metadata } from "next";
import { AttributesScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Attributes" };

// `?group=<id>` opens the list filtered to one group (linked from Attribute groups).
export default async function AdminAttributesPage({ searchParams }: PageProps<"/admin/attributes">) {
  const { group } = await searchParams;
  return <AttributesScreen initialGroup={typeof group === "string" ? group : ""} />;
}
