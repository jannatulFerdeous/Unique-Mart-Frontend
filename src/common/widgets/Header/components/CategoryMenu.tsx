"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { NavItem } from "@/shared/config/navigation";
import { cn } from "@/shared/utils/cn";

const COLUMN_WIDTH = 201;
const column = "max-h-[70vh] w-[201px] overflow-y-auto";

// A category's dropdown. Sub-categories open in a panel to the right of the
// list, so the list itself never moves; only when there's no room left on the
// screen does the panel open to the left instead.
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
  const [flip, setFlip] = useState(false);
  const list = useRef<HTMLUListElement>(null);

  const activate = (index: number, hasChildren: boolean) => {
    if (hasChildren && list.current) {
      const { right } = list.current.getBoundingClientRect();
      setFlip(right + COLUMN_WIDTH > window.innerWidth - 8);
    }
    setActiveIndex(hasChildren ? index : -1);
  };

  const active = items[activeIndex]?.children?.length ? items[activeIndex] : null;

  return (
    <div
      onMouseLeave={() => setActiveIndex(-1)}
      className={cn("absolute top-full z-50 mt-3", isOpen ? "block" : "hidden", alignRight ? "right-0" : "left-0")}
    >
      <ul
        ref={list}
        className={cn(
          column,
          "rounded-card bg-surface shadow-menu",
          active && (flip ? "rounded-l-none" : "rounded-r-none"),
        )}
      >
        {items.map((item, index) => {
          const hasChildren = Boolean(item.children?.length);

          return (
            <li key={item.href} onMouseEnter={() => activate(index, hasChildren)} onFocus={() => activate(index, hasChildren)}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-4 px-4 py-2 text-nav text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink",
                  hasChildren && activeIndex === index && "bg-surface-muted font-semibold text-ink",
                )}
              >
                <span>{item.label}</span>
                {hasChildren ? <Plus className="size-4 shrink-0" aria-hidden /> : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {active?.children && (
        <ul
          className={cn(
            column,
            "absolute top-0 bg-surface shadow-menu",
            flip ? "right-full rounded-l-card border-r border-line" : "left-full rounded-r-card border-l border-line",
          )}
        >
          {active.children.map((child) => (
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
      )}
    </div>
  );
}
