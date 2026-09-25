import type { Metadata } from "next";
import { Wishlist } from "@/modules/Wishlist";

export const metadata: Metadata = {
  title: "Your wishlist",
  description: "Products you have saved at Unique Mart.",
  // Personal, and there is nothing here to rank for.
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return <Wishlist />;
}
