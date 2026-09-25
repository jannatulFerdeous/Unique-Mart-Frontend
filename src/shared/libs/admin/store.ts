/* One browser-backed store, reused by every admin collection.
 *
 * There is no backend on this site yet. `shared/libs/session` and
 * `shared/libs/reviews` each solved that the same way and each hand-rolled the
 * same four things: a guarded `localStorage` access, an identity cache so
 * `useSyncExternalStore` does not re-render forever, a same-tab event and a
 * cross-tab one. The portal needs six collections, so it is written once here.
 *
 * Every access is wrapped. `localStorage` throws outright in some contexts
 * (Safari private mode, embedded previews, browsers set to block site data) and
 * a page must still render when it does — a write then holds for the page view
 * and is lost on reload, which is the same bargain the other two stores make.
 *
 * When an API lands, `read` and `write` below are the only two functions to
 * reroute and every screen keeps working. */

import { useSyncExternalStore } from "react";

/** Fires when this tab writes. Cross-tab updates arrive as `storage`. */
const CHANGED = "unique-mart:admin-changed";

const readRaw = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export type AdminStore<T> = {
  /** Current value. The stored one, or the seed when nothing is stored. */
  read: () => T;
  write: (next: T) => T;
  /** Read, transform, write — the shape every mutation below wants. */
  update: (change: (current: T) => T) => T;
  /** Forget everything this store holds and fall back to the seed. */
  reset: () => void;
  /** The value, kept in step across components and browser tabs. */
  use: () => T;
};

/**
 * @param key      `localStorage` key. Bump its version to abandon old payloads
 *                 rather than migrating them.
 * @param seed     Starting value, called at most once per page load.
 * @param revive   Validates whatever came back out of storage. Return null for
 *                 anything unrecognised — a corrupt or hand-edited payload
 *                 should cost the reader nothing but the edits in it.
 */
export function createStore<T>(
  key: string,
  seed: () => T,
  revive: (value: unknown) => T | null,
): AdminStore<T> {
  /* Memoised, so the seed is one object for the life of the page. Both the
     identity cache below and `getServerSnapshot` depend on that: a fresh array
     every call is what sends `useSyncExternalStore` into a render loop. */
  let seeded: { value: T } | null = null;
  const initial = (): T => (seeded ??= { value: seed() }).value;

  let cache: { raw: string | null; value: T } | null = null;

  const read = (): T => {
    if (typeof window === "undefined") return initial();

    const raw = readRaw(key);
    if (cache && cache.raw === raw) return cache.value;

    let value: T | null = null;
    if (raw !== null) {
      try {
        value = revive(JSON.parse(raw) as unknown);
      } catch {
        value = null;
      }
    }

    const next = value ?? initial();
    cache = { raw, value: next };
    return next;
  };

  const announce = () => {
    window.dispatchEvent(new CustomEvent(CHANGED, { detail: key }));
  };

  const write = (next: T): T => {
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage full or blocked. Fall through — the cache below still takes the
      // new value, so the screen updates; it just will not survive a reload.
    }
    /* Seeding the cache against whatever storage now reports keeps `read`
       returning this exact object either way: on success the raw string
       matches, and on failure the stale one does. */
    cache = { raw: readRaw(key), value: next };
    announce();
    return next;
  };

  const update = (change: (current: T) => T): T => write(change(read()));

  const reset = () => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Nothing to remove that we could reach; the cache reset below is enough.
    }
    cache = null;
    seeded = null;
    announce();
  };

  const subscribe = (onStoreChange: () => void) => {
    const handle = (event: Event) => {
      if (event instanceof StorageEvent) {
        // A null key means "cleared", which concerns every store.
        if (event.key !== null && event.key !== key) return;
      } else if ((event as CustomEvent<string>).detail !== key) {
        return;
      }
      onStoreChange();
    };

    window.addEventListener(CHANGED, handle);
    window.addEventListener("storage", handle);
    return () => {
      window.removeEventListener(CHANGED, handle);
      window.removeEventListener("storage", handle);
    };
  };

  const use = (): T =>
    /* `subscribe` and `read` are both created once per store, so they are
       already stable references and need no `useCallback` around them — which
       is the whole reason this hook is cheap enough to call from every screen. */
    useSyncExternalStore(
      subscribe,
      read,
      /* The seed, not an empty list: these screens are prerendered, the server
         cannot know what this browser stored, and an admin table that flashes
         "nothing here" on every load reads as data loss. React swaps in the
         stored value right after hydration. */
      initial,
    );

  return { read, write, update, reset, use };
}

/* ------------------------------------------------------------- small tools */

/** Deterministic pseudo-random numbers: mulberry32.
 *
 *  The demo data below has to be the same on every load and in every browser —
 *  a dashboard whose revenue moves when you refresh teaches the reader to
 *  distrust it, and `Math.random` in a seed also guarantees a hydration
 *  mismatch. Seeded by hand, never by the clock. */
export const rng = (seed: number) => {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Midnight this morning, local time.
 *
 *  Every seeded date is an offset from here, so the demo data is always
 *  "recent" without being re-randomised: it is stable for the whole day. */
export const today = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/** `days` before this morning, as an ISO string. Fractions are hours. */
export const daysAgo = (days: number): string =>
  new Date(today().getTime() - days * 86_400_000).toISOString();

/** An id that does not need to be unguessable — `randomUUID` is missing on
 *  plain-http origins in some browsers, so this never reaches for it. */
export const localId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
