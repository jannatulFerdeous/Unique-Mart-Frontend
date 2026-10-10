import type { Metadata } from "next";
import { Stores } from "@/modules/Stores";

export const metadata: Metadata = {
  title: "Store Locator",
  description:
    "How Unique Mart delivers across Bangladesh, and how to reach us by phone or email.",
};

export default function StoreLocatorPage() {
  return <Stores />;
}
