"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/shared/config/navigation";
import { cn } from "@/shared/utils/cn";
import { CategoryMenu } from "./CategoryMenu";

export function CategoryBar({ nav: categoryNav }: { nav: NavItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <nav
      aria-label="Product categories"
      className="hidden bg-inverse-deep lg:block"
      onMouseLeave={() => setOpenIndex(null)}
      onKeyDown={(event) => event.key === "Escape" && setOpenIndex(null)}
    >
      <ul className="container-page flex items-start gap-[2%] py-3 pr-2">
        {categoryNav.map((category, index) => {
          const isOpen = openIndex === index;

          return (
            <li
              key={category.href}
              className="relative"
              onMouseEnter={() => setOpenIndex(index)}
              onFocus={() => setOpenIndex(index)}
            >
              <Link
                href={category.href}
                aria-expanded={category.children ? isOpen : undefined}
                className={cn(
                  "block text-nav whitespace-nowrap text-ink-inverse-muted transition-colors hover:text-ink-inverse focus-visible:outline-ink-inverse",
                  isOpen && "text-ink-inverse",
                )}
              >
                {category.label}
              </Link>

              {category.children ? (
                <CategoryMenu
                  items={category.children}
                  alignRight={index >= categoryNav.length - 3}
                  isOpen={isOpen}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
