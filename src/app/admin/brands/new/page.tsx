import type { Metadata } from "next";
import { CatalogFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Add brand" };

export default function AdminNewBrandPage() {
  return <CatalogFormScreen kind="brand" />;
}
