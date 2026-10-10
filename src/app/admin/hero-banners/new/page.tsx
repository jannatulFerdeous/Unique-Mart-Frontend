import type { Metadata } from "next";
import { HeroBannerFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Add hero banner" };

export default function AdminNewHeroBannerPage() {
  return <HeroBannerFormScreen />;
}
