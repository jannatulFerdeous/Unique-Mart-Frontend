import type { Metadata } from "next";
import { NewsletterScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Newsletter" };

export default function AdminNewsletterPage() {
  return <NewsletterScreen />;
}
