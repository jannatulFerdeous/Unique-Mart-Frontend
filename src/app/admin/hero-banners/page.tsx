import type { Metadata } from "next";
import { HeroBannersScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Hero banners" };

export default function AdminHeroBannersPage() {
  return <HeroBannersScreen />;
}
