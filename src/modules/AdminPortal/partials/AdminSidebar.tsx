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
  Truck,
  Undo2,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSession } from "@/shared/libs/session";
import { cn } from "@/shared/utils/cn";
import { canOpen } from "../config/access";
import { admin_data } from "../config/constants";
import type { NavGroup, NavIcon } from "../config/types";

const ICONS: Record<NavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  payments: Wallet,
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
  refunds: Undo2,
  orderStatus: Truck,
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
    <nav aria-label="Dashboard sections" className="flex flex-col gap-5 py-4">
      {navFor(user?.role).map((group) => (
        <div key={group.title}>
          <p className="px-3 text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-inverse-muted/70 uppercase">
            {group.title}
          </p>

          <ul className="mt-2 flex flex-col gap-1">
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
                      // The current page: a blue icon tile on a soft blue wash.
                      "group relative flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-all duration-200 ease-out motion-reduce:transition-none",
                      current
                        ? "bg-tertiary/15 font-semibold text-ink-inverse"
                        : "text-ink-inverse-muted hover:translate-x-0.5 hover:bg-inverse-raised hover:text-ink-inverse motion-reduce:hover:translate-x-0",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-md transition-colors duration-200",
                        current
                          ? "bg-tertiary text-tertiary-contrast shadow-[0_4px_12px_-2px_rgb(1_113_208/0.6)]"
                          : "bg-inverse-raised text-ink-inverse-muted group-hover:bg-inverse-hover group-hover:text-ink-inverse",
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="border-t border-line-inverse pt-4">
        <button
          type="button"
          onClick={onSignOut}
          className="group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm text-ink-inverse-muted transition-colors duration-200 hover:bg-danger/15 hover:text-ink-inverse"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-inverse-raised transition-colors duration-200 group-hover:bg-danger group-hover:text-ink-inverse">
            <LogOut className="size-4" aria-hidden />
          </span>
          {admin_data.shell.signOut}
        </button>
      </div>
    </nav>
  );
}

export const blurbFor = (pathname: string): string | undefined => {
  const items = admin_data.nav.flatMap((group) => group.items);
  const sorted = [...items].sort((a, b) => b.href.length - a.href.length);
  return sorted.find((item) => isCurrent(pathname, item.href, item.exact))
    ?.blurb;
};
