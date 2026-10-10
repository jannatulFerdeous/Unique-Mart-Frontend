import type { Metadata } from "next";
import { CatalogScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Brands" };

export default function AdminBrandsPage() {
  return <CatalogScreen kind="brand" />;
}
