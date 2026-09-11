"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { category_data } from "../config/constants";
import type { FacetGroupView } from "../config/types";
import { PriceRange } from "./PriceRange";

type Props = {
  bounds: { min: number; max: number };
  price: { min: number; max: number };
  onPrice: (next: { min: number; max: number }) => void;
  groups: FacetGroupView[];
  selected: Record<string, string[]>;
  onToggle: (group: string, value: string) => void;
  dirty: boolean;
  onClear: () => void;
};

function Collapsible({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-line py-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="font-bold tracking-wide uppercase text-ink">
          {title}
        </span>
        <ChevronUp
          aria-hidden
          className={cn(
            "size-5 shrink-0 text-ink-muted transition-transform duration-200",
            open ? "" : "rotate-180",
          )}
        />
      </button>

      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function CategoryFilters({
  bounds,
  price,
  onPrice,
  groups,
  selected,
  onToggle,
  dirty,
  onClear,
}: Props) {
  const { filtersTitle, clearAll, groups: labels } = category_data;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 pb-4">
        <h2 className="font-sans font-bold text-ink">{filtersTitle}</h2>
        {dirty && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-tertiary underline decoration-tertiary/40 underline-offset-4 transition-colors hover:decoration-tertiary"
          >
            {clearAll}
          </button>
        )}
      </div>

      {bounds.min !== bounds.max && (
        <Collapsible title={labels.price}>
          <PriceRange bounds={bounds} value={price} onChange={onPrice} />
        </Collapsible>
      )}

      {groups.map((group) => (
        <Collapsible key={group.id} title={group.label}>
          {/* A long list scrolls rather than pushing the grid down the page. */}
          <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {group.options.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-2 text-ink-muted transition-colors hover:text-ink">
                  <input
                    type="checkbox"
                    checked={(selected[group.id] ?? []).includes(option.value)}
                    onChange={() => onToggle(group.id, option.value)}
                    className="size-4 shrink-0 accent-tertiary"
                  />
                  <span className="flex-1">{option.label}</span>
                  <span className="text-sm text-ink-subtle tabular-nums">
                    ({option.count})
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Collapsible>
      ))}

      <div className="border-t border-line" />
    </div>
  );
}
