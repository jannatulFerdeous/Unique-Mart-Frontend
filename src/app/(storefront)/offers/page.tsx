import type { Metadata } from "next";
import { Offers } from "@/modules/Offers";
import { getActiveCoupons, getCatalog } from "@/shared/api/storefront";
import { toCouponOffers, toOffers } from "@/shared/libs/storefront/catalog";

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Every product reduced at Unique Mart right now, biggest saving first. Official products, 0% EMI on eligible purchases, nationwide delivery.",
};

export default async function OffersPage() {
  const [catalog, coupons] = await Promise.all([getCatalog(), getActiveCoupons()]);
  return <Offers offers={toOffers(catalog)} coupons={toCouponOffers(catalog, coupons)} />;
}
