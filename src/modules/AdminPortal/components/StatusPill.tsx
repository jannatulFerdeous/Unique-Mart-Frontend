import { cn } from "@/shared/utils/cn";
import type { Tone } from "../config/types";

/* Two channels, always: a word and a colour. The word is what carries the
   meaning — colour alone fails for a colourblind reader, in greyscale print and
   under forced-colors, and a fulfilment state is not something to guess at.

   The five in-flow states sit on the neutral surface: they are routine, and
   seven coloured bands down a table is noise. The reserved status colours get a
   tinted background, because leaving the flow — cancelled, refunded, failed —
   is the row you want your eye to catch. */
const TONE: Record<Tone, { fill: string; dot: string }> = {
  neutral: { fill: "bg-surface-muted text-ink", dot: "bg-line-strong" },
  "flow-1": { fill: "bg-surface-muted text-ink", dot: "bg-flow-1" },
  "flow-2": { fill: "bg-surface-muted text-ink", dot: "bg-flow-2" },
  "flow-3": { fill: "bg-surface-muted text-ink", dot: "bg-flow-3" },
  "flow-4": { fill: "bg-surface-muted text-ink", dot: "bg-flow-4" },
  "flow-5": { fill: "bg-surface-muted text-ink", dot: "bg-flow-5" },
  good: { fill: "bg-good-soft text-ink", dot: "bg-good" },
  warning: { fill: "bg-warning-soft text-ink", dot: "bg-warning" },
  serious: { fill: "bg-serious-soft text-ink", dot: "bg-serious" },
  critical: { fill: "bg-critical-soft text-ink", dot: "bg-critical" },
};

export function StatusPill({
  label,
  tone,
  className,
}: {
  label: string;
  tone: Tone;
  className?: string;
}) {
  const painted = TONE[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-control px-2 py-1 text-xs font-medium whitespace-nowrap",
        painted.fill,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", painted.dot)} />
      {label}
    </span>
  );
}

/** The colour a tone paints with, for a chart mark rather than a pill. */
export const TONE_VAR: Record<Tone, string> = {
  neutral: "var(--color-line-strong)",
  "flow-1": "var(--color-flow-1)",
  "flow-2": "var(--color-flow-2)",
  "flow-3": "var(--color-flow-3)",
  "flow-4": "var(--color-flow-4)",
  "flow-5": "var(--color-flow-5)",
  good: "var(--color-good)",
  warning: "var(--color-warning)",
  serious: "var(--color-serious)",
  critical: "var(--color-critical)",
};
