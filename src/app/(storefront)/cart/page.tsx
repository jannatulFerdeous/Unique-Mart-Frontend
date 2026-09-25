import type { Metadata } from "next";
import { Cart } from "@/modules/Cart";

export const metadata: Metadata = {
  title: "Your basket",
  description: "What you have picked out at Unique Mart, ready to check out.",
  // A basket is personal and has nothing to rank for.
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <Cart />;
}
