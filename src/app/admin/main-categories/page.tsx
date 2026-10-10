import type { Metadata } from "next";
import { CatalogScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Main categories" };

export default function AdminMainCategoriesPage() {
  return <CatalogScreen kind="mainCategory" />;
}
