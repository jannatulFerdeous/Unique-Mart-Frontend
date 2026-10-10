import type { Metadata } from "next";
import { Unsubscribe } from "@/modules/Newsletter";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Stop getting the Unique Mart newsletter.",
  robots: { index: false, follow: true },
};

export default function NewsletterPage() {
  return <Unsubscribe />;
}
