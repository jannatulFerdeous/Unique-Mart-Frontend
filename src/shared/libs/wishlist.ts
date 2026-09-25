/* Saved products, stored in the visitor's own browser.
 *
 * There is no backend yet, so a wishlist lives in `localStorage` on the device
 * that made it and reaches nobody else. Same bargain as `session`, `reviews`
 * and `cart`, and the same seam: when an API lands, `read` and `write` below
 * are the two functions to reroute and every screen keeps working.
 *
 * WHAT A WISHLIST ITEM IS, AND HOW IT DIFFERS FROM A BASKET LINE. A basket line
 * is a product in one configuration — black and blue are two lines, because you
 * are buying a specific thing. A wishlist item is just the product. Someone
 * hearts a phone from a grid of cards, where no colour has been chosen and
 * asking them to choose one would be absurd; they are saying "remember this",
 * not "reserve me the blue one".
 *
 * That has a consequence the wishlist page has to honour: a saved product with
 * colours cannot be dropped straight into the basket, because the colour is
 * still unchosen. It links to the product page instead, which is the same rule
 * the Add To Cart button follows. */

import { useCallback, useSyncExternalStore } from "react";

export type WishItem = {
  slug: string;
  /** ISO 8601, so the stored value is stable across locales. */
  addedAt: string;
};

const KEY = "unique-mart.wishlist.v1";
const CHANGED = "unique-mart:wishlist-changed";

/** Enough that nobody meets it, small enough that a stuck key cannot fill the
 *  browser's storage quota and take the basket down with it. */
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

    /* Newest first: a wishlist is a pile, and the thing just added is the thing
       being thought about. */
    const sorted = items.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    return sorted.length ? sorted : EMPTY;
  } catch {
    return EMPTY;
  }
};

/* `useSyncExternalStore` compares snapshots by identity and would re-render
   forever if a fresh array came back each call, so the parsed list is cached
   against the exact string it was parsed from. */
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
    // An empty wishlist removes the key rather than storing "[]".
    if (items.length) window.localStorage.setItem(KEY, JSON.stringify(items));
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked or full — hold it for this page view only.
  }

  cache = { raw: stored(), items };
  announce();
  return items;
};

export const has = (slug: string): boolean => read().some((item) => item.slug === slug);

/** Saves a product. Saving one already saved is a no-op rather than a duplicate
 *  or a re-dating — a heart pressed twice by accident should not reorder the
 *  list under the reader's cursor. */
export const add = (slug: string): WishItem[] => {
  const items = read();
  if (items.some((item) => item.slug === slug)) return items;

  return write([{ slug, addedAt: new Date().toISOString() }, ...items].slice(0, MAX_ITEMS));
};

export const remove = (slug: string): WishItem[] =>
  write(read().filter((item) => item.slug !== slug));

/** Adds or removes, and reports which it did — so the caller can announce it. */
export const toggle = (slug: string): boolean => {
  if (has(slug)) {
    remove(slug);
    return false;
  }
  add(slug);
  return true;
};

export const clear = (): WishItem[] => write([]);

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

/** The wishlist, kept in step across components and browser tabs.
 *
 *  `getServerSnapshot` returns an empty list, so prerendered HTML is always the
 *  empty state and React swaps in the stored one right after hydration. */
export const useWishlist = () => {
  const items = useSyncExternalStore(subscribe, read, serverSnapshot);

  return { items, count: items.length, add, remove, toggle, has, clear };
};

/** Whether one product is saved.
 *
 *  A separate hook from `useWishlist` on purpose: a rail of twenty cards each
 *  carrying a heart would otherwise re-render every card whenever any one of
 *  them changed. This returns a boolean, which React compares by value, so a
 *  card only re-renders when its own product is saved or unsaved. */
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
