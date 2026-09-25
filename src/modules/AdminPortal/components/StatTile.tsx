import type { ReactNode } from "react";
import { formatDelta } from "@/shared/libs/admin/format";
import { cn } from "@/shared/utils/cn";
import { Sparkline } from "./Sparkline";

/* label · value · delta · trend. One contract, so a row of these reads as a row
   rather than six small decisions.

   The delta's colour is direction times whether up is good, which is not the
   same question: revenue rising is green, abandoned baskets rising is not. Every
   caller states `upIsGood` rather than inheriting a default that flatters. */
export function StatTile({
  label,
  value,
  delta,
  deltaLabel,
  upIsGood = true,
  trend,
  note,
  hero = false,
  action,
  className,
}: {
  label: string;
  value: string;
  /** Per cent change, or null when there is no baseline to compare with. */
  delta?: number | null;
  /** Names the period the delta is against. Without it a delta means nothing. */
  deltaLabel?: string;
  upIsGood?: boolean;
  trend?: number[];
  note?: string;
  /** The one figure the screen leads with. Exactly one per view. */
  hero?: boolean;
  action?: ReactNode;
  className?: string;
}) {
  const direction = delta === null || delta === undefined || Math.abs(delta) < 0.05 ? 0 : delta > 0 ? 1 : -1;
  const good = direction === 0 ? null : direction > 0 === upIsGood;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-card border border-line bg-surface p-4 shadow-card",
        hero && "md:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-ink-muted">{label}</p>
        {action}
      </div>

      <div className="flex items-end justify-between gap-3">
        {/* Proportional figures, not tabular: at this size `tabular-nums` makes
            every digit as wide as a zero and the number reads loose. */}
        <p
          className={cn(
            /* `whitespace-nowrap`, because a compact figure like "Tk 79.7 L"
               holds spaces and will break across three lines in a narrow tile.
               The hero spans two columns so it has the room. */
            "font-sans leading-none font-bold whitespace-nowrap text-ink",
            hero ? "text-4xl md:text-5xl" : "text-2xl",
          )}
        >
          {value}
        </p>
        {trend && trend.length > 1 && <Sparkline values={trend} accent={hero} />}
      </div>

      {(delta !== undefined || note) && (
        <p className="flex flex-wrap items-baseline gap-x-1.5 text-xs text-ink-subtle">
          {delta !== undefined && (
            <span
              className={cn(
                "font-medium tabular-nums",
                good === null ? "text-ink-muted" : good ? "text-good" : "text-critical",
              )}
            >
              {formatDelta(delta ?? null)}
            </span>
          )}
          {delta !== undefined && deltaLabel && <span>{deltaLabel}</span>}
          {note && <span>{note}</span>}
        </p>
      )}
    </div>
  );
}
