"use client";

import { useId } from "react";
import { category_data } from "../config/constants";

type Props = {
  bounds: { min: number; max: number };
  value: { min: number; max: number };
  onChange: (next: { min: number; max: number }) => void;
};

export function PriceRange({ bounds, value, onChange }: Props) {
  const fieldId = useId();
  const { priceFrom, priceTo } = category_data;

  const span = Math.max(1, bounds.max - bounds.min);
  const left = ((value.min - bounds.min) / span) * 100;
  const right = ((value.max - bounds.min) / span) * 100;

  const step = Math.max(1, Math.round(span / 100 / 100) * 100);

  const setMin = (raw: number) =>
    onChange({
      min: Math.min(Number.isFinite(raw) ? Math.max(bounds.min, raw) : bounds.min, value.max),
      max: value.max,
    });

  const setMax = (raw: number) =>
    onChange({
      min: value.min,
      max: Math.max(Number.isFinite(raw) ? Math.min(bounds.max, raw) : bounds.max, value.min),
    });

  return (
    <div>
      <div className="relative h-5">
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-line" />
        <span
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-tertiary"
          style={{ left: `${left}%`, right: `${100 - right}%` }}
        />

        <input
          type="range"
          aria-label={priceFrom}
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={value.min}
          onChange={(event) => setMin(event.target.valueAsNumber)}
          className="range-thumb absolute inset-0 w-full"
        />
        <input
          type="range"
          aria-label={priceTo}
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={value.max}
          onChange={(event) => setMax(event.target.valueAsNumber)}
          className="range-thumb absolute inset-0 w-full"
        />
      </div>

      <div className="mt-4 flex items-end gap-3">
        <span className="flex-1">
          <label
            htmlFor={`${fieldId}-min`}
            className="block font-bold text-ink"
          >
            {priceFrom} ৳
          </label>
          <input
            id={`${fieldId}-min`}
            type="number"
            inputMode="numeric"
            value={value.min}
            min={bounds.min}
            max={value.max}
            onChange={(event) => setMin(event.target.valueAsNumber)}
            className="mt-1 w-full rounded-control border border-line-strong bg-surface p-2 text-base text-ink tabular-nums"
          />
        </span>

        <span className="flex-1">
          <label
            htmlFor={`${fieldId}-max`}
            className="block font-bold text-ink"
          >
            {priceTo} ৳
          </label>
          <input
            id={`${fieldId}-max`}
            type="number"
            inputMode="numeric"
            value={value.max}
            min={value.min}
            max={bounds.max}
            onChange={(event) => setMax(event.target.valueAsNumber)}
            className="mt-1 w-full rounded-control border border-line-strong bg-surface p-2 text-base text-ink tabular-nums"
          />
        </span>
      </div>
    </div>
  );
}
