"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { utilityNav } from "@/shared/config/navigation";
import type { NavItem } from "@/shared/config/navigation";
import { site } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

const depthPadding = ["px-5", "pr-5 pl-8", "pr-5 pl-11"];

/** `nav` is read on the server — the tree the admin portal edits. */
export function MobileNav({ nav: categoryNav }: { nav: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

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
        onClick={() => setIsOpen(true)}
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
            "absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col bg-surface transition-transform duration-300 ease-out motion-reduce:transition-none",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="font-display text-base font-extrabold tracking-tight uppercase">
              {site.name}
            </span>
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
            <ul className="border-b border-line py-2">
              {utilityNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block px-5 py-2.5 text-sm font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul>
              {categoryNav.map((category) => (
                <li key={category.href} className="border-b border-line">
                  <MobileNavItem item={category} onNavigate={close} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

function MobileNavItem({
  item,
  depth = 0,
  onNavigate,
}: {
  item: NavItem;
  depth?: number;
  onNavigate: () => void;
}) {
  const padding = depthPadding[depth] ?? depthPadding.at(-1);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn("block py-2.5 text-nav text-ink-muted", padding)}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <details>
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-4 py-2.5 text-nav text-ink [&::-webkit-details-marker]:hidden",
          padding,
        )}
      >
        {item.label}
        <ChevronDown
          className="size-4 shrink-0 transition-transform [details[open]>summary>&]:rotate-180"
          aria-hidden
        />
      </summary>
      <ul className="pb-1">
        {item.children.map((child) => (
          <li key={child.href}>
            <MobileNavItem
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </details>
  );
}
