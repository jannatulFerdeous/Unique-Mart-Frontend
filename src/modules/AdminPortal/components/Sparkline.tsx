import { cn } from "@/shared/utils/cn";

const WIDTH = 96;
const HEIGHT = 28;
const PAD = 2;

export function Sparkline({
  values,
  className,
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
