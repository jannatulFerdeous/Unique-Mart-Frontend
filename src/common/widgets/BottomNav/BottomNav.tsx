"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ListChecks, ShoppingCart, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCartCount } from "@/shared/libs/cart";
import { encodeBack, useSession } from "@/shared/libs/session";
import { useWishlistCount } from "@/shared/libs/wishlist";
import { cn } from "@/shared/utils/cn";

type Tab = { label: string; href: string; icon: LucideIcon; count?: number; ariaLabel?: string; active: boolean };

// The phone's way around the shop: wishlist, cart, orders and account, pinned
// to the bottom of the screen. From lg up these live in the header instead.
export function BottomNav() {
  const pathname = usePathname();
  const { user } = useSession();
  const wishlist = useWishlistCount();
  const cart = useCartCount();

  // Signed out, orders and account go to the login page and come back after.
  const signInFor = (path: string) => `/auth/login?back=${encodeURIComponent(encodeBack(path))}`;
  const within = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const tabs: Tab[] = [
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      count: wishlist,
      ariaLabel: wishlist ? `Wishlist, ${wishlist} ${wishlist === 1 ? "product" : "products"}` : undefined,
      active: within("/wishlist"),
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      count: cart,
      ariaLabel: cart ? `Cart, ${cart} ${cart === 1 ? "item" : "items"}` : undefined,
      active: within("/cart") || within("/checkout"),
    },
    {
      label: "Orders",
      href: user ? "/account/orders" : signInFor("/account/orders"),
      icon: ListChecks,
      active: within("/account/orders"),
    },
    {
      label: user ? "Account" : "Log in",
      href: user ? "/account/profile" : signInFor(pathname.startsWith("/auth/") ? "/" : pathname),
      icon: User,
      active: within("/account/profile") || within("/auth"),
    },
  ];

  return (
    <>
      {/* Keeps the end of the page clear of the bar. */}
      <div aria-hidden className="h-16 lg:hidden" />

      <nav
        aria-label="Quick links"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line-inverse bg-inverse pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="grid h-16 grid-cols-4">
          {tabs.map(({ label, href, icon: Icon, count, ariaLabel, active }) => (
            <li key={label}>
              <Link
                href={href}
                aria-label={ariaLabel}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors focus-visible:outline-ink-inverse",
                  active ? "text-tertiary" : "text-ink-inverse-muted hover:text-ink-inverse",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                  {count ? (
                    <span
                      aria-hidden
                      className="absolute -top-1.5 -right-2.5 grid min-w-4.5 place-items-center rounded-full bg-tertiary px-1 text-[0.625rem] leading-4.5 font-bold text-tertiary-contrast tabular-nums"
                    >
                      {count > 99 ? "99+" : count}
                    </span>
                  ) : null}
                </span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
