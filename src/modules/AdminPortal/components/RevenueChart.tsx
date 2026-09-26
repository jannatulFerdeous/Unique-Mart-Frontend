"use client";

import { useMemo, useState } from "react";
import type { DayPoint } from "@/shared/libs/admin/metrics";
import {
  formatDate,
  formatDayShort,
  formatMoney,
  formatMoneyCompact,
  niceScale,
} from "@/shared/libs/admin/format";
import { admin_data } from "../config/constants";
import { Button } from "./Button";
import { Table, TableScroll, Td, TdNum, Th, ThNum, Tr } from "./Table";

const VIEW_W = 720;
const VIEW_H = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 58 };

const PLOT_W = VIEW_W - PAD.left - PAD.right;
const PLOT_H = VIEW_H - PAD.top - PAD.bottom;

const BANDS = 4;

export function RevenueChart({ series }: { series: DayPoint[] }) {
  const { common } = admin_data;
  const [asTable, setAsTable] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const { max } = useMemo(
    () =>
      niceScale(Math.max(...series.map((point) => point.revenue), 1), BANDS),
    [series],
  );

  const geometry = useMemo(() => {
    const step = series.length > 1 ? PLOT_W / (series.length - 1) : 0;

    const points = series.map((point, index) => ({
      ...point,
      x: PAD.left + index * step,
      y: PAD.top + PLOT_H * (1 - point.revenue / max),
    }));

    const line = points
      .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(" ");

    const baseline = PAD.top + PLOT_H;

    const area = points.length
      ? [
          `M ${points[0].x.toFixed(1)} ${baseline}`,
          ...points.map(
            (point) => `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
          ),
          `L ${points[points.length - 1].x.toFixed(1)} ${baseline}`,
          "Z",
        ].join(" ")
      : "";

    const peak = points.reduce(
      (best, point) => (point.revenue > best.revenue ? point : best),
      points[0],
    );

    return { points, line, area, baseline, peak };
  }, [series, max]);

  const tickEvery = Math.max(1, Math.ceil(series.length / 5));

  const total = series.reduce((sum, point) => sum + point.revenue, 0);
  const shown = active === null ? null : geometry.points[active];

  const track = (clientX: number, target: SVGSVGElement) => {
    const box = target.getBoundingClientRect();
    if (!box.width) return;

    const x = ((clientX - box.left) / box.width) * VIEW_W;
    const fraction = (x - PAD.left) / (PLOT_W || 1);
    const index = Math.round(fraction * (series.length - 1));
    setActive(Math.min(series.length - 1, Math.max(0, index)));
  };

  const step = (delta: number) => {
    setActive((current) => {
      const next = (current ?? series.length - 1) + delta;
      return Math.min(series.length - 1, Math.max(0, next));
    });
  };

  if (asTable) {
    return (
      <div>
        <Toggle asTable onToggle={() => setAsTable(false)} />
        <TableScroll>
          <Table className="min-w-md">
            <thead>
              <tr>
                <Th>Day</Th>
                <ThNum>Revenue</ThNum>
                <ThNum>Orders</ThNum>
              </tr>
            </thead>
            <tbody>
              {series.map((point) => (
                <Tr key={point.date}>
                  <Td>{formatDate(point.date)}</Td>
                  <TdNum>{formatMoney(point.revenue)}</TdNum>
                  <TdNum>{point.orders}</TdNum>
                </Tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <Td className="font-semibold">Total</Td>
                <TdNum className="font-semibold">{formatMoney(total)}</TdNum>
                <TdNum className="font-semibold">
                  {series.reduce((sum, point) => sum + point.orders, 0)}
                </TdNum>
              </tr>
            </tfoot>
          </Table>
        </TableScroll>
      </div>
    );
  }

  return (
    <div>
      <Toggle asTable={false} onToggle={() => setAsTable(true)} />

      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full touch-pan-y"
          style={{ height: "auto", aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
          role="img"
          aria-label={`Revenue per day. ${formatMoneyCompact(total)} over ${series.length} days, peaking at ${formatMoneyCompact(geometry.peak?.revenue ?? 0)}.`}
          tabIndex={0}
          onPointerMove={(event) => track(event.clientX, event.currentTarget)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive((current) => current ?? series.length - 1)}
          onBlur={() => setActive(null)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              step(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              step(-1);
            }
            if (event.key === "Escape") setActive(null);
          }}
        >
          {Array.from({ length: BANDS + 1 }, (_, band) => {
            const value = (max / BANDS) * band;
            const y = PAD.top + PLOT_H * (1 - band / BANDS);

            return (
              <g key={band}>
                <line
                  x1={PAD.left}
                  x2={VIEW_W - PAD.right}
                  y1={y}
                  y2={y}
                  stroke={
                    band === 0
                      ? "var(--color-line-strong)"
                      : "var(--color-line)"
                  }
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-ink-subtle text-[11px] tabular-nums"
                >
                  {formatMoneyCompact(value)}
                </text>
              </g>
            );
          })}

          <path
            d={geometry.area}
            fill="var(--color-tertiary)"
            fillOpacity="0.1"
          />
          <polyline
            points={geometry.line}
            fill="none"
            stroke="var(--color-tertiary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {series.map((point, index) =>
            index % tickEvery === 0 || index === series.length - 1 ? (
              <text
                key={point.date}
                x={geometry.points[index].x}
                y={VIEW_H - 8}
                textAnchor={
                  index === series.length - 1
                    ? "end"
                    : index === 0
                      ? "start"
                      : "middle"
                }
                className="fill-ink-subtle text-[11px]"
              >
                {formatDayShort(point.date)}
              </text>
            ) : null,
          )}

          {geometry.peak && geometry.peak.revenue > 0 && (
            <text
              x={Math.min(
                VIEW_W - PAD.right - 4,
                Math.max(PAD.left + 24, geometry.peak.x),
              )}
              y={Math.max(PAD.top + 10, geometry.peak.y - 10)}
              textAnchor="middle"
              className="fill-ink text-[11px] font-semibold tabular-nums"
            >
              {formatMoneyCompact(geometry.peak.revenue)}
            </text>
          )}

          {shown && (
            <g>
              <line
                x1={shown.x}
                x2={shown.x}
                y1={PAD.top}
                y2={geometry.baseline}
                stroke="var(--color-line-strong)"
                strokeWidth="1"
              />
              <circle
                cx={shown.x}
                cy={shown.y}
                r="4.5"
                fill="var(--color-tertiary)"
                stroke="var(--color-surface)"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {shown && (
          <div
            role="status"
            className="pointer-events-none absolute top-2 min-w-36 rounded-control border border-line bg-surface px-3 py-2 shadow-menu"
            style={{
              left: `${(shown.x / VIEW_W) * 100}%`,
              transform:
                shown.x / VIEW_W > 0.66
                  ? "translateX(calc(-100% - 10px))"
                  : "translateX(10px)",
            }}
          >
            <p className="font-sans text-sm font-bold text-ink tabular-nums">
              {formatMoney(shown.revenue)}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
              <span
                aria-hidden
                className="h-0.5 w-3 rounded-full bg-tertiary"
              />
              {formatDate(shown.date)}
            </p>
            <p className="text-xs text-ink-subtle tabular-nums">
              {shown.orders} {shown.orders === 1 ? "order" : "orders"}
            </p>
          </div>
        )}
      </div>

      <p className="mt-1 text-xs text-ink-subtle">
        Hover, or focus the chart and use the arrow keys. {common.table} view
        has every figure.
      </p>
    </div>
  );
}

function Toggle({
  asTable,
  onToggle,
}: {
  asTable: boolean;
  onToggle: () => void;
}) {
  const { common } = admin_data;

  return (
    <div className="mb-2 flex justify-end">
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggle}
        aria-pressed={asTable}
      >
        {asTable ? common.chart : common.table}
      </Button>
    </div>
  );
}
