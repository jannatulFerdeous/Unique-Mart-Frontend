import type { Metadata } from "next";
import { Offers } from "@/modules/Offers";
import { getCatalog } from "@/shared/api/storefront";
import { toOffers } from "@/shared/libs/storefront/catalog";

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Every product reduced at Unique Mart right now, biggest saving first. Official products, 0% EMI on eligible purchases, nationwide delivery.",
};

export default async function OffersPage() {
  return <Offers offers={toOffers(await getCatalog())} />;
}
