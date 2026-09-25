/* The shopping basket, stored in the visitor's own browser.
 *
 * There is no backend yet, so a basket lives in `localStorage` on the device
 * that filled it and reaches nobody else. Same bargain as `session` and
 * `reviews`, and the same seam: when a cart API lands, `read` and `write` below
 * are the two functions to reroute and every screen keeps working.
 *
 * Every `localStorage` access is wrapped: it throws outright in some contexts
 * (Safari private mode, embedded previews, browsers set to block site data),
 * and the cart page must still render when it does.
 *
 * WHAT A LINE IS. Not a product — a product in one configuration. The black
 * power bank and the blue one are the same slug and two different things to
 * buy, so the identity of a line is its slug plus every variant chosen on it.
 * `lineKey` is that identity, and it is what quantity changes and removals are
 * addressed by. Getting this wrong is how "add blue" silently increments the
 * black one. */

import { useCallback, useSyncExternalStore } from "react";

export type CartLine = {
  slug: string;
  /** Copied at the time of adding. A later catalogue rename must not rewrite
   *  what the shopper thought they were buying. */
  name: string;
  /** Taka, per unit, as shown when it was added. */
  unitPrice: number;
  /** The chosen colour's name, or null for a product with no colour axis. */
  color: string | null;
  /** Every other axis the catalogue records — Storage, Memory, Strap Size. */
  options: Record<string, string>;
  quantity: number;
  /** ISO 8601, so the stored value is stable across locales. */
  addedAt: string;
  /** Whether this line is included in the total. The cart page's checkboxes
   *  write it, so a shopper can leave something for later without deleting it. */
  selected: boolean;
};

/** What a caller has to supply. Everything else is filled in here. */
export type CartDraft = Omit<CartLine, "addedAt" | "selected" | "quantity"> & {
  quantity?: number;
};

const KEY = "unique-mart.cart.v1";
const CHANGED = "unique-mart:cart-changed";

/** How many of one line a shopper may hold. High enough never to be met in a
 *  real order, low enough that a stuck "+" key cannot ask for 40,000 phones. */
export const MAX_QUANTITY = 99;

/** A line's identity: the product and the exact configuration of it.
 *
 *  Option keys are sorted so that two lines built in a different order still
 *  collide — `{Storage, Colour}` and `{Colour, Storage}` are one basket line. */
export const lineKey = (line: Pick<CartLine, "slug" | "color" | "options">): string => {
  const options = Object.entries(line.options ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => `${label}=${value}`)
    .join("&");

  return [line.slug, line.color ?? "", options].join("|");
};

const stored = (): string | null => {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

const EMPTY: CartLine[] = [];

const isLine = (value: unknown): value is CartLine => {
  if (typeof value !== "object" || value === null) return false;
  const each = value as Record<string, unknown>;

  return (
    typeof each.slug === "string" &&
    each.slug.length > 0 &&
    typeof each.name === "string" &&
    typeof each.unitPrice === "number" &&
    Number.isFinite(each.unitPrice) &&
    typeof each.quantity === "number" &&
    Number.isFinite(each.quantity) &&
    each.quantity > 0 &&
    (typeof each.color === "string" || each.color === null)
  );
};

/** Fills in anything a stored line is missing, so a payload written by an older
 *  build does not have to be thrown away wholesale. */
const revive = (value: unknown): CartLine => {
  const each = value as CartLine;
  return {
    ...each,
    options: typeof each.options === "object" && each.options !== null ? each.options : {},
    selected: each.selected !== false,
    quantity: Math.min(MAX_QUANTITY, Math.max(1, Math.round(each.quantity))),
    addedAt: typeof each.addedAt === "string" ? each.addedAt : new Date().toISOString(),
  };
};

const parse = (raw: string | null): CartLine[] => {
  if (!raw) return EMPTY;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;

    const lines = parsed.filter(isLine).map(revive);
    return lines.length ? lines : EMPTY;
  } catch {
    return EMPTY;
  }
};

/* `useSyncExternalStore` compares snapshots by identity and would re-render
   forever if a fresh array came back each call, so the parsed basket is cached
   against the exact string it was parsed from. */
let cache: { raw: string | null; lines: CartLine[] } | null = null;

/** The basket, oldest line first — the order things were put in. */
export const read = (): CartLine[] => {
  if (typeof window === "undefined") return EMPTY;

  const raw = stored();
  if (cache && cache.raw === raw) return cache.lines;

  const lines = parse(raw);
  cache = { raw, lines };
  return lines;
};

const announce = () => {
  window.dispatchEvent(new CustomEvent(CHANGED));
};

const write = (lines: CartLine[]): CartLine[] => {
  try {
    /* An empty basket removes the key rather than storing "[]", so a shopper who
       clears their cart leaves nothing behind. */
    if (lines.length) window.localStorage.setItem(KEY, JSON.stringify(lines));
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked or full — hold it for this page view only.
  }

  cache = { raw: stored(), lines };
  announce();
  return lines;
};

/** Adds a line, or adds to the quantity of the matching one.
 *
 *  "Matching" means the same product in the same configuration — see `lineKey`.
 *  Re-adding also re-selects the line, because a shopper who just added
 *  something means to buy it. */
export const add = (draft: CartDraft): CartLine[] => {
  const wanted = Math.min(MAX_QUANTITY, Math.max(1, Math.round(draft.quantity ?? 1)));
  const key = lineKey(draft);
  const lines = read();
  const held = lines.find((line) => lineKey(line) === key);

  if (held) {
    return write(
      lines.map((line) =>
        lineKey(line) === key
          ? {
              ...line,
              quantity: Math.min(MAX_QUANTITY, line.quantity + wanted),
              selected: true,
              /* The price is refreshed to what the shop is asking now. A basket
                 that quietly keeps last month's price is a promise the checkout
                 cannot keep. */
              unitPrice: draft.unitPrice,
            }
          : line,
      ),
    );
  }

  return write([
    ...lines,
    {
      slug: draft.slug,
      name: draft.name,
      unitPrice: draft.unitPrice,
      color: draft.color,
      options: draft.options ?? {},
      quantity: wanted,
      addedAt: new Date().toISOString(),
      selected: true,
    },
  ]);
};

export const setQuantity = (key: string, quantity: number): CartLine[] => {
  const wanted = Math.round(quantity);
  // Stepping below one removes the line, which is what the "−" at 1 should do.
  if (wanted < 1) return remove(key);

  return write(
    read().map((line) =>
      lineKey(line) === key ? { ...line, quantity: Math.min(MAX_QUANTITY, wanted) } : line,
    ),
  );
};

export const remove = (key: string): CartLine[] =>
  write(read().filter((line) => lineKey(line) !== key));

export const setSelected = (key: string, selected: boolean): CartLine[] =>
  write(read().map((line) => (lineKey(line) === key ? { ...line, selected } : line)));

export const setAllSelected = (selected: boolean): CartLine[] =>
  write(read().map((line) => ({ ...line, selected })));

export const clear = (): CartLine[] => write([]);

/* ------------------------------------------------------------- read models */

export const lineTotal = (line: CartLine): number => line.unitPrice * line.quantity;

/** Units in the basket — what the header badge counts. Every line, selected or
 *  not: the badge answers "what is in my basket", not "what will I pay for". */
export const countOf = (lines: CartLine[]): number =>
  lines.reduce((sum, line) => sum + line.quantity, 0);

/** Only the ticked lines. The order summary and the total are built from these,
 *  because that is what the checkboxes mean. */
export const selectedOf = (lines: CartLine[]): CartLine[] =>
  lines.filter((line) => line.selected);

export const subtotalOf = (lines: CartLine[]): number =>
  selectedOf(lines).reduce((sum, line) => sum + lineTotal(line), 0);

/* ------------------------------------------------------------------- hooks */

const subscribe = (onStoreChange: () => void) => {
  const handle = (event: Event) => {
    // A `storage` event with a null key means "cleared", which concerns us.
    if (event instanceof StorageEvent && event.key !== null && event.key !== KEY) return;
    onStoreChange();
  };

  window.addEventListener(CHANGED, handle);
  window.addEventListener("storage", handle);
  return () => {
    window.removeEventListener(CHANGED, handle);
    window.removeEventListener("storage", handle);
  };
};

const serverSnapshot = () => EMPTY;

/** The basket, kept in step across components and browser tabs.
 *
 *  `getServerSnapshot` returns an empty basket, so prerendered HTML is always
 *  the empty state and React swaps in the stored one right after hydration —
 *  which is what `useSyncExternalStore` exists to make safe. */
export const useCart = () => {
  const lines = useSyncExternalStore(subscribe, read, serverSnapshot);

  return {
    lines,
    count: countOf(lines),
    selected: selectedOf(lines),
    subtotal: subtotalOf(lines),
    add,
    setQuantity,
    remove,
    setSelected,
    setAllSelected,
    clear,
  };
};

/** Just the badge number, for components that need nothing else. */
export const useCartCount = (): number =>
  useSyncExternalStore(
    subscribe,
    useCallback(() => countOf(read()), []),
    () => 0,
  );
