import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import type { Tone } from "../config/types";
import { TONE_VAR } from "./StatusPill";

export type BarItem = {
  id: string;
  label: string;
  value: number;
  display: string;
  secondary?: string;
  tone?: Tone;
  href?: string;
};

export function BarList({
  items,
  className,
  max,
  emptyLabel = "Nothing to show yet.",
}: {
  items: BarItem[];
  className?: string;
  max?: number;
  emptyLabel?: string;
}) {
  if (!items.length) {
    return <p className="py-6 text-center text-sm text-ink-muted">{emptyLabel}</p>;
  }

  const ceiling = Math.max(max ?? 0, ...items.map((item) => item.value), 1);
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => {
        const share = total > 0 ? (item.value / total) * 100 : 0;
        const width = (item.value / ceiling) * 100;
        const color = item.tone ? TONE_VAR[item.tone] : "var(--color-tertiary)";

        const body = (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-sm text-ink">{item.label}</span>
              <span className="flex shrink-0 items-baseline gap-2">
                <span className="text-xs text-ink-subtle opacity-0 transition-opacity tabular-nums group-hover/bar:opacity-100 group-focus-visible/bar:opacity-100">
                  {share.toFixed(share < 10 ? 1 : 0)}%
                </span>
                <span className="text-sm font-semibold text-ink tabular-nums">{item.display}</span>
              </span>
            </div>

            <div className="mt-1.5 h-2 w-full overflow-hidden bg-surface-muted">
              <div
                className="h-full rounded-r-[4px] transition-[width] duration-300"
                style={{ width: `${Math.max(width, item.value > 0 ? 1.5 : 0)}%`, background: color }}
              />
            </div>

            {item.secondary && (
              <p className="mt-1 truncate text-xs text-ink-subtle">{item.secondary}</p>
            )}
          </>
        );

        const shell = "group/bar block rounded-control px-2 py-1.5 -mx-2 transition-colors";

        return (
          <li key={item.id}>
            {item.href ? (
              <Link href={item.href} className={cn(shell, "hover:bg-surface-muted")}>
                {body}
              </Link>
            ) : (
              <div className={cn(shell, "hover:bg-surface-muted")} tabIndex={0}>
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
