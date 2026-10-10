import type { Metadata } from "next";
import { Cart } from "@/modules/Cart";

export const metadata: Metadata = {
  title: "Your basket",
  description: "What you have picked out at Unique Mart, ready to check out.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <Cart />;
}
