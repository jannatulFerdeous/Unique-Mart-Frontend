/* Customer reviews, stored in the visitor's own browser.
 *
 * There is no backend yet, so a review lives in `localStorage` on the device
 * that wrote it and reaches nobody else. The UI says so rather than pretending
 * the review was published. When a store exists, `read` and `append` are the
 * two functions to reroute — nothing else here knows where reviews live.
 *
 * Every access is wrapped: `localStorage` throws outright in some contexts
 * (Safari's private mode, embedded previews, browsers set to block site data),
 * and a product page must still render when it does. */

import { useCallback, useSyncExternalStore } from "react";
import { currentUser } from "./session";

export type Review = {
  id: string;
  /** Taken from the signed-in visitor, never typed into the form. Null while
   *  there is no sign-in, which is every review written today. */
  name: string | null;
  rating: number;
  comment: string;
  /** ISO 8601, so the stored value is stable across locales. */
  createdAt: string;
};

/** What the form collects. The name is not in here on purpose — it comes from
 *  the session, so a reviewer cannot post under someone else's. */
export type ReviewDraft = Pick<Review, "rating" | "comment">;

export type ReviewSummary = {
  count: number;
  /** Mean rating, or null when nothing has been reviewed yet. */
  average: number | null;
  /** Reviews per star, highest first: index 0 is 5★, index 4 is 1★. */
  breakdown: number[];
};

export const REVIEW_LIMITS = {
  name: 60,
  comment: 1000,
} as const;

/** Bumping the version abandons older payloads rather than migrating them. */
const PREFIX = "unique-mart.reviews.v1.";

const key = (slug: string) => `${PREFIX}${slug}`;

/** Fires when this tab writes a review, so every component showing the same
 *  product updates. Cross-tab updates arrive as a native `storage` event. */
const CHANGED = "unique-mart:reviews-changed";

const isReview = (value: unknown): value is Review => {
  if (typeof value !== "object" || value === null) return false;
  const each = value as Record<string, unknown>;
  return (
    typeof each.id === "string" &&
    (typeof each.name === "string" || each.name === null) &&
    typeof each.comment === "string" &&
    typeof each.createdAt === "string" &&
    typeof each.rating === "number" &&
    each.rating >= 1 &&
    each.rating <= 5
  );
};

const EMPTY: Review[] = [];

const parse = (raw: string | null): Review[] => {
  if (!raw) return EMPTY;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;

    const reviews = parsed.filter(isReview);
    if (!reviews.length) return EMPTY;

    return reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return EMPTY;
  }
};

const stored = (slug: string): string | null => {
  try {
    return window.localStorage.getItem(key(slug));
  } catch {
    return null;
  }
};

/* `useSyncExternalStore` compares snapshots by identity and re-renders forever
   if a fresh array comes back every call, so the parsed list is cached against
   the exact string it was parsed from. Same string, same array. */
const cache = new Map<string, { raw: string | null; reviews: Review[] }>();

/** Newest first. Returns an empty list for anything unreadable — a corrupt or
 *  hand-edited entry should cost the reader nothing. */
export const read = (slug: string): Review[] => {
  if (typeof window === "undefined") return EMPTY;

  const raw = stored(slug);
  const hit = cache.get(slug);
  if (hit && hit.raw === raw) return hit.reviews;

  const reviews = parse(raw);
  cache.set(slug, { raw, reviews });
  return reviews;
};

export const append = (slug: string, draft: ReviewDraft): Review[] => {
  const review: Review = {
    // `randomUUID` is missing on http:// origins in some browsers, so this
    // falls back rather than throwing on the way to saving someone's review.
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    // Whoever is signed in — nobody, for now. The UI labels a nameless review
    // rather than inventing an author for it.
    name: currentUser()?.name.trim().slice(0, REVIEW_LIMITS.name) ?? null,
    rating: Math.min(5, Math.max(1, Math.round(draft.rating))),
    comment: draft.comment.trim().slice(0, REVIEW_LIMITS.comment),
    createdAt: new Date().toISOString(),
  };

  const next = [review, ...read(slug)];

  try {
    window.localStorage.setItem(key(slug), JSON.stringify(next));
  } catch {
    // Storage is full or blocked. Seed the cache directly so the review still
    // appears for this visit; it just will not survive a reload.
    cache.set(slug, { raw: stored(slug), reviews: next });
  }

  window.dispatchEvent(new CustomEvent(CHANGED, { detail: slug }));
  return next;
};

/** Drops one review. Unknown ids are a no-op rather than a throw — the
 *  moderation screen may be a tab behind, and two admins deleting the same
 *  review should not be an error the second time.
 *
 *  This is what the admin portal calls, which makes it the one place where the
 *  portal really reaches into what a customer wrote: the product page loses the
 *  review on its next render, because both are reading this same store. */
export const remove = (slug: string, id: string): Review[] => {
  const next = read(slug).filter((review) => review.id !== id);

  try {
    /* An empty list is removed rather than stored as "[]", so a product that
       has been fully moderated leaves no key behind for `readAll` to walk. */
    if (next.length) {
      window.localStorage.setItem(key(slug), JSON.stringify(next));
    } else {
      window.localStorage.removeItem(key(slug));
    }
  } catch {
    cache.set(slug, { raw: stored(slug), reviews: next });
  }

  window.dispatchEvent(new CustomEvent(CHANGED, { detail: slug }));
  return next;
};

/* --------------------------------------------------- every product at once */

/** Product slugs this browser has reviews stored for.
 *
 *  Walking `localStorage` by prefix is the only way to ask that question: the
 *  store is one key per product, with no index, which is right for a product
 *  page reading one slug and is exactly what a moderation queue lacks. */
const reviewedSlugs = (): string[] => {
  try {
    return Object.keys(window.localStorage)
      .filter((each) => each.startsWith(PREFIX))
      .map((each) => each.slice(PREFIX.length))
      .filter(Boolean)
      .sort();
  } catch {
    return [];
  }
};

export type StoredReview = { slug: string; review: Review };

const EMPTY_ALL: StoredReview[] = [];

/* Same identity-cache bargain as `read`, one level up: the fingerprint is every
   key and its raw payload, so the list is rebuilt only when something changed. */
let allCache: { fingerprint: string; rows: StoredReview[] } | null = null;

/** Every review in this browser, newest first, tagged with its product.
 *
 *  Nothing on the storefront wants this — a product page reads its own slug.
 *  The admin portal's moderation queue is the caller. */
export const readAll = (): StoredReview[] => {
  if (typeof window === "undefined") return EMPTY_ALL;

  const slugs = reviewedSlugs();
  const fingerprint = slugs.map((slug) => `${slug}:${stored(slug) ?? ""}`).join("\u0000");
  if (allCache && allCache.fingerprint === fingerprint) return allCache.rows;

  const rows = slugs
    .flatMap((slug) => read(slug).map((review) => ({ slug, review })))
    .sort((a, b) => b.review.createdAt.localeCompare(a.review.createdAt));

  allCache = { fingerprint, rows };
  return rows;
};

/** Every stored review, kept in step with the browser store.
 *
 *  Subscribes to all products rather than one, so a review written on a product
 *  page in another tab shows up in the queue without a reload. */
export const useAllReviews = (): StoredReview[] => {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const handle = (event: Event) => {
      // Any product's write matters here, so unlike `useReviews` there is
      // nothing to filter out — except keys belonging to another store.
      if (event instanceof StorageEvent && event.key !== null && !event.key.startsWith(PREFIX)) {
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
  }, []);

  return useSyncExternalStore(subscribe, readAll, () => EMPTY_ALL);
};

export const summarise = (reviews: Review[]): ReviewSummary => {
  const breakdown = [0, 0, 0, 0, 0];
  let total = 0;

  for (const review of reviews) {
    breakdown[5 - review.rating] += 1;
    total += review.rating;
  }

  return {
    count: reviews.length,
    average: reviews.length ? total / reviews.length : null,
    breakdown,
  };
};

/** Reviews for one product, kept in step with the browser store.
 *
 *  The page is prerendered, so the server cannot know what this browser has
 *  stored. `getServerSnapshot` returns nothing and the empty state is what
 *  ships in the HTML; React swaps in the stored list right after hydration,
 *  which is what `useSyncExternalStore` exists to make safe. */
export const useReviews = (slug: string) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handle = (event: Event) => {
        // Ignore writes about a different product, and cross-tab events for
        // another key. A `storage` event with a null key means "cleared".
        if (event instanceof StorageEvent) {
          if (event.key !== null && event.key !== key(slug)) return;
        } else if ((event as CustomEvent<string>).detail !== slug) {
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
    },
    [slug],
  );

  const reviews = useSyncExternalStore(
    subscribe,
    () => read(slug),
    () => EMPTY,
  );

  const add = useCallback(
    (draft: ReviewDraft) => {
      append(slug, draft);
    },
    [slug],
  );

  return { reviews, summary: summarise(reviews), add };
};
