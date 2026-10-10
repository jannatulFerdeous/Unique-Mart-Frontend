"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useRemoveCartItemMutation, useUpdateCartItemMutation } from "@/redux/features/cart/cartApi";
import { MAX_QUANTITY, lineTotal, type CartLine } from "@/shared/libs/cart";
import { productHref } from "@/shared/libs/storefront/catalog";
import { toast } from "@/shared/libs/toast";
import { formatPrice } from "@/shared/utils/price";
import { cart_data } from "../config/constants";

export function CartRow({ line }: { line: CartLine }) {
  const [update, updating] = useUpdateCartItemMutation();
  const [remove, removing] = useRemoveCartItemMutation();
  const busy = updating.isLoading || removing.isLoading;
  const href = line.slug ? productHref(line.slug) : null;

  const act = async (action: () => Promise<unknown>) => {
    try {
      await action();
    } catch (problem) {
      toast("danger", apiErrorMessage(problem, "Couldn't update your basket. Please try again."));
    }
  };

  const setQuantity = (quantity: number) =>
    act(() =>
      quantity < 1
        ? remove(line.id).unwrap()
        : update({ itemId: line.id, quantity: Math.min(MAX_QUANTITY, quantity) }).unwrap(),
    );

  const removeButton = (
    <button
      type="button"
      onClick={() => act(() => remove(line.id).unwrap())}
      disabled={busy}
      aria-label={cart_data.removeOne.replace("{name}", line.name)}
      className="grid size-9 place-items-center rounded-control text-ink-subtle transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-40"
    >
      <Trash2 className="size-4.5" aria-hidden />
    </button>
  );

  if (line.missing) {
    return (
      <li className="flex items-center justify-between gap-4 border-b border-line py-5 last:border-0">
        <div className="min-w-0">
          <p className="font-medium text-ink">{line.name}</p>
          <p className="mt-1 text-sm text-danger">{cart_data.missing}</p>
        </div>
        {removeButton}
      </li>
    );
  }

  const options = Object.entries(line.options);

  return (
    <li
      aria-busy={busy}
      className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line py-5 last:border-0 sm:flex-nowrap"
    >
      {href && (
        <Link href={href} className="shrink-0" tabIndex={-1} aria-hidden>
          {line.image ? (
            <Image src={line.image} alt="" sizes="80px" className="size-20 object-contain" />
          ) : (
            <span className="block size-20 bg-surface-muted" />
          )}
        </Link>
      )}

      <div className="min-w-0 flex-1 basis-48">
        {href ? (
          <Link href={href} className="font-medium text-ink transition-colors hover:text-tertiary">
            {line.name}
          </Link>
        ) : (
          <p className="font-medium text-ink">{line.name}</p>
        )}

        {options.length > 0 && (
          <dl className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {options.map(([label, value]) => (
              <div key={label} className="flex items-center gap-1.5">
                <dt className="text-ink-muted">{label}:</dt>
                <dd className="rounded-control bg-surface-muted px-2 py-0.5 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="text-right">
        <p className="font-bold text-tertiary">{formatPrice(lineTotal(line))}</p>
        {line.quantity > 1 && (
          <p className="mt-0.5 text-sm text-ink-subtle">
            {formatPrice(line.unitPrice)} {cart_data.each}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setQuantity(line.quantity - 1)}
          disabled={busy}
          aria-label={`${cart_data.decrease} — ${line.name}`}
          className="grid size-9 place-items-center rounded-control bg-surface-muted text-ink transition-colors hover:bg-line disabled:opacity-40"
        >
          <Minus className="size-4" aria-hidden />
        </button>

        <span aria-live="polite" className="min-w-9 text-center font-medium text-ink tabular-nums">
          {line.quantity}
        </span>

        <button
          type="button"
          onClick={() => setQuantity(line.quantity + 1)}
          disabled={busy || line.quantity >= Math.min(MAX_QUANTITY, line.stock)}
          aria-label={`${cart_data.increase} — ${line.name}`}
          className="grid size-9 place-items-center rounded-control bg-surface-muted text-ink transition-colors hover:bg-line disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>

      {removeButton}
    </li>
  );
}
