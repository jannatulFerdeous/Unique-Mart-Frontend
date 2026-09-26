import { useCallback, useSyncExternalStore } from "react";
import { currentUser } from "./session";

export type Review = {
  id: string;
  name: string | null;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ReviewDraft = Pick<Review, "rating" | "comment">;

export type ReviewSummary = {
  count: number;
  average: number | null;
  breakdown: number[];
};

export const REVIEW_LIMITS = {
  name: 60,
  comment: 1000,
} as const;

const PREFIX = "unique-mart.reviews.v1.";

const key = (slug: string) => `${PREFIX}${slug}`;

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

const cache = new Map<string, { raw: string | null; reviews: Review[] }>();

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
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    name: currentUser()?.name.trim().slice(0, REVIEW_LIMITS.name) ?? null,
    rating: Math.min(5, Math.max(1, Math.round(draft.rating))),
    comment: draft.comment.trim().slice(0, REVIEW_LIMITS.comment),
    createdAt: new Date().toISOString(),
  };

  const next = [review, ...read(slug)];

  try {
    window.localStorage.setItem(key(slug), JSON.stringify(next));
  } catch {
    cache.set(slug, { raw: stored(slug), reviews: next });
  }

  window.dispatchEvent(new CustomEvent(CHANGED, { detail: slug }));
  return next;
};

export const remove = (slug: string, id: string): Review[] => {
  const next = read(slug).filter((review) => review.id !== id);

  try {
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

let allCache: { fingerprint: string; rows: StoredReview[] } | null = null;

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

export const useAllReviews = (): StoredReview[] => {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const handle = (event: Event) => {
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

export const useReviews = (slug: string) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handle = (event: Event) => {
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
