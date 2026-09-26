"use client";

import { Heart } from "lucide-react";
import { useIsWished, toggle } from "@/shared/libs/wishlist";
import { cn } from "@/shared/utils/cn";

type Variant = "card" | "inline";

export function WishlistButton({
  slug,
  name,
  variant = "card",
  className,
}: {
  slug: string;
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
        "absolute top-2 right-2 z-10 grid size-9 place-items-center rounded-full bg-surface/90 backdrop-blur transition-colors hover:bg-surface",
        wished ? "text-tertiary" : "text-ink-subtle hover:text-ink",
        className,
      )}
    >
      <Heart className={cn("size-4.5", wished && "fill-tertiary")} aria-hidden />
    </button>
  );
}
