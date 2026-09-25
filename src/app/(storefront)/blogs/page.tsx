import type { Metadata } from "next";
import { Blogs } from "@/modules/Blogs";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Buying guides, comparisons and product news from Unique Mart.",
};

export default function BlogsPage() {
  return <Blogs />;
}
