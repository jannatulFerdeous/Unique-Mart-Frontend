import type { Metadata } from "next";
import { CatalogFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Edit category" };

export default async function AdminEditCategoryPage({ params }: PageProps<"/admin/categories/[slug]/edit">) {
  const { slug } = await params;
  return <CatalogFormScreen kind="category" slug={slug} />;
}
