"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { useWishlist } from "@/shared/libs/wishlist";
import { wishlist_data } from "./config/constants";
import { WishlistRow } from "./partials/WishlistRow";

/* Saved products.
 *
 * A client component all the way down, because the wishlist lives in this
 * browser — there is nothing for the server to render but the empty state. The
 * page is still prerendered and still has its metadata; `useWishlist` hands
 * back an empty list during prerender and React swaps in the stored one on
 * hydration. */
export function Wishlist() {
  const { items, count, clear } = useWishlist();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <ProductBreadcrumb
        trail={[
          { label: wishlist_data.crumbHome, href: "/" },
          { label: wishlist_data.crumbWishlist },
        ]}
      />

      <div className="container-page py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-sans font-bold text-ink">{wishlist_data.title}</h1>
          {count > 0 && (
            <p role="status" className="text-ink-muted">
              {count === 1
                ? wishlist_data.countOne
                : wishlist_data.countMany.replace("{n}", String(count))}
            </p>
          )}
        </div>

        {count === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-card border border-line bg-surface px-6 py-20 text-center">
            <Heart className="size-10 text-ink-subtle" aria-hidden />
            <p className="font-sans font-bold text-ink">{wishlist_data.emptyTitle}</p>
            <p className="max-w-sm text-ink-muted">{wishlist_data.emptyBody}</p>
            <Link
              href="/offers"
              className="mt-2 rounded-control bg-tertiary px-6 py-3 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
            >
              {wishlist_data.emptyAction}
            </Link>
          </div>
        ) : (
          <div className="mt-6 rounded-card border border-line bg-surface px-5">
            <ul>
              {items.map((item) => (
                <WishlistRow key={item.slug} slug={item.slug} />
              ))}
            </ul>
          </div>
        )}

        {count > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            {/* Two clicks rather than a native `confirm()`, matching the basket:
                a blocking browser dialog looks like the page has hung. */}
            {confirming ? (
              <p className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-ink">{wishlist_data.clearConfirm}</span>
                <button
                  type="button"
                  autoFocus
                  onBlur={() => setConfirming(false)}
                  onClick={() => {
                    clear();
                    setConfirming(false);
                  }}
                  className="rounded-control border border-danger px-3 py-1.5 font-medium text-danger transition-colors hover:bg-danger-soft"
                >
                  {wishlist_data.clear}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="text-ink-muted underline"
                >
                  {wishlist_data.keep}
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="text-sm text-ink-muted underline transition-colors hover:text-danger"
              >
                {wishlist_data.clear}
              </button>
            )}

            <p className="text-xs text-ink-subtle">{wishlist_data.storageNote}</p>
          </div>
        )}
      </div>
    </>
  );
}
