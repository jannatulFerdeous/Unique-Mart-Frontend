import Link from "next/link";
import { TicketPercent } from "lucide-react";
import { ProductCard } from "@/common/components/ProductCard";
import type { CouponOffer } from "@/shared/libs/storefront/catalog";
import { offers_data } from "../config/constants";
import { CopyCode } from "./CopyCode";

// Coupons running now: the code, what it takes off, the terms, and where it
// applies, with the products it names.
export function OfferCoupons({ coupons }: { coupons: CouponOffer[] }) {
  const { couponsTitle, couponsBody, couponCode, appliesTo, appliesEverything, seeAll } = offers_data;

  return (
    <section aria-labelledby="offer-coupons" className="pb-10">
      <div className="container-page">
        <div className="border-b border-line pb-4">
          <h2 id="offer-coupons" className="flex items-center gap-2 font-sans font-bold text-ink">
            <TicketPercent className="size-5 text-tertiary" aria-hidden />
            {couponsTitle}
          </h2>
          <p className="mt-1 text-ink-muted">{couponsBody}</p>
        </div>

        <ul className="mt-6 flex flex-col gap-6">
          {coupons.map((coupon) => (
            <li key={coupon.id} className="rounded-card border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-sans text-2xl font-bold text-tertiary">{coupon.headline}</p>
                  {coupon.description && <p className="mt-1 text-ink">{coupon.description}</p>}
                  <p className="mt-2 text-sm text-ink-muted">{coupon.terms.join(" · ")}</p>
                  <p className="mt-2 text-sm text-ink-muted">
                    {appliesTo}{" "}
                    {coupon.places.length === 0 && coupon.products.length === 0
                      ? appliesEverything
                      : coupon.places.map((place, index) => (
                          <span key={place.href}>
                            {index > 0 && ", "}
                            <Link href={place.href} className="font-medium text-tertiary hover:underline">
                              {place.name}
                            </Link>
                          </span>
                        ))}
                  </p>
                </div>
                <div className="shrink-0">
                  <p className="mb-1 text-xs font-medium tracking-wider text-ink-subtle uppercase">{couponCode}</p>
                  <CopyCode code={coupon.code} />
                </div>
              </div>

              {coupon.products.length > 0 && (
                <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {coupon.products.map((product) => (
                    <li key={product.slug} className="flex h-full flex-col">
                      <ProductCard product={product} />
                    </li>
                  ))}
                </ul>
              )}
              {coupon.productCount > coupon.products.length && coupon.places[0] && (
                <p className="mt-4 text-right">
                  <Link href={coupon.places[0].href} className="font-medium text-tertiary hover:underline">
                    {seeAll.replace("{n}", String(coupon.productCount))}
                  </Link>
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
