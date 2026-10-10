import { baseApi, TAG } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";
import type { Product } from "../product/product.types";

// What GET /wishlist populates; `null` once the product has been deleted.
export type WishlistProduct = Pick<
  Product,
  "_id" | "name" | "slug" | "images" | "price" | "discount" | "stock" | "isFeatured" | "isExclusive" | "status"
> & { sku?: string };

export type WishlistEntry = { productId: WishlistProduct | null; addedAt: string };

const WISHLIST = [TAG.wishlist];

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Newest first, like the backend adds them.
    getWishlist: build.query<WishlistEntry[], void>({
      query: () => "/wishlist",
      transformResponse: (response: ApiResponse<{ products: WishlistEntry[] }>) =>
        [...response.data.products].sort((a, b) => b.addedAt.localeCompare(a.addedAt)),
      providesTags: WISHLIST,
    }),

    addToWishlist: build.mutation<null, string>({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: "POST" }),
      transformResponse: () => null,
      invalidatesTags: WISHLIST,
    }),

    removeFromWishlist: build.mutation<null, string>({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: "DELETE" }),
      transformResponse: () => null,
      invalidatesTags: WISHLIST,
    }),

    clearWishlist: build.mutation<null, void>({
      query: () => ({ url: "/wishlist", method: "DELETE" }),
      transformResponse: () => null,
      invalidatesTags: WISHLIST,
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;
