import type { Metadata } from "next";
import { CatalogFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Edit main category" };

export default async function AdminEditMainCategoryPage({ params }: PageProps<"/admin/main-categories/[slug]/edit">) {
  const { slug } = await params;
  return <CatalogFormScreen kind="mainCategory" slug={slug} />;
}
