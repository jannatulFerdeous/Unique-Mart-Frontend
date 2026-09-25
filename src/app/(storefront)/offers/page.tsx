import type { Metadata } from "next";
import { Offers } from "@/modules/Offers";
import { offers } from "@/shared/config/products";

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Every product reduced at Unique Mart right now, biggest saving first. Official products, 0% EMI on eligible purchases, nationwide delivery.",
};

export default function OffersPage() {
  return <Offers offers={offers} />;
}
