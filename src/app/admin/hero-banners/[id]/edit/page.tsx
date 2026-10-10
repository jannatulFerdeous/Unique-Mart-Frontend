import type { Metadata } from "next";
import { HeroBannerFormScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Edit hero banner" };

export default async function AdminEditHeroBannerPage({
  params,
}: PageProps<"/admin/hero-banners/[id]/edit">) {
  const { id } = await params;
  return <HeroBannerFormScreen id={id} />;
}
