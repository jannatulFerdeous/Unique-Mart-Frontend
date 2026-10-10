"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  FolderTree,
  GalleryHorizontalEnd,
  Layers,
  LayoutDashboard,
  LayoutList,
  LifeBuoy,
  ListChecks,
  ListTree,
  LogOut,
  Mail,
  MapPin,
  MessageCircleQuestion,
  Package,
  Settings,
  SlidersHorizontal,
  Star,
  Tag,
  TicketPercent,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSession } from "@/shared/libs/session";
import { cn } from "@/shared/utils/cn";
import { canOpen } from "../config/access";
import { admin_data } from "../config/constants";
import type { NavGroup, NavIcon } from "../config/types";

const ICONS: Record<NavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  banners: GalleryHorizontalEnd,
  products: Package,
  brands: Tag,
  mainCategories: Layers,
  categories: FolderTree,
  subCategories: ListTree,
  attributeGroups: LayoutList,
  attributes: SlidersHorizontal,
  users: Users,
  settings: Settings,
  profile: UserRound,
  orders: ListChecks,
  reviews: Star,
  addresses: MapPin,
  rewards: Award,
  faq: MessageCircleQuestion,
  coupons: TicketPercent,
  newsletter: Mail,
  support: LifeBuoy,
};

export const isCurrent = (
  pathname: string,
  href: string,
  exact?: boolean,
): boolean =>
  exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

// The nav groups this role can use, with the links it can't open left out.
export const navFor = (role?: string): NavGroup[] =>
  admin_data.nav
    .map((group) => ({ ...group, items: group.items.filter((item) => canOpen(role, item.href)) }))
    .filter((group) => group.items.length > 0);

export function AdminSidebar({
  onNavigate,
  onSignOut,
}: {
  onNavigate?: () => void;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const { user } = useSession();

  return (
    <nav aria-label="Dashboard sections" className="flex flex-col gap-6 py-4">
      {navFor(user?.role).map((group) => (
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

      <button
        type="button"
        onClick={onSignOut}
        className="flex items-center gap-2.5 rounded-control px-3 py-2 text-left text-sm text-ink-inverse-muted transition-colors hover:bg-inverse-raised/60 hover:text-ink-inverse"
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        {admin_data.shell.signOut}
      </button>
    </nav>
  );
}

export const blurbFor = (pathname: string): string | undefined => {
  const items = admin_data.nav.flatMap((group) => group.items);
  const sorted = [...items].sort((a, b) => b.href.length - a.href.length);
  return sorted.find((item) => isCurrent(pathname, item.href, item.exact))
    ?.blurb;
};
