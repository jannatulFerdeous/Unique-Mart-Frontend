import type { Metadata } from "next";
import { Stores } from "@/modules/Stores";

export const metadata: Metadata = {
  title: "Store Locator",
  description:
    "Visit the Unique & Smart shop in Gangachara, Rangpur, or order online for delivery anywhere in Bangladesh.",
};

export default function StoreLocatorPage() {
  return <Stores />;
}
