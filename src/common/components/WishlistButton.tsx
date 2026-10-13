"use client";

import { Heart } from "lucide-react";
import { useWishToggle } from "@/shared/libs/wishlist";
import { cn } from "@/shared/utils/cn";

type Variant = "card" | "inline";

// `variantId` is the version of a product with variants that the heart saves.
// On a card any saved version fills the heart; inline, only `variantId` does.
export function WishlistButton({
  productId,
  variantId,
  name,
  variant = "card",
  className,
}: {
  productId: string;
  variantId?: string;
  name: string;
  variant?: Variant;
  className?: string;
}) {
  const { wished, toggle, busy } = useWishToggle({ productId, variantId, name, exact: variant === "inline" });

  const label = wished ? `Remove ${name} from your wishlist` : `Save ${name} to your wishlist`;

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={wished}
        className={cn(
          "inline-flex items-center gap-2 rounded-control border px-5 py-3.5 font-bold transition-colors",
          wished
            ? "border-tertiary bg-tertiary-soft text-tertiary"
            : "border-line-strong text-ink hover:border-line-strong hover:bg-surface-muted",
          className,
        )}
      >
        <Heart className={cn("size-5", wished && "fill-tertiary")} aria-hidden />
        {wished ? "Saved" : "Save"}
        <span className="sr-only"> — {name}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={wished}
      aria-label={label}
      title={label}
      className={cn(
        "absolute top-2 right-2 z-10 grid size-9 place-items-center rounded-full bg-surface/90 backdrop-blur transition-colors hover:bg-surface",
        wished ? "text-tertiary" : "text-ink-subtle hover:text-ink",
        className,
      )}
    >
      <Heart className={cn("size-4.5", wished && "fill-tertiary")} aria-hidden />
    </button>
  );
}
