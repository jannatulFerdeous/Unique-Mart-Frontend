import type { Metadata } from "next";
import { NotFoundScreen } from "@/common/components/NotFoundScreen";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function StorefrontNotFound() {
  return <NotFoundScreen />;
}
