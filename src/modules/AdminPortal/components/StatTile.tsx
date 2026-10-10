import type { ReactNode } from "react";
import { formatDelta } from "@/shared/libs/admin/format";
import { cn } from "@/shared/utils/cn";
import { Sparkline } from "./Sparkline";

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
  delta?: number | null;
  deltaLabel?: string;
  upIsGood?: boolean;
  trend?: number[];
  note?: string;
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
        <p
          className={cn(
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
