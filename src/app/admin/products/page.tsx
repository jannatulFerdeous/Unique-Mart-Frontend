import type { Metadata } from "next";
import { ProductsScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Products" };

export default function AdminProductsPage() {
  return <ProductsScreen />;
}
