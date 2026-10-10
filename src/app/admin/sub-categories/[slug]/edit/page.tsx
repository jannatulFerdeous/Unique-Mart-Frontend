import type { Metadata } from "next";
import { CatalogFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Edit sub-category" };

export default async function AdminEditSubCategoryPage({ params }: PageProps<"/admin/sub-categories/[slug]/edit">) {
  const { slug } = await params;
  return <CatalogFormScreen kind="subCategory" slug={slug} />;
}
