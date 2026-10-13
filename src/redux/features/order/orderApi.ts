import { baseApi, TAG } from "../../api/baseApi";
import { cleanParams, toPaged } from "../../api/list";
import type { ApiResponse } from "../../api/types";
import type {
  CreateOrderArgs,
  Order,
  OrderList,
  OrderListParams,
  StaffOrder,
  StaffOrderList,
  UpdateOrderStatusArgs,
} from "./order.types";

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

    // Every customer's orders, newest first, with who placed each (staff only).
    getStaffOrders: build.query<StaffOrderList, OrderListParams>({
      query: (params) => ({ url: "/order/admin", params: cleanParams({ ...params, sort: "-createdAt" }) }),
      transformResponse: toPaged<StaffOrder>,
      providesTags: (result) => [LIST, ...(result?.items ?? []).map(({ _id }) => ({ type: TAG.order, id: _id }))],
    }),

    // Any customer's order, by id (staff only).
    getStaffOrder: build.query<StaffOrder, string>({
      query: (id) => `/order/admin/${id}`,
      transformResponse: (response: ApiResponse<StaffOrder>) => response.data,
      providesTags: (_result, _error, id) => [{ type: TAG.order, id }],
    }),

    // Orders everything in the cart, which the backend then empties. The order
    // stays pending until it's paid.
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

    // Any customer's order, by id (staff only).
    updateOrderStatus: build.mutation<Order, UpdateOrderStatusArgs>({
      query: ({ id, orderStatus }) => ({ url: `/order/${id}/status`, method: "PATCH", body: { orderStatus } }),
      transformResponse: (response: ApiResponse<Order>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [LIST, { type: TAG.order, id }, { type: TAG.payment, id }],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetMyOrderQuery,
  useGetStaffOrdersQuery,
  useGetStaffOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
} = orderApi;
