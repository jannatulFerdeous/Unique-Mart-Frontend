"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useRemoveFromWishlistMutation, type WishlistEntry } from "@/redux/features/wishlist/wishlistApi";
import { productHref } from "@/shared/libs/storefront/catalog";
import type { ShopProduct } from "@/shared/libs/storefront/useShopProducts";
import { toast } from "@/shared/libs/toast";
import { formatPrice } from "@/shared/utils/price";
import { wishlist_data } from "../config/constants";

// `card` is missing when the admin no longer sells the product.
export function WishlistRow({ entry, card }: { entry: WishlistEntry; card?: ShopProduct }) {
  const [remove, removing] = useRemoveFromWishlistMutation();
  const [addToCart, adding] = useAddToCartMutation();
  const product = entry.productId;
  const busy = removing.isLoading || adding.isLoading;

  const act = async (action: () => Promise<unknown>, done?: string) => {
    try {
      await action();
      if (done) toast("good", done);
    } catch (problem) {
      toast("danger", apiErrorMessage(problem));
    }
  };

  const removeButton = (label: string) =>
    product && (
      <button
        type="button"
        onClick={() => act(() => remove(product._id).unwrap())}
        disabled={busy}
        aria-label={label}
        className="grid size-9 place-items-center rounded-control text-ink-subtle transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-40"
      >
        <Trash2 className="size-4.5" aria-hidden />
      </button>
    );

  if (!product || !card) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-5 last:border-0">
        <p className="text-ink-muted">
          {product ? <span className="font-medium text-ink">{product.name}. </span> : null}
          {wishlist_data.gone}
        </p>
        {removeButton(wishlist_data.remove)}
      </li>
    );
  }

  const href = productHref(product.slug);

  // Moves a simple product straight into the basket and off the wishlist.
  const moveToCart = () =>
    act(async () => {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      await remove(product._id).unwrap();
    }, `${card.name} is in your basket.`);

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line py-5 last:border-0 sm:flex-nowrap">
      <Link href={href} className="shrink-0" tabIndex={-1} aria-hidden>
        <Image src={card.image} alt="" sizes="80px" className="size-20 object-contain" />
      </Link>

      <div className="min-w-0 flex-1 basis-48">
        {card.brand ? (
          <p className="text-xs font-bold tracking-wider text-ink-subtle uppercase">{card.brand}</p>
        ) : null}
        <Link href={href} className="font-medium text-ink transition-colors hover:text-tertiary">
          {card.name}
        </Link>
      </div>

      <p className="flex flex-wrap items-baseline gap-x-2 text-right">
        <span className="font-bold text-tertiary">{formatPrice(card.price)}</span>
        {card.compareAt ? <s className="text-sm text-ink-subtle">{formatPrice(card.compareAt)}</s> : null}
      </p>

      {card.hasOptions ? (
        <Link
          href={href}
          className="rounded-control bg-tertiary px-5 py-2.5 text-sm font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
        >
          {wishlist_data.chooseOptions}
          <span className="sr-only"> — {card.name}</span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={moveToCart}
          disabled={busy}
          className="rounded-control bg-tertiary px-5 py-2.5 text-sm font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover disabled:opacity-60"
        >
          {wishlist_data.addToCart}
          <span className="sr-only"> — {card.name}</span>
        </button>
      )}

      {removeButton(wishlist_data.removeOne.replace("{name}", card.name))}
    </li>
  );
}
