"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartCount } from "@/shared/libs/cart";

export function CartLink({ className }: { className: string }) {
  const count = useCartCount();

  return (
    <Link
      href="/cart"
      aria-label={
        count === 0
          ? "Shopping cart, empty"
          : `Shopping cart, ${count} ${count === 1 ? "item" : "items"}`
      }
      className={`relative ${className}`}
    >
      <ShoppingCart className="size-4.5" aria-hidden />

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
