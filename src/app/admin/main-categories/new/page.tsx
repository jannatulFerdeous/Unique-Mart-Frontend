import type { Metadata } from "next";
import { CatalogFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Add main category" };

export default function AdminNewMainCategoryPage() {
  return <CatalogFormScreen kind="mainCategory" />;
}
