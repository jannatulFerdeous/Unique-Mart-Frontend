import type { CouponOffer, Offer } from "@/shared/libs/storefront/catalog";
import { OfferCoupons } from "./partials/OfferCoupons";
import { OffersBrowser } from "./partials/OffersBrowser";
import { OffersHero } from "./partials/OffersHero";

export function Offers({ offers, coupons }: { offers: Offer[]; coupons: CouponOffer[] }) {
  return (
    <>
      <OffersHero
        topPercent={offers[0]?.percent ?? 0}
        count={offers.length}
      />
      {coupons.length > 0 && <OfferCoupons coupons={coupons} />}
      <OffersBrowser offers={offers} />
    </>
  );
}
