import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { WishlistButton } from "@/common/components/WishlistButton";
import type { Product } from "@/shared/config/catalog";
import { cn } from "@/shared/utils/cn";
import { formatPrice } from "@/shared/utils/price";

type Props = {
  product: Product;
  ribbon?: string;
};

export function ProductCard({ product, ribbon }: Props) {
  const { slug, name, image, brand, price, compareAt, rating, badge } = product;
  const href = `/shop/product/${slug}`;
  const corner = ribbon ?? badge;

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-banner bg-surface">
      {corner ? (
        <span
          className={cn(
            "pointer-events-none absolute -left-9 top-5 z-10 w-32 -rotate-45 py-1 text-center text-[0.625rem] font-bold tracking-wide text-ink-inverse",
            ribbon ? "bg-tertiary" : "bg-inverse-deep",
          )}
        >
          {corner}
        </span>
      ) : null}

      <WishlistButton slug={slug} name={name} />

      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <Image
          src={image}
          alt=""
          sizes="(min-width: 1200px) 20vw, (min-width: 800px) 33vw, 50vw"
          className="aspect-square w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col p-2 text-center md:p-4">
        {brand ? (
          <p className="mb-2 font-bold tracking-wider uppercase text-ink-subtle">
            {brand}
          </p>
        ) : null}

        <h3 className="line-clamp-2 min-h-[2.6em] text-xs leading-[1.3] font-semibold text-ink md:text-base">
          <Link href={href} className="hover:underline">
            {name}
          </Link>
        </h3>

        <p className="mt-2 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
          <span className="text-[0.9rem] font-bold text-tertiary md:text-base">
            {formatPrice(price)}
          </span>
          {compareAt ? (
            <s className="text-[0.625rem] text-ink-subtle md:text-xs">
              {formatPrice(compareAt)}
            </s>
          ) : null}
        </p>

        {rating ? (
          <p className="mt-2 flex items-center justify-center gap-1 text-ink-muted">
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

        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="block rounded-full border border-tertiary bg-tertiary-soft py-1.5 text-xs font-medium text-tertiary transition-colors md:text-[0.85rem] hover:bg-tertiary hover:text-tertiary-contrast"
          >
            Buy Now
            <span className="sr-only"> — {name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
