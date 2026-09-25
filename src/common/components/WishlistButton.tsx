"use client";

import { Heart } from "lucide-react";
import { useIsWished, toggle } from "@/shared/libs/wishlist";
import { cn } from "@/shared/utils/cn";

/* The heart.
 *
 * A client island rather than a client card: `ProductCard` stays a server
 * component and only this button hydrates, which matters on a page rendering
 * ninety of them.
 *
 * It subscribes through `useIsWished`, which returns a boolean, so a card
 * re-renders when its own product is saved and not when any other one is. */

type Variant = "card" | "inline";

export function WishlistButton({
  slug,
  name,
  variant = "card",
  className,
}: {
  slug: string;
  /** Named in the label, so a screen reader hears which product. */
  name: string;
  variant?: Variant;
  className?: string;
}) {
  const wished = useIsWished(slug);

  const label = wished ? `Remove ${name} from your wishlist` : `Save ${name} to your wishlist`;

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={() => toggle(slug)}
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
      onClick={() => toggle(slug)}
      aria-pressed={wished}
      aria-label={label}
      title={label}
      className={cn(
        /* Sits over the photo, so it needs its own surface to stay legible on
           a pale product shot. */
        "absolute top-2 right-2 z-10 grid size-9 place-items-center rounded-full bg-surface/90 backdrop-blur transition-colors hover:bg-surface",
        wished ? "text-tertiary" : "text-ink-subtle hover:text-ink",
        className,
      )}
    >
      <Heart className={cn("size-4.5", wished && "fill-tertiary")} aria-hidden />
    </button>
  );
}
