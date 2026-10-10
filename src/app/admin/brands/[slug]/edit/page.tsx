import type { Metadata } from "next";
import { CatalogFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Edit brand" };

export default async function AdminEditBrandPage({ params }: PageProps<"/admin/brands/[slug]/edit">) {
  const { slug } = await params;
  return <CatalogFormScreen kind="brand" slug={slug} />;
}
