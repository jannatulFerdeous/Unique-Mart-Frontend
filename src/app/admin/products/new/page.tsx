import type { Metadata } from "next";
import { ProductFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Add product" };

export default function AdminNewProductPage() {
  return <ProductFormScreen />;
}
