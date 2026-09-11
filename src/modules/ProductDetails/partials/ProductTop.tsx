"use client";

import { useState } from "react";
import { Stars } from "@/common/components/Stars";
import type { Product, ProductDetail } from "@/shared/config/catalog";
import { useReviews } from "@/shared/libs/reviews";
import { cn } from "@/shared/utils/cn";
import { formatPrice } from "@/shared/utils/price";
import { product_details_data } from "../config/constants";
import { ProductGallery } from "./ProductGallery";

type Props = {
  product: Product;
  detail?: ProductDetail;
};

export function ProductTop({ product, detail }: Props) {
  const { labels, reviews: reviewCopy } = product_details_data;
  // The score here is what customers actually left, not the number the
  // catalogue was seeded with — so it agrees with the Reviews tab below.
  const { summary } = useReviews(product.slug);
  const [color, setColor] = useState(0);
  const [image, setImage] = useState(0);
  // One selected index per variant axis, keyed by the axis label.
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [emi, setEmi] = useState(false);

  const gallery = detail?.gallery?.length ? detail.gallery : [product.image];

  // A colour owns the first shot of its variant, so picking one scrolls the
  // gallery to that colour's photos. Products whose colours carry no image of
  // their own just leave the stage where it is.
  const pickColor = (index: number) => {
    setColor(index);
    const shot = detail?.colors?.[index]?.image;
    if (!shot) return;
    const found = gallery.findIndex((each) => each.src === shot.src);
    if (found >= 0) setImage(found);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      <ProductGallery
        images={gallery}
        name={product.name}
        active={image}
        onSelect={setImage}
      />

      <div>
        {product.brand ? (
          <p className="font-bold tracking-wider uppercase text-ink-subtle">
            {product.brand}
          </p>
        ) : null}

        <h1 className="mt-1 font-sans font-bold text-ink">{product.name}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-ink-muted">
            {labels.status}{" "}
            <span className="font-bold text-ink">
              {detail?.inStock === false ? labels.outOfStock : labels.inStock}
            </span>
          </p>

          {summary.average !== null ? (
            <p className="flex items-center gap-1 text-ink-muted">
              <Stars value={summary.average} />({summary.average.toFixed(1)}
              {" · "}
              {summary.count === 1
                ? reviewCopy.countOne
                : reviewCopy.countMany.replace("{n}", String(summary.count))}
              )
            </p>
          ) : null}
        </div>

        <p className="mt-4 flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-bold text-tertiary md:text-3xl">
            {formatPrice(product.price)}
          </span>
          {product.compareAt ? (
            <s className="text-ink-subtle">{formatPrice(product.compareAt)}</s>
          ) : null}
        </p>

        {detail?.highlights?.length ? (
          <ul className="mt-5 list-disc space-y-1 pl-5 text-ink-muted marker:text-line-strong">
            {detail.highlights.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}

        {detail?.colors?.length ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-ink-muted">{labels.color}:</span>
            <ul className="flex flex-wrap gap-2">
              {detail.colors.map((option, index) => (
                <li key={option.name}>
                  <button
                    type="button"
                    onClick={() => pickColor(index)}
                    aria-pressed={index === color}
                    title={option.name}
                    className={cn(
                      "block size-9 rounded-full border-2 transition-colors",
                      index === color ? "border-tertiary" : "border-line",
                    )}
                  >
                    <span
                      className="block size-full rounded-full border border-line"
                      style={{ backgroundColor: option.hex }}
                    />
                    <span className="sr-only">{option.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Storage, memory, dial size, strap size — one row per axis the
            catalogue actually records for this product. */}
        {detail?.options?.map((group) => {
          const chosen = picks[group.label] ?? 0;

          return (
            <div
              key={group.label}
              className="mt-5 flex flex-wrap items-center gap-3"
            >
              <span className="text-ink-muted">{group.label}:</span>
              <ul className="flex flex-wrap gap-2">
                {group.values.map((value, index) => (
                  <li key={value}>
                    <button
                      type="button"
                      onClick={() =>
                        setPicks((prev) => ({ ...prev, [group.label]: index }))
                      }
                      aria-pressed={index === chosen}
                      className={cn(
                        "rounded-control border px-4 py-2 text-sm transition-colors",
                        index === chosen
                          ? "border-tertiary bg-tertiary-soft font-medium text-tertiary"
                          : "border-line text-ink-muted hover:border-line-strong",
                      )}
                    >
                      {value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Two payment options, as the reference has — but ours assert only
            what the trust strip already does. No warranty row and no gift. */}
        <fieldset className="mt-7">
          <legend className="sr-only">Payment option</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setEmi(false)}
              aria-pressed={!emi}
              className={cn(
                "border p-4 text-left transition-colors",
                !emi
                  ? "border-tertiary bg-tertiary-soft"
                  : "border-line bg-surface hover:border-line-strong",
              )}
            >
              <span className="block font-bold text-tertiary">
                {formatPrice(product.price)}
              </span>
              <span className="mt-1 block font-medium text-ink">
                {labels.cashPrice}
              </span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                {labels.cashNote}
              </span>
            </button>

            {detail?.emi ? (
              <button
                type="button"
                onClick={() => setEmi(true)}
                aria-pressed={emi}
                className={cn(
                  "border p-4 text-left transition-colors",
                  emi
                    ? "border-tertiary bg-tertiary-soft"
                    : "border-line bg-surface hover:border-line-strong",
                )}
              >
                <span className="block text-sm text-ink-muted">
                  {labels.emiFrom}
                </span>
                <span className="block font-bold text-tertiary">
                  {formatPrice(detail.emi.perMonth)}/month
                </span>
                <span className="mt-1 block font-medium text-ink">
                  {labels.emiPrice}:{" "}
                  {formatPrice(product.compareAt ?? product.price)}
                </span>
                <span className="mt-0.5 block text-sm text-ink-muted">
                  Up to {detail.emi.months} months
                </span>
              </button>
            ) : null}
          </div>
        </fieldset>

        {detail?.emi ? (
          <p className="mt-3 text-sm text-ink-subtle">{labels.emiNote}</p>
        ) : null}

        <button
          type="button"
          className="mt-6 w-full rounded-control bg-tertiary px-6 py-3.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover sm:w-auto sm:px-16"
        >
          {labels.buyNow}
          <span className="sr-only"> — {product.name}</span>
        </button>
      </div>
    </div>
  );
}
