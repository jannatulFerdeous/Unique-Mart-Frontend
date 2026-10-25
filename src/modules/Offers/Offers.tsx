import type { CouponOffer, Offer } from "@/shared/libs/storefront/catalog";
import { OfferCoupons } from "./partials/OfferCoupons";
import { OffersBrowser } from "./partials/OffersBrowser";
import { OffersHero } from "./partials/OffersHero";

export function Offers({ offers, coupons }: { offers: Offer[]; coupons: CouponOffer[] }) {
  // The biggest saving running now: a product's discount or a percentage coupon.
  const topPercent = Math.max(offers[0]?.percent ?? 0, ...coupons.map((coupon) => coupon.percent ?? 0));

  return (
    <>
      <OffersHero topPercent={topPercent} count={offers.length} />
      {coupons.length > 0 && <OfferCoupons coupons={coupons} />}
      <OffersBrowser offers={offers} />
    </>
  );
}
