import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import type { Tone } from "../config/types";
import { TONE_VAR } from "./StatusPill";

/* A ranked bar list — the right form for "which of these is biggest", and the
 * form a pie chart is usually pretending to be. Bars share one baseline, so the
 * comparison is a length comparison, and the labels read straight down the left.
 *
 * Every figure is on screen as text beside its bar, so there is nothing for a
 * tooltip to reveal and none is drawn: a tooltip that repeats a visible label is
 * a hit target the reader learns to ignore. Hovering a row lifts it and shows
 * the one number that is not inline — its share of the total.
 *
 * Bars are 8px, well under the 24px cap, with a 4px rounded data-end and a square
 * start at the baseline, so length is read from the same edge every time. */

export type BarItem = {
  id: string;
  label: string;
  /** Drives the bar. Must be non-negative — this form has one baseline. */
  value: number;
  /** The value as the reader should see it: money, a count, a percentage. */
  display: string;
  /** A second line under the label. Units sold, order count, a date. */
  secondary?: string;
  /** Overrides the accent. Used where the row means a state, not a quantity. */
  tone?: Tone;
  href?: string;
};

export function BarList({
  items,
  className,
  /** Set when the bars should be read against a fixed ceiling rather than the
   *  biggest row — e.g. a status breakdown scaled to the total order count. */
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
    /* `gap-2` is the surface gap doing the separating: 8px of card between bars,
       comfortably past the 2px minimum, because these rows carry two lines of
       text each and would crowd at the floor. */
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
                {/* Share appears on hover and on keyboard focus alike — the same
                    detail either way, never pointer-only. It rides the top line
                    so a list with no second line stays compact. */}
                <span className="text-xs text-ink-subtle opacity-0 transition-opacity tabular-nums group-hover/bar:opacity-100 group-focus-visible/bar:opacity-100">
                  {share.toFixed(share < 10 ? 1 : 0)}%
                </span>
                {/* Value at the tip of the row, tabular so the column aligns. */}
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
