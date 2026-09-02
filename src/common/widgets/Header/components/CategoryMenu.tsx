"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { NavItem } from "@/shared/config/navigation";
import { cn } from "@/shared/utils/cn";

const column = "max-h-[70vh] w-[201px] shrink-0 overflow-y-auto";

export function CategoryMenu({
  items,
  alignRight,
  isOpen,
}: {
  items: NavItem[];
  alignRight: boolean;
  isOpen: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <div
      onMouseLeave={() => setActiveIndex(-1)}
      className={cn(
        "absolute top-full z-50 mt-3 overflow-hidden rounded-card bg-surface shadow-menu",
        isOpen ? "flex" : "hidden",
        alignRight ? "right-0" : "left-0",
      )}
    >
      <ul className={column}>
        {items.map((item, index) => {
          const hasChildren = Boolean(item.children?.length);

          return (
            <li
              key={item.href}
              onMouseEnter={() => setActiveIndex(hasChildren ? index : -1)}
              onFocus={() => setActiveIndex(hasChildren ? index : -1)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-4 px-4 py-2 text-nav text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink",
                  hasChildren &&
                    activeIndex === index &&
                    "bg-surface-muted font-semibold text-ink",
                )}
              >
                <span>{item.label}</span>
                {hasChildren ? (
                  <Plus className="size-4 shrink-0" aria-hidden />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {items.map((item, index) =>
        item.children?.length ? (
          <ul
            key={item.href}
            className={cn(
              column,
              "border-l border-line",
              activeIndex === index ? "block" : "hidden",
            )}
          >
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="block px-4 py-2 text-nav text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null,
      )}
    </div>
  );
}
