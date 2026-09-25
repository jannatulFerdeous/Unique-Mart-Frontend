/* Review moderation.
 *
 * Two sources, merged for the table and kept apart everywhere it matters:
 *
 *  - `storefront` — reviews really written through a product page on this
 *    browser, read live out of `shared/libs/reviews`. Deleting one of these
 *    deletes it: the product page loses it on its next render, because both
 *    screens read the same store. This is the portal's realest connection to
 *    the shop, and it is the behaviour the brief actually asked for.
 *  - `sample` — the portal's own demo rows, so the queue is not empty before the
 *    site has any traffic. They live here and go no further.
 *
 * Every row says which it is, because "delete" means something different for
 * each and an admin is entitled to know which one they are about to do. */

import { useMemo } from "react";
import { remove as removeStorefrontReview, useAllReviews } from "@/shared/libs/reviews";
import { allProducts, findProduct } from "@/shared/config/products";
import { createStore, daysAgo, rng } from "./store";
import type { AdminReview } from "./types";

const KEY = "unique-mart.admin.reviews.v1";

const COMMENTS: [number, string][] = [
  [5, "Delivery reached Dhaka the next morning and the box was sealed. Exactly what was listed."],
  [5, "Battery easily lasts a full day of heavy use. No complaints at all so far."],
  [4, "Good product for the price. The charger in the box is slower than I expected."],
  [5, "Second one I have bought from Unique Mart. Original product, warranty paperwork included."],
  [3, "Works fine, but the case had a small scratch on the corner when it arrived."],
  [4, "Sound is excellent indoors. Outdoors at full volume it distorts a little."],
  [5, "Paid with bKash and got the confirmation immediately. Smooth from start to finish."],
  [2, "Took six days to arrive and nobody answered the support line on the first two calls."],
  [5, "Screen quality is far better than my old phone. Very happy with the upgrade."],
  [4, "Setup was simple and coverage improved across the whole flat. Slightly pricey."],
  [1, "Arrived with the wrong colour. Had to send it back, exchange took another week."],
  [5, "Genuine product with proper serial. Cheaper here than the showroom near me."],
  [4, "Comfortable to wear all day. The strap picks up dust quickly."],
  [5, "Camera in low light is a big step up. Worth the money."],
  [3, "Fine for the price but the fingerprint sensor misreads more often than it should."],
];

const NAMES = [
  "Rafiq Hossain", "Nusrat Akter", "Tanvir Rahman", "Sumaiya Islam", "Imran Chowdhury",
  "Farzana Karim", "Sabbir Siddique", "Mehjabin Alam", "Arif Mahmud", "Tasnim Haque",
];

/** How many demo reviews to seed. */
const COUNT = 26;

const seed = (): AdminReview[] => {
  const random = rng(902_117);

  const rows = Array.from({ length: COUNT }, (_, index) => {
    const product = allProducts[Math.floor(random() * allProducts.length)];
    const [rating, comment] = COMMENTS[Math.floor(random() * COMMENTS.length)];

    return {
      id: `RV-${500 + index}`,
      source: "sample" as const,
      slug: product.slug,
      product: product.name,
      /* A tenth arrive without a name: the storefront takes the author from the
         session and there is no sign-in on most visits, so nameless is the
         common case there and the table has to render it. */
      author: random() < 0.1 ? null : NAMES[Math.floor(random() * NAMES.length)],
      rating,
      comment,
      createdAt: daysAgo(random() ** 1.5 * 60),
      hidden: false,
    } satisfies AdminReview;
  });

  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

const isReview = (value: unknown): value is AdminReview => {
  if (typeof value !== "object" || value === null) return false;
  const each = value as Record<string, unknown>;
  return (
    typeof each.id === "string" &&
    typeof each.slug === "string" &&
    typeof each.comment === "string" &&
    typeof each.rating === "number"
  );
};

const revive = (value: unknown): AdminReview[] | null => {
  if (!Array.isArray(value)) return null;
  const rows = value.filter(isReview);
  return rows.length ? rows : null;
};

export const sampleReviews = createStore(KEY, seed, revive);

/** Everything awaiting moderation, newest first, both sources merged. */
export const useAdminReviews = (): AdminReview[] => {
  const samples = sampleReviews.use();
  const live = useAllReviews();

  return useMemo(() => {
    const real: AdminReview[] = live.map(({ slug, review }) => ({
      id: review.id,
      source: "storefront",
      slug,
      /* A review can outlive the product it was written about — someone deletes
         the product, the review stays in the browser. Say so rather than
         showing a blank cell. */
      product: findProduct(slug)?.name ?? slug,
      author: review.name,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      hidden: false,
    }));

    return [...real, ...samples].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [live, samples]);
};

/** Deletes a review at its source.
 *
 *  A storefront review is really removed from the store the product page reads.
 *  A sample review is removed from the portal's own list. The caller passes the
 *  whole row rather than an id precisely so this cannot guess wrong. */
export const deleteReview = (row: Pick<AdminReview, "id" | "slug" | "source">) => {
  if (row.source === "storefront") {
    removeStorefrontReview(row.slug, row.id);
    return;
  }

  sampleReviews.update((current) => current.filter((review) => review.id !== row.id));
};

export const deleteReviews = (rows: Pick<AdminReview, "id" | "slug" | "source">[]) => {
  for (const row of rows) deleteReview(row);
};

/** Pulls a review from display without deleting it — the softer moderation
 *  action, for a review that is rude rather than fake.
 *
 *  Only sample rows can hold it: the storefront's `Review` type has no hidden
 *  flag, and inventing one here would be a field the product page ignores,
 *  which is worse than not offering the action. The UI disables it instead. */
export const setReviewHidden = (id: string, hidden: boolean) => {
  sampleReviews.update((current) =>
    current.map((review) => (review.id === id ? { ...review, hidden } : review)),
  );
};

export const resetReviews = () => sampleReviews.reset();

/* ------------------------------------------------------------- read models */

export const averageRating = (rows: AdminReview[]): number | null => {
  const visible = rows.filter((review) => !review.hidden);
  if (!visible.length) return null;
  return visible.reduce((sum, review) => sum + review.rating, 0) / visible.length;
};

/** Reviews per star, 5 first — the shape the dashboard's bar list wants. */
export const ratingBreakdown = (rows: AdminReview[]): number[] => {
  const counts = [0, 0, 0, 0, 0];
  for (const review of rows) {
    const index = 5 - Math.min(5, Math.max(1, Math.round(review.rating)));
    counts[index] += 1;
  }
  return counts;
};

/** Three stars or fewer. What a shopkeeper wants to read first. */
export const needsAttention = (rows: AdminReview[]): AdminReview[] =>
  rows.filter((review) => review.rating <= 3 && !review.hidden);
