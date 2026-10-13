"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useRemoveFromWishlistMutation, type WishlistEntry } from "@/redux/features/wishlist/wishlistApi";
import { productHref, productImage, variantChoices } from "@/shared/libs/storefront/catalog";
import { toast } from "@/shared/libs/toast";
import { formatPrice } from "@/shared/utils/price";
import { wishlist_data } from "../config/constants";

export function WishlistRow({ entry }: { entry: WishlistEntry }) {
  const [remove, removing] = useRemoveFromWishlistMutation();
  const [addToCart, adding] = useAddToCartMutation();
  const product = entry.productId;
  const variantId = entry.variantId ?? undefined;
  const variant = product?.hasVariants ? product.variants.find((each) => each._id === variantId) : undefined;
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
        onClick={() => act(() => remove({ productId: product._id, variantId }).unwrap())}
        disabled={busy}
        aria-label={label}
        className="grid size-9 place-items-center rounded-control text-ink-subtle transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-40"
      >
        <Trash2 className="size-4.5" aria-hidden />
      </button>
    );

  // Deleted, switched off by the admin, or the saved variant was removed.
  if (!product || product.status !== "active" || (product.hasVariants && !variant)) {
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
  const priced = variant ?? product;
  const discount = priced.discount ?? 0;
  const brand = typeof product.brandId === "object" ? product.brandId?.name : undefined;
  const options = Object.entries(variant ? variantChoices(variant) : {});
  const available = priced.stock > 0;

  // Moves the saved version straight into the basket and off the wishlist.
  const moveToCart = () =>
    act(async () => {
      await addToCart({ productId: product._id, variantId, quantity: 1 }).unwrap();
      await remove({ productId: product._id, variantId }).unwrap();
    }, `${product.name} is in your basket.`);

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line py-5 last:border-0 sm:flex-nowrap">
      <Link href={href} className="shrink-0" tabIndex={-1} aria-hidden>
        <Image src={productImage(product.images[0]?.url)} alt="" sizes="80px" className="size-20 object-contain" />
      </Link>

      <div className="min-w-0 flex-1 basis-48">
        {brand ? <p className="text-xs font-bold tracking-wider text-ink-subtle uppercase">{brand}</p> : null}
        <Link href={href} className="font-medium text-ink transition-colors hover:text-tertiary">
          {product.name}
        </Link>

        {options.length > 0 && (
          <dl className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {options.map(([label, value]) => (
              <div key={label} className="flex items-center gap-1.5">
                <dt className="text-ink-muted">{label}:</dt>
                <dd className="rounded-control bg-surface-muted px-2 py-0.5 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <p className="flex flex-wrap items-baseline gap-x-2 text-right">
        <span className="font-bold text-tertiary">{formatPrice(Math.max(0, priced.price - discount))}</span>
        {discount > 0 ? <s className="text-sm text-ink-subtle">{formatPrice(priced.price)}</s> : null}
      </p>

      <button
        type="button"
        onClick={moveToCart}
        disabled={busy || !available}
        className="rounded-control bg-tertiary px-5 py-2.5 text-sm font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover disabled:opacity-60"
      >
        {available ? wishlist_data.addToCart : wishlist_data.outOfStock}
        <span className="sr-only"> — {product.name}</span>
      </button>

      {removeButton(wishlist_data.removeOne.replace("{name}", product.name))}
    </li>
  );
}
