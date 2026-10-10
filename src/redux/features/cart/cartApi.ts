import { baseApi, TAG } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";
import type { AddToCartArgs, Cart, UpdateCartItemArgs } from "./cart.types";

// Writes answer with the cart unpopulated, so every change refetches it.
const CART = [TAG.cart];

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<Cart, void>({
      query: () => "/cart",
      transformResponse: (response: ApiResponse<Cart>) => response.data,
      providesTags: CART,
    }),

    addToCart: build.mutation<null, AddToCartArgs>({
      query: (body) => ({ url: "/cart", method: "POST", body }),
      transformResponse: () => null,
      invalidatesTags: CART,
    }),

    updateCartItem: build.mutation<null, UpdateCartItemArgs>({
      query: ({ itemId, quantity }) => ({ url: `/cart/${itemId}`, method: "PATCH", body: { quantity } }),
      transformResponse: () => null,
      invalidatesTags: CART,
    }),

    removeCartItem: build.mutation<null, string>({
      query: (itemId) => ({ url: `/cart/${itemId}`, method: "DELETE" }),
      transformResponse: () => null,
      invalidatesTags: CART,
    }),

    clearCart: build.mutation<null, void>({
      query: () => ({ url: "/cart", method: "DELETE" }),
      transformResponse: () => null,
      invalidatesTags: CART,
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
