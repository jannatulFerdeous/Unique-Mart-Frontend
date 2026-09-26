import { useCallback, useSyncExternalStore } from "react";

export type WishItem = {
  slug: string;
  addedAt: string;
};

const KEY = "unique-mart.wishlist.v1";
const CHANGED = "unique-mart:wishlist-changed";

export const MAX_ITEMS = 200;

const stored = (): string | null => {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

const EMPTY: WishItem[] = [];

const isItem = (value: unknown): value is WishItem =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as WishItem).slug === "string" &&
  (value as WishItem).slug.length > 0;

const parse = (raw: string | null): WishItem[] => {
  if (!raw) return EMPTY;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;

    const items = parsed.filter(isItem).map((item) => ({
      slug: item.slug,
      addedAt: typeof item.addedAt === "string" ? item.addedAt : new Date().toISOString(),
    }));

    const sorted = items.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    return sorted.length ? sorted : EMPTY;
  } catch {
    return EMPTY;
  }
};

let cache: { raw: string | null; items: WishItem[] } | null = null;

export const read = (): WishItem[] => {
  if (typeof window === "undefined") return EMPTY;

  const raw = stored();
  if (cache && cache.raw === raw) return cache.items;

  const items = parse(raw);
  cache = { raw, items };
  return items;
};

const announce = () => {
  window.dispatchEvent(new CustomEvent(CHANGED));
};

const write = (items: WishItem[]): WishItem[] => {
  try {
    if (items.length) window.localStorage.setItem(KEY, JSON.stringify(items));
    else window.localStorage.removeItem(KEY);
  } catch {
  }

  cache = { raw: stored(), items };
  announce();
  return items;
};

export const has = (slug: string): boolean => read().some((item) => item.slug === slug);

export const add = (slug: string): WishItem[] => {
  const items = read();
  if (items.some((item) => item.slug === slug)) return items;

  return write([{ slug, addedAt: new Date().toISOString() }, ...items].slice(0, MAX_ITEMS));
};

export const remove = (slug: string): WishItem[] =>
  write(read().filter((item) => item.slug !== slug));

export const toggle = (slug: string): boolean => {
  if (has(slug)) {
    remove(slug);
    return false;
  }
  add(slug);
  return true;
};

export const clear = (): WishItem[] => write([]);

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

export const useWishlist = () => {
  const items = useSyncExternalStore(subscribe, read, serverSnapshot);

  return { items, count: items.length, add, remove, toggle, has, clear };
};

export const useIsWished = (slug: string): boolean =>
  useSyncExternalStore(
    subscribe,
    useCallback(() => has(slug), [slug]),
    () => false,
  );

export const useWishlistCount = (): number =>
  useSyncExternalStore(
    subscribe,
    useCallback(() => read().length, []),
    () => 0,
  );
