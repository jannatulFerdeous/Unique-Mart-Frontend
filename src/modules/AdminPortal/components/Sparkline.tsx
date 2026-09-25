import { cn } from "@/shared/utils/cn";

/* A trend, not a chart: no axes, no labels, no hover. It answers "which way"
   and nothing else, which is the whole job of the line on a stat tile. The
   figure beside it carries the number, and the chart below carries the detail. */

const WIDTH = 96;
const HEIGHT = 28;
/** Half the stroke, so the line's own thickness never clips at the edges. */
const PAD = 2;

export function Sparkline({
  values,
  className,
  /** Painted in the accent when the tile is the one being watched, and in a
   *  recessive grey otherwise — a row of six saturated sparklines competes with
   *  the figures it is supposed to support. */
  accent = false,
}: {
  values: number[];
  className?: string;
  accent?: boolean;
}) {
  if (values.length < 2) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;

  const points = values.map((value, index) => {
    const x = PAD + (index / (values.length - 1)) * (WIDTH - PAD * 2);
    const y = HEIGHT - PAD - ((value - min) / span) * (HEIGHT - PAD * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const last = points[points.length - 1].split(",");

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      /* Decoration: the tile states the value and the delta in text, so there is
         nothing here for a screen reader that it will not already have heard. */
      aria-hidden
      focusable="false"
      className={cn("shrink-0 overflow-visible", className)}
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={accent ? "var(--color-tertiary)" : "var(--color-line-strong)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* The end point, ringed in the surface colour so it stays a dot where the
          line doubles back under it. */}
      <circle
        cx={last[0]}
        cy={last[1]}
        r="2.5"
        fill={accent ? "var(--color-tertiary)" : "var(--color-ink-subtle)"}
        stroke="var(--color-surface)"
        strokeWidth="2"
      />
    </svg>
  );
}
