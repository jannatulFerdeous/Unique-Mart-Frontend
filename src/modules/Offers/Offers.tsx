import type { Offer } from "@/shared/config/products";
import { OffersBrowser } from "./partials/OffersBrowser";
import { OffersHero } from "./partials/OffersHero";

export function Offers({ offers }: { offers: Offer[] }) {
  return (
    <>
      <OffersHero
        topPercent={offers[0]?.percent ?? 0}
        count={offers.length}
      />
      <OffersBrowser offers={offers} />
    </>
  );
}
