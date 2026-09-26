"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GalleryHorizontalEnd, LayoutDashboard, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { admin_data } from "../config/constants";
import type { NavIcon } from "../config/types";

const ICONS: Record<NavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  banners: GalleryHorizontalEnd,
  settings: Settings,
};

export const isCurrent = (
  pathname: string,
  href: string,
  exact?: boolean,
): boolean =>
  exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="flex flex-col gap-6 py-4">
      {admin_data.nav.map((group) => (
        <div key={group.title}>
          <p className="px-3 text-xs font-semibold tracking-wide text-ink-inverse-muted uppercase">
            {group.title}
          </p>

          <ul className="mt-2 flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = ICONS[item.icon];
              const current = isCurrent(pathname, item.href, item.exact);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-control px-3 py-2 text-sm transition-colors",
                      current
                        ? "bg-inverse-raised font-semibold text-ink-inverse"
                        : "text-ink-inverse-muted hover:bg-inverse-raised/60 hover:text-ink-inverse",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export const blurbFor = (pathname: string): string | undefined => {
  const items = admin_data.nav.flatMap((group) => group.items);
  const sorted = [...items].sort((a, b) => b.href.length - a.href.length);
  return sorted.find((item) => isCurrent(pathname, item.href, item.exact))
    ?.blurb;
};
