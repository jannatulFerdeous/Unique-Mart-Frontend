"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Stars } from "@/common/components/Stars";
import { WishlistButton } from "@/common/components/WishlistButton";
import { MAX_QUANTITY, add as addToCart } from "@/shared/libs/cart";
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
  const router = useRouter();
  const { summary } = useReviews(product.slug);
  const [color, setColor] = useState<number | null>(null);
  const [image, setImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [nagging, setNagging] = useState(false);
  const [added, setAdded] = useState(false);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [emi, setEmi] = useState(false);

  const gallery = detail?.gallery?.length ? detail.gallery : [product.image];

  const colors = detail?.colors ?? [];
  const needsColor = colors.length > 0 && color === null;
  const chosenColor = color === null ? null : (colors[color]?.name ?? null);

  const pickColor = (index: number) => {
    setColor(index);
    setNagging(false);
    setAdded(false);
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
            <span className="text-ink-muted">
              {labels.color}:
              {chosenColor ? (
                <span className="ml-1 font-medium text-ink">{chosenColor}</span>
              ) : null}
            </span>
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

        {!needsColor ? (
          <div className="mt-6 flex items-center gap-3">
            <span className="text-ink-muted">{labels.quantity}:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQuantity((n) => Math.max(1, n - 1))}
                disabled={quantity <= 1}
                aria-label={labels.decrease}
                className="grid size-9 place-items-center rounded-control bg-surface-muted text-ink transition-colors hover:bg-line disabled:opacity-40"
              >
                <Minus className="size-4" aria-hidden />
              </button>

              <span
                aria-live="polite"
                className="min-w-10 text-center font-medium text-ink tabular-nums"
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((n) => Math.min(MAX_QUANTITY, n + 1))}
                disabled={quantity >= MAX_QUANTITY}
                aria-label={labels.increase}
                className="grid size-9 place-items-center rounded-control bg-surface-muted text-ink transition-colors hover:bg-line disabled:opacity-40"
              >
                <Plus className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        ) : null}

        {nagging && needsColor ? (
          <p role="alert" className="mt-5 font-medium text-danger">
            {labels.selectColorFirst}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {!needsColor ? (
            <button
              type="button"
              onClick={() => {
                addToCart({
                  slug: product.slug,
                  name: product.name,
                  unitPrice: product.price,
                  color: chosenColor,
                  options: Object.fromEntries(
                    (detail?.options ?? []).map((group) => [
                      group.label,
                      group.values[picks[group.label] ?? 0],
                    ]),
                  ),
                  quantity,
                });
                setAdded(true);
              }}
              className="rounded-control bg-surface-muted px-6 py-3.5 font-bold text-ink transition-colors hover:bg-line sm:px-12"
            >
              {labels.addToCart}
              <span className="sr-only"> — {product.name}</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => {
              if (needsColor) {
                setNagging(true);
                return;
              }
              addToCart({
                slug: product.slug,
                name: product.name,
                unitPrice: product.price,
                color: chosenColor,
                options: Object.fromEntries(
                  (detail?.options ?? []).map((group) => [
                    group.label,
                    group.values[picks[group.label] ?? 0],
                  ]),
                ),
                quantity,
              });
              router.push("/cart");
            }}
            className="rounded-control bg-tertiary px-6 py-3.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover sm:px-12"
          >
            {labels.buyNow}
            <span className="sr-only"> — {product.name}</span>
          </button>

          <WishlistButton variant="inline" slug={product.slug} name={product.name} />
        </div>

        {added ? (
          <p role="status" className="mt-3 text-sm font-medium text-ink">
            {labels.added}{" "}
            <Link href="/cart" className="text-tertiary underline">
              {labels.viewCart}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
