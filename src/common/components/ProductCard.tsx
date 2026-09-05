import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/shared/config/catalog";
import { formatPrice } from "@/shared/utils/price";

export function ProductCard({ product }: { product: Product }) {
  const { slug, name, image, brand, price, compareAt, rating, badge } = product;
  const href = `/shop/product/${slug}`;

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-banner bg-surface">
      {badge ? (
        // Diagonal corner ribbon. -rotate-45 across an over-wide bar, clipped by
        // the card's overflow-hidden.
        <span className="pointer-events-none absolute -left-9 top-5 z-10 w-32 -rotate-45 bg-inverse-deep py-1 text-center text-[0.625rem] font-bold tracking-wide text-ink-inverse">
          {badge}
        </span>
      ) : null}

      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <Image
          src={image}
          alt=""
          sizes="(min-width: 1200px) 20vw, (min-width: 800px) 33vw, 50vw"
          className="aspect-square w-full object-cover"
        />
      </Link>

      {/* Type steps at 768, matching the reference: 12/14.4/10/12 below,
          16/16/12/13.6 above. */}
      <div className="flex flex-1 flex-col p-2 text-center md:p-4">
        {/* The reference sets a brand logo here; ours is the wordmark as text,
            so the cards carry no third-party artwork. Rails that are already
            one brand leave it off and the row collapses. */}
        {brand ? (
          <p className="mb-2 text-[0.625rem] font-bold tracking-wider uppercase text-ink-subtle md:text-xs">
            {brand}
          </p>
        ) : null}

        <h3 className="line-clamp-2 min-h-[2.6em] text-xs leading-[1.3] font-semibold text-ink md:text-base">
          <Link href={href} className="hover:underline">
            {name}
          </Link>
        </h3>

        <p className="mt-2 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
          <span className="text-[0.9rem] font-bold text-ink md:text-base">
            {formatPrice(price)}
          </span>
          {compareAt ? (
            <s className="text-[0.625rem] text-ink-subtle md:text-xs">
              {formatPrice(compareAt)}
            </s>
          ) : null}
        </p>

        {rating ? (
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-ink-muted">
            <span className="flex" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-ink stroke-none data-dim:fill-line-strong"
                  data-dim={i < Math.round(rating) ? undefined : ""}
                />
              ))}
            </span>
            ({rating.toFixed(1)})
          </p>
        ) : null}

        {/* mt-auto pins Buy Now to the foot of the card. Without it a card that
            has no rating pulls its button up and the row stops lining up — the
            rating is the one optional row above it. */}
        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="block rounded-full border border-ink bg-primary-soft py-1.5 text-xs font-medium text-ink transition-colors md:text-[0.85rem] hover:bg-primary hover:text-primary-contrast"
          >
            Buy Now
            <span className="sr-only"> — {name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
