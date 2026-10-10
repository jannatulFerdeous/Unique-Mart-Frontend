import type { Metadata } from "next";
import { CatalogScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Sub-categories" };

export default function AdminSubCategoriesPage() {
  return <CatalogScreen kind="subCategory" />;
}
