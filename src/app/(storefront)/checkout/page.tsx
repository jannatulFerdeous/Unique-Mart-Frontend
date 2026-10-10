import type { Metadata } from "next";
import { Checkout } from "@/modules/Checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Choose where to deliver and place your Unique Mart order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <Checkout />;
}
