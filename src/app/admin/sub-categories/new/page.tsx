import type { Metadata } from "next";
import { CatalogFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Add sub-category" };

export default function AdminNewSubCategoryPage() {
  return <CatalogFormScreen kind="subCategory" />;
}
