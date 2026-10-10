"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistCount } from "@/shared/libs/wishlist";

export function WishlistLink({ className }: { className: string }) {
  const count = useWishlistCount();

  return (
    <Link
      href="/wishlist"
      aria-label={
        count === 0
          ? "Wishlist, empty"
          : `Wishlist, ${count} ${count === 1 ? "product" : "products"}`
      }
      className={`relative ${className}`}
    >
      <Heart className="size-4.5" aria-hidden />

      {count > 0 && (
        <span
          aria-hidden
          className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-tertiary px-1 text-[0.625rem] font-bold text-tertiary-contrast tabular-nums"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
