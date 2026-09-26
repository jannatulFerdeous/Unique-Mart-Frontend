"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/common/components/ProductCard";
import type { Offer } from "@/shared/config/products";
import { cn } from "@/shared/utils/cn";
import { formatPrice } from "@/shared/utils/price";
import { offers_data } from "../config/constants";
import type { OfferSortId } from "../config/types";

export function OffersBrowser({ offers }: { offers: Offer[] }) {
  const { title, countOne, countMany, sortLabel, sorts, tiers, empty, saveLabel } =
    offers_data;

  const [tier, setTier] = useState("all");
  const [sort, setSort] = useState<OfferSortId>("saving");

  const live = useMemo(
    () =>
      tiers.filter(
        (each) => each.min === 0 || offers.some((offer) => offer.percent >= each.min),
      ),
    [tiers, offers],
  );

  const shown = useMemo(() => {
    const min = live.find((each) => each.id === tier)?.min ?? 0;
    const matched = offers.filter((offer) => offer.percent >= min);

    const sorted = [...matched];
    if (sort === "amount") sorted.sort((a, b) => b.saving - a.saving);
    if (sort === "price-asc") sorted.sort((a, b) => a.product.price - b.product.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.product.price - a.product.price);
    return sorted;
  }, [offers, tier, sort, live]);

  return (
    <section aria-labelledby="all-offers" className="pb-16">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <h2 id="all-offers" className="font-sans font-bold text-ink">
            {title}
          </h2>

          <label className="flex items-center gap-2 text-ink-muted">
            <span className="shrink-0">{sortLabel}</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as OfferSortId)}
              className="rounded-control border border-line-strong bg-surface p-2 text-ink"
            >
              {sorts.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {live.length > 1 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <ul className="flex flex-wrap gap-2">
              {live.map((each) => (
                <li key={each.id}>
                  <button
                    type="button"
                    onClick={() => setTier(each.id)}
                    aria-pressed={each.id === tier}
                    className={cn(
                      "rounded-control border px-4 py-2 text-sm transition-colors",
                      each.id === tier
                        ? "border-tertiary bg-tertiary-soft font-medium text-tertiary"
                        : "border-line bg-surface text-ink-muted hover:border-line-strong",
                    )}
                  >
                    {each.label}
                  </button>
                </li>
              ))}
            </ul>

            <p role="status" className="ml-auto text-ink-muted">
              {shown.length === 1
                ? countOne
                : countMany.replace("{n}", String(shown.length))}
            </p>
          </div>
        )}

        {shown.length === 0 ? (
          <p className="py-16 text-center text-ink-muted">{empty}</p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {shown.map((offer) => (
              <li key={offer.product.slug} className="flex h-full flex-col">
                <ProductCard
                  product={offer.product}
                  ribbon={`-${offer.percent}%`}
                />
                <p className="mt-2 text-center text-sm font-medium text-tertiary">
                  {saveLabel} {formatPrice(offer.saving)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
