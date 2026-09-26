"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  MAX_QUANTITY,
  lineKey,
  lineTotal,
  remove,
  setQuantity,
  setSelected,
  type CartLine,
} from "@/shared/libs/cart";
import { productHref } from "@/shared/config/products";
import { formatPrice } from "@/shared/utils/price";
import { cn } from "@/shared/utils/cn";
import { cart_data } from "../config/constants";
import { lineImage } from "../lineImage";

export function CartRow({ line }: { line: CartLine }) {
  const key = lineKey(line);

  const image = lineImage(line);

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line py-5 last:border-0 sm:flex-nowrap",
        !line.selected && "opacity-60",
      )}
    >
      <input
        type="checkbox"
        checked={line.selected}
        onChange={(event) => setSelected(key, event.target.checked)}
        aria-label={`Include ${line.name} in the total`}
        className="size-5 shrink-0 accent-tertiary"
      />

      <Link
        href={productHref(line.slug)}
        className="shrink-0"
        tabIndex={-1}
        aria-hidden
      >
        {image ? (
          <Image
            src={image}
            alt=""
            sizes="80px"
            className="size-20 object-contain"
          />
        ) : (
          <span className="block size-20 bg-surface-muted" />
        )}
      </Link>

      <div className="min-w-0 flex-1 basis-48">
        <Link
          href={productHref(line.slug)}
          className="font-medium text-ink transition-colors hover:text-tertiary"
        >
          {line.name}
        </Link>

        {(line.color || Object.keys(line.options).length > 0) && (
          <dl className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {line.color && (
              <div className="flex items-center gap-1.5">
                <dt className="text-ink-muted">{cart_data.color}:</dt>
                <dd className="rounded-control bg-surface-muted px-2 py-0.5 text-ink">
                  {line.color}
                </dd>
              </div>
            )}
            {Object.entries(line.options).map(([label, value]) => (
              <div key={label} className="flex items-center gap-1.5">
                <dt className="text-ink-muted">{label}:</dt>
                <dd className="rounded-control bg-surface-muted px-2 py-0.5 text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="text-right">
        <p className="font-bold text-tertiary">
          {formatPrice(lineTotal(line))}
        </p>
        {line.quantity > 1 && (
          <p className="mt-0.5 text-sm text-ink-subtle">
            {formatPrice(line.unitPrice)} {cart_data.each}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setQuantity(key, line.quantity - 1)}
          aria-label={`${cart_data.decrease} — ${line.name}`}
          className="grid size-9 place-items-center rounded-control bg-surface-muted text-ink transition-colors hover:bg-line"
        >
          <Minus className="size-4" aria-hidden />
        </button>

        <span
          aria-live="polite"
          className="min-w-9 text-center font-medium text-ink tabular-nums"
        >
          {line.quantity}
        </span>

        <button
          type="button"
          onClick={() => setQuantity(key, line.quantity + 1)}
          disabled={line.quantity >= MAX_QUANTITY}
          aria-label={`${cart_data.increase} — ${line.name}`}
          className="grid size-9 place-items-center rounded-control bg-surface-muted text-ink transition-colors hover:bg-line disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>

      <button
        type="button"
        onClick={() => remove(key)}
        aria-label={cart_data.removeOne.replace("{name}", line.name)}
        className="grid size-9 place-items-center rounded-control text-ink-subtle transition-colors hover:bg-danger-soft hover:text-danger"
      >
        <Trash2 className="size-4.5" aria-hidden />
      </button>
    </li>
  );
}
