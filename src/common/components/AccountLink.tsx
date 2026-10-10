"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ListChecks, LogOut, MapPin, User, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { homeFor, isStaff } from "@/modules/AdminPortal/config/access";
import { useAccount } from "@/modules/Auth/hooks/useAccount";
import { encodeBack, useSession } from "@/shared/libs/session";

type MenuLink = { href: string; label: string; icon: LucideIcon };

const CUSTOMER_LINKS: MenuLink[] = [
  { href: "/account/profile", label: "My Profile", icon: UserRound },
  { href: "/account/orders", label: "My Orders", icon: ListChecks },
  { href: "/account/addresses", label: "Manage Address", icon: MapPin },
];

// Signed out: a link to the login page. Signed in: the person's name, opening a
// menu of their account pages (plus the dashboard for staff) and Logout.
export function AccountLink({ className }: { className: string }) {
  const { user } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAccount();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (!user) {
    const here = pathname.startsWith("/auth/") ? "/" : pathname;
    return (
      <Link href={`/auth/login?back=${encodeURIComponent(encodeBack(here))}`} aria-label="Log in" className={className}>
        <User className="size-4.5" aria-hidden />
      </Link>
    );
  }

  const links: MenuLink[] = isStaff(user.role)
    ? [...CUSTOMER_LINKS, { href: homeFor(user.role), label: "Dashboard", icon: LayoutDashboard }]
    : CUSTOMER_LINKS;

  const item =
    "flex items-center gap-3 rounded-control px-3 py-2.5 text-sm text-ink-inverse transition-colors hover:bg-inverse-hover focus-visible:outline-ink-inverse";

  return (
    <div ref={root} className="relative flex items-center gap-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3"
      >
        <span className={className}>
          <User className="size-4.5" aria-hidden />
        </span>
        <span className="hidden max-w-40 truncate text-sm font-medium text-tertiary lg:block">{user.name}</span>
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute top-full right-0 z-50 mt-2 w-64 rounded-card border border-line-inverse bg-inverse-raised p-2 shadow-card"
        >
          <p className="truncate px-3 pt-2 pb-3 text-center font-bold text-ink-inverse">{user.name}</p>
          <ul className="flex flex-col gap-0.5">
            {links.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} onClick={() => setOpen(false)} className={item}>
                  <Icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={async () => {
                  setOpen(false);
                  await signOut();
                  router.push("/");
                }}
                className={`${item} w-full text-left`}
              >
                <LogOut className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
