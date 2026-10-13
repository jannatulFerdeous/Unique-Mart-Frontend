import { baseApi, TAG } from "../../api/baseApi";
import { cleanParams } from "../../api/list";
import type { ApiResponse } from "../../api/types";
import type { Ref } from "../catalog/catalog.types";
import type { Product } from "../product/product.types";

// What GET /wishlist populates; `null` once the product has been deleted.
export type WishlistProduct = Pick<
  Product,
  | "_id"
  | "name"
  | "slug"
  | "sku"
  | "images"
  | "price"
  | "discount"
  | "stock"
  | "hasVariants"
  | "variants"
  | "isFeatured"
  | "isExclusive"
  | "isUpcoming"
  | "status"
> & { brandId?: Ref | null };

// A product with variants is saved one variant at a time.
export type WishlistEntry = { productId: WishlistProduct | null; variantId?: string | null; addedAt: string };

// The backend wants a variant for a product with variants and refuses one for
// a simple product. Removing without a variant takes off every saved variant.
export type WishlistArgs = { productId: string; variantId?: string };

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

    addToWishlist: build.mutation<null, WishlistArgs>({
      query: ({ productId, variantId }) => ({
        url: `/wishlist/${productId}`,
        method: "POST",
        params: cleanParams({ variantId }),
      }),
      transformResponse: () => null,
      invalidatesTags: WISHLIST,
    }),

    removeFromWishlist: build.mutation<null, WishlistArgs>({
      query: ({ productId, variantId }) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
        params: cleanParams({ variantId }),
      }),
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
