// Mirror the backend enum in `productReview.constant.ts`.
export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

type Person = { _id: string; name: string; email?: string };
type ProductRef = { _id: string; name: string; slug: string };

// Mirrors the backend ProductReview document. Which references come back
// populated depends on the route: the product page gets the reviewer's name,
// "my reviews" the product, the admin list both.
export type Review = {
  _id: string;
  userId: Person | string | null;
  productId: ProductRef | string | null;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
};

// Mirrors the backend `createProductReviewValidationSchema`.
export type CreateReviewArgs = { productId: string; rating: number; comment: string };

export const REVIEW_LIMITS = { comment: { min: 3, max: 1000 } } as const;

export type ReviewSummary = {
  count: number;
  average: number | null;
  // Counts for 5★ down to 1★.
  breakdown: number[];
};

export const summarise = (reviews: Pick<Review, "rating">[]): ReviewSummary => {
  const breakdown = [0, 0, 0, 0, 0];
  let total = 0;
  for (const { rating } of reviews) {
    breakdown[5 - rating] += 1;
    total += rating;
  }
  return { count: reviews.length, average: reviews.length ? total / reviews.length : null, breakdown };
};

export const personName = (ref: Review["userId"]) => (ref && typeof ref === "object" ? ref.name : null);

export const productOf = (ref: Review["productId"]) => (ref && typeof ref === "object" ? ref : null);
