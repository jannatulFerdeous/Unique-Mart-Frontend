"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Trash2 } from "lucide-react";
import { add as addToCart, useCart } from "@/shared/libs/cart";
import { remove } from "@/shared/libs/wishlist";
import { findProduct, productHref } from "@/shared/config/products";
import { findProductDetail } from "@/shared/config/product-details";
import { formatPrice } from "@/shared/utils/price";
import { wishlist_data } from "../config/constants";

/** One saved product: what it is, what it costs, and the two things you can do
 *  with it — move it along, or let it go. */
export function WishlistRow({ slug }: { slug: string }) {
  const product = findProduct(slug);
  const detail = findProductDetail(slug);
  const { lines } = useCart();

  /* A product can outlive the catalogue entry it was saved from. Say so and
     offer the only useful action rather than rendering a broken row. */
  if (!product) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-5 last:border-0">
        <p className="text-ink-muted">{wishlist_data.gone}</p>
        <button
          type="button"
          onClick={() => remove(slug)}
          className="rounded-control border border-line-strong px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-muted"
        >
          {wishlist_data.remove}
        </button>
      </li>
    );
  }

  /* Colours are the one axis the product page refuses to choose for anyone, so
     a saved product that has them cannot go straight into the basket. */
  const needsChoice = (detail?.colors?.length ?? 0) > 0;
  const alreadyInCart = lines.some((line) => line.slug === slug);

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line py-5 last:border-0 sm:flex-nowrap">
      <Link href={productHref(slug)} className="shrink-0" tabIndex={-1} aria-hidden>
        <Image src={product.image} alt="" sizes="80px" className="size-20 object-contain" />
      </Link>

      <div className="min-w-0 flex-1 basis-48">
        {product.brand ? (
          <p className="text-xs font-bold tracking-wider text-ink-subtle uppercase">
            {product.brand}
          </p>
        ) : null}

        <Link
          href={productHref(slug)}
          className="font-medium text-ink transition-colors hover:text-tertiary"
        >
          {product.name}
        </Link>

        {alreadyInCart && (
          <p className="mt-1 flex items-center gap-1 text-xs text-tertiary">
            <Check className="size-3.5" aria-hidden />
            {wishlist_data.inCart}
          </p>
        )}
      </div>

      <p className="flex flex-wrap items-baseline gap-x-2 text-right">
        <span className="font-bold text-tertiary">{formatPrice(product.price)}</span>
        {product.compareAt ? (
          <s className="text-sm text-ink-subtle">{formatPrice(product.compareAt)}</s>
        ) : null}
      </p>

      {needsChoice ? (
        <Link
          href={productHref(slug)}
          className="rounded-control bg-tertiary px-5 py-2.5 text-sm font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
        >
          {wishlist_data.chooseOptions}
          <span className="sr-only"> — {product.name}</span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => {
            addToCart({
              slug,
              name: product.name,
              unitPrice: product.price,
              color: null,
              options: {},
              quantity: 1,
            });
            /* The product moves rather than being copied: a wishlist is things
               you have not bought, and leaving it in both lists means removing
               it twice. */
            remove(slug);
          }}
          className="rounded-control bg-tertiary px-5 py-2.5 text-sm font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
        >
          {wishlist_data.addToCart}
          <span className="sr-only"> — {product.name}</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => remove(slug)}
        aria-label={wishlist_data.removeOne.replace("{name}", product.name)}
        className="grid size-9 place-items-center rounded-control text-ink-subtle transition-colors hover:bg-danger-soft hover:text-danger"
      >
        <Trash2 className="size-4.5" aria-hidden />
      </button>
    </li>
  );
}
