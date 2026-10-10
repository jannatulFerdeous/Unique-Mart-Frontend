import type { Metadata } from "next";
import { CatalogFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Add category" };

export default function AdminNewCategoryPage() {
  return <CatalogFormScreen kind="category" />;
}
