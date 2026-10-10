import type { Metadata } from "next";
import { CatalogScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return <CatalogScreen kind="category" />;
}
