import { baseApi, TAG } from "../../api/baseApi";
import { cleanParams, toPaged } from "../../api/list";
import type { ApiResponse } from "../../api/types";
import type { CreateOrderArgs, Order, OrderList, OrderListParams } from "./order.types";

const LIST = { type: TAG.order, id: "LIST" } as const;

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // The signed-in customer's own orders. The backend has no all-orders route.
    getMyOrders: build.query<OrderList, OrderListParams>({
      query: (params) => ({ url: "/order", params: cleanParams({ ...params, sort: "-createdAt" }) }),
      transformResponse: toPaged<Order>,
      providesTags: (result) => [LIST, ...(result?.items ?? []).map(({ _id }) => ({ type: TAG.order, id: _id }))],
    }),

    getMyOrder: build.query<Order, string>({
      query: (id) => `/order/${id}`,
      transformResponse: (response: ApiResponse<Order>) => response.data,
      providesTags: (_result, _error, id) => [{ type: TAG.order, id }],
    }),

    // Orders everything in the cart; the backend doesn't empty the cart after.
    createOrder: build.mutation<Order, CreateOrderArgs>({
      query: (body) => ({ url: "/order", method: "POST", body }),
      transformResponse: (response: ApiResponse<Order>) => response.data,
      invalidatesTags: [LIST, TAG.cart],
    }),

    cancelOrder: build.mutation<Order, string>({
      query: (id) => ({ url: `/order/${id}/cancel`, method: "PATCH" }),
      transformResponse: (response: ApiResponse<Order>) => response.data,
      invalidatesTags: (_result, _error, id) => [LIST, { type: TAG.order, id }],
    }),
  }),
});

export const { useGetMyOrdersQuery, useGetMyOrderQuery, useCreateOrderMutation, useCancelOrderMutation } = orderApi;
