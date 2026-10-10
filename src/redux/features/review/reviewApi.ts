import { baseApi, TAG } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";
import type { CreateReviewArgs, Review, ReviewStatus } from "./review.types";

const ALL = { type: TAG.review, id: "LIST" } as const;
const MINE = { type: TAG.review, id: "MINE" } as const;
const forProduct = (productId: string) => ({ type: TAG.review, id: `PRODUCT-${productId}` });

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Approved reviews only, newest first. Public.
    getProductReviews: build.query<Review[], string>({
      query: (productId) => `/product-reviews/product/${productId}`,
      transformResponse: (response: ApiResponse<Review[]>) => response.data,
      providesTags: (_result, _error, productId) => [forProduct(productId)],
    }),

    getMyReviews: build.query<Review[], void>({
      query: () => "/product-reviews/my",
      transformResponse: (response: ApiResponse<Review[]>) => response.data,
      providesTags: [MINE],
    }),

    // New reviews wait for an admin to approve them.
    createReview: build.mutation<Review, CreateReviewArgs>({
      query: (body) => ({ url: "/product-reviews", method: "POST", body }),
      transformResponse: (response: ApiResponse<Review>) => response.data,
      invalidatesTags: [MINE, ALL],
    }),

    // Admin: every review, any status.
    getAllReviews: build.query<Review[], void>({
      query: () => "/product-reviews",
      transformResponse: (response: ApiResponse<Review[]>) => response.data,
      providesTags: [ALL],
    }),

    setReviewStatus: build.mutation<Review, { review: Review; status: ReviewStatus }>({
      query: ({ review, status }) => ({ url: `/product-reviews/${review._id}/status`, method: "PATCH", body: { status } }),
      transformResponse: (response: ApiResponse<Review>) => response.data,
      invalidatesTags: (_result, _error, { review }) => [ALL, MINE, forProduct(productIdOf(review))],
    }),

    // Gone for good, not a status change.
    deleteReview: build.mutation<null, Review>({
      query: (review) => ({ url: `/product-reviews/${review._id}`, method: "DELETE" }),
      transformResponse: () => null,
      invalidatesTags: (_result, _error, review) => [ALL, MINE, forProduct(productIdOf(review))],
    }),
  }),
});

const productIdOf = (review: Review) =>
  review.productId && typeof review.productId === "object" ? review.productId._id : (review.productId ?? "");

export const {
  useGetProductReviewsQuery,
  useGetMyReviewsQuery,
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useSetReviewStatusMutation,
  useDeleteReviewMutation,
} = reviewApi;
