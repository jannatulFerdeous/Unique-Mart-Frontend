"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { apiErrorMessage } from "@/redux/api/errors";
import { useClearWishlistMutation } from "@/redux/features/wishlist/wishlistApi";
import { toast } from "@/shared/libs/toast";
import { useSignInFirst } from "@/shared/libs/useSignInFirst";
import { useWishlist } from "@/shared/libs/wishlist";
import { wishlist_data } from "./config/constants";
import { WishlistRow } from "./partials/WishlistRow";

export function Wishlist() {
  const { signedIn, goSignIn } = useSignInFirst();
  const { entries, count, isLoading, isError, error, refetch } = useWishlist();
  const [clear, { isLoading: clearing }] = useClearWishlistMutation();
  const [confirming, setConfirming] = useState(false);

  const empty = async () => {
    setConfirming(false);
    try {
      await clear().unwrap();
    } catch (problem) {
      toast("danger", apiErrorMessage(problem, "Couldn't clear your wishlist. Please try again."));
    }
  };

  return (
    <>
      <ProductBreadcrumb
        trail={[{ label: wishlist_data.crumbHome, href: "/" }, { label: wishlist_data.crumbWishlist }]}
      />

      <div className="container-page py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-sans font-bold text-ink">{wishlist_data.title}</h1>
          {count > 0 && (
            <p role="status" className="text-ink-muted">
              {count === 1 ? wishlist_data.countOne : wishlist_data.countMany.replace("{n}", String(count))}
            </p>
          )}
        </div>

        {!signedIn ? (
          <WishlistNotice title={wishlist_data.signInTitle} body={wishlist_data.signInBody}>
            <button type="button" onClick={goSignIn} className={primaryAction}>
              {wishlist_data.signInAction}
            </button>
          </WishlistNotice>
        ) : isLoading ? (
          <WishlistNotice title={wishlist_data.loading} />
        ) : isError ? (
          <WishlistNotice title={wishlist_data.errorTitle} body={apiErrorMessage(error)}>
            <button type="button" onClick={() => refetch()} className={primaryAction}>
              {wishlist_data.retry}
            </button>
          </WishlistNotice>
        ) : count === 0 ? (
          <WishlistNotice title={wishlist_data.emptyTitle} body={wishlist_data.emptyBody}>
            <Link href="/offers" className={primaryAction}>
              {wishlist_data.emptyAction}
            </Link>
          </WishlistNotice>
        ) : (
          <>
            <div className="mt-6 rounded-card border border-line bg-surface px-5">
              <ul>
                {entries.map((entry, index) => (
                  <WishlistRow
                    key={entry.productId ? `${entry.productId._id}-${entry.variantId ?? ""}` : `gone-${index}`}
                    entry={entry}
                  />
                ))}
              </ul>
            </div>

            <div className="mt-5">
              {confirming ? (
                <p className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-ink">{wishlist_data.clearConfirm}</span>
                  <button
                    type="button"
                    autoFocus
                    onBlur={() => setConfirming(false)}
                    onClick={empty}
                    className="rounded-control border border-danger px-3 py-1.5 font-medium text-danger transition-colors hover:bg-danger-soft"
                  >
                    {wishlist_data.clear}
                  </button>
                  <button type="button" onClick={() => setConfirming(false)} className="text-ink-muted underline">
                    {wishlist_data.keep}
                  </button>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  disabled={clearing}
                  className="text-sm text-ink-muted underline transition-colors hover:text-danger"
                >
                  {wishlist_data.clear}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

const primaryAction =
  "mt-2 rounded-control bg-tertiary px-6 py-3 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover";

function WishlistNotice({ title, body, children }: { title: string; body?: string; children?: ReactNode }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3 rounded-card border border-line bg-surface px-6 py-20 text-center">
      <Heart className="size-10 text-ink-subtle" aria-hidden />
      <p className="font-sans font-bold text-ink">{title}</p>
      {body && <p className="max-w-sm text-ink-muted">{body}</p>}
      {children}
    </div>
  );
}
