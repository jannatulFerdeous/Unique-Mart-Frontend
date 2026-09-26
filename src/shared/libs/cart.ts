import { useCallback, useSyncExternalStore } from "react";

export type CartLine = {
  slug: string;
  name: string;
  unitPrice: number;
  color: string | null;
  options: Record<string, string>;
  quantity: number;
  addedAt: string;
  selected: boolean;
};

export type CartDraft = Omit<CartLine, "addedAt" | "selected" | "quantity"> & {
  quantity?: number;
};

const KEY = "unique-mart.cart.v1";
const CHANGED = "unique-mart:cart-changed";

export const MAX_QUANTITY = 99;

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

let cache: { raw: string | null; lines: CartLine[] } | null = null;

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
    if (lines.length) window.localStorage.setItem(KEY, JSON.stringify(lines));
    else window.localStorage.removeItem(KEY);
  } catch {
  }

  cache = { raw: stored(), lines };
  announce();
  return lines;
};

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

export const lineTotal = (line: CartLine): number => line.unitPrice * line.quantity;

export const countOf = (lines: CartLine[]): number =>
  lines.reduce((sum, line) => sum + line.quantity, 0);

export const selectedOf = (lines: CartLine[]): CartLine[] =>
  lines.filter((line) => line.selected);

export const subtotalOf = (lines: CartLine[]): number =>
  selectedOf(lines).reduce((sum, line) => sum + lineTotal(line), 0);

const subscribe = (onStoreChange: () => void) => {
  const handle = (event: Event) => {
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

export const useCartCount = (): number =>
  useSyncExternalStore(
    subscribe,
    useCallback(() => countOf(read()), []),
    () => 0,
  );
