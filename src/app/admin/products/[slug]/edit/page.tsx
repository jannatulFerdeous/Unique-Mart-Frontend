import type { Metadata } from "next";
import { ProductFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Edit product" };

export default async function AdminEditProductPage({ params }: PageProps<"/admin/products/[slug]/edit">) {
  const { slug } = await params;
  return <ProductFormScreen slug={slug} />;
}
