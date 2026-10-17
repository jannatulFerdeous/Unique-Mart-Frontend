"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { ChevronDown, MapPin, Menu, X } from "lucide-react";
import { ThunderIcon } from "@/common/components/icons/ThunderIcon";
import { utilityNav } from "@/shared/config/navigation";
import type { NavItem } from "@/shared/config/navigation";
import { cn } from "@/shared/utils/cn";
import { useMobileSearch } from "./MobileSearch";


export function MobileNav({ nav: categoryNav }: { nav: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  // Opening the menu puts the search bar away.
  const { setOpen: setSearchOpen } = useMobileSearch();

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSearchOpen(false);
          setIsOpen(true);
        }}
        aria-label="Open menu"
        aria-expanded={isOpen}
        className="grid size-10 shrink-0 place-items-center rounded-control bg-ink-inverse/10 text-ink-inverse transition-colors hover:bg-ink-inverse/20 focus-visible:outline-ink-inverse lg:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <div
        inert={!isOpen}
        className={cn(
          "fixed inset-0 z-50 transition-[visibility] duration-300 lg:hidden",
          isOpen ? "visible" : "invisible",
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          className={cn(
            "absolute inset-0 size-full bg-ink/50 transition-opacity duration-300 ease-out motion-reduce:transition-none",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          className={cn(
            // Slides in from the right, the side its button is on.
            "absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col bg-surface transition-transform duration-300 ease-out motion-reduce:transition-none",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <p className="text-xs font-bold tracking-widest text-ink-subtle uppercase">Menu</p>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="grid size-9 place-items-center rounded-control text-ink transition-colors hover:bg-surface-muted"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto pb-6">
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-2.5 border-b border-line px-5 py-4">
              {utilityNav.map((item) => {
                const isOffers = item.href === "/offers";
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className={cn(
                        "flex h-11 items-center justify-center gap-1.5 rounded-control px-3 text-sm font-bold whitespace-nowrap shadow-card transition-colors",
                        isOffers
                          ? "bg-tertiary text-tertiary-contrast hover:bg-tertiary-hover"
                          : "border border-line-strong bg-surface text-ink hover:border-tertiary hover:text-tertiary",
                      )}
                    >
                      {isOffers ? (
                        <ThunderIcon className="size-4.5 shrink-0 animate-flash motion-reduce:animate-none" />
                      ) : (
                        <MapPin className="size-4 shrink-0" aria-hidden />
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="divide-y divide-line border-b border-line">
              {categoryNav.map((category) => (
                <li key={category.href}>
                  <MobileNavItem item={category} root={category.label} onNavigate={close} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

// "iPhone 17 (Cases & Protectors)" under Cases & Protectors reads as
// "iPhone 17": the bracket only repeats where it already is.
const shortLabel = (label: string, root: string) =>
  root && label.endsWith(` (${root})`) ? label.slice(0, -(root.length + 3)) : label;

// Three levels, each its own look: main categories bold with a round toggle,
// categories in a tinted panel, sub-categories small along a blue guide line.
// The open path turns blue.
const LEVEL = [
  {
    row: "border-l-[3px] border-transparent px-5 py-3.5 font-semibold text-ink [details[open]>&]:border-tertiary [details[open]>&]:bg-tertiary-soft [details[open]>&]:text-tertiary",
    toggle: "size-7 rounded-full bg-surface-muted text-ink-muted [details[open]>summary>&]:bg-tertiary [details[open]>summary>&]:text-tertiary-contrast",
    list: "bg-canvas py-1",
  },
  {
    row: "py-2.5 pr-5 pl-8 font-medium text-ink [details[open]>&]:text-tertiary",
    toggle: "size-6 text-ink-subtle [details[open]>summary>&]:text-tertiary",
    list: "mb-2 ml-8 border-l-2 border-tertiary/25",
  },
  {
    row: "py-2 pr-5 pl-4 text-sm text-ink-muted",
    toggle: "size-5 text-ink-subtle",
    list: "ml-4 border-l border-line",
  },
] as const;

// One open at a time on each level: opening a group closes the others beside it.
const closeSiblings = (event: SyntheticEvent<HTMLDetailsElement>) => {
  const opened = event.currentTarget;
  if (!opened.open) return;
  opened
    .closest("ul")
    ?.querySelectorAll<HTMLDetailsElement>(":scope > li > details[open]")
    .forEach((other) => {
      if (other !== opened) other.open = false;
    });
};

function MobileNavItem({
  item,
  root,
  depth = 0,
  onNavigate,
}: {
  item: NavItem;
  root: string;
  depth?: number;
  onNavigate: () => void;
}) {
  const level = LEVEL[Math.min(depth, LEVEL.length - 1)];
  const label = depth === 0 ? item.label : shortLabel(item.label, root);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-2.5 text-nav transition-colors hover:text-tertiary",
          depth === 0 && "px-5 py-3.5 font-semibold text-ink",
          depth === 1 && "py-2.5 pr-5 pl-8 font-medium text-ink",
          depth >= 2 && "py-2 pr-5 pl-4 text-sm text-ink-muted",
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <details onToggle={closeSiblings}>
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-4 text-nav transition-colors focus-visible:outline-tertiary focus-visible:-outline-offset-2 [&::-webkit-details-marker]:hidden",
          level.row,
        )}
      >
        {label}
        <span className={cn("grid shrink-0 place-items-center transition-colors", level.toggle)}>
          <ChevronDown
            className="size-4 transition-transform [details[open]>summary_&]:rotate-180"
            aria-hidden
          />
        </span>
      </summary>
      <ul className={level.list}>
        {item.children.map((child) => (
          <li key={child.href}>
            <MobileNavItem item={child} root={root} depth={depth + 1} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </details>
  );
}
