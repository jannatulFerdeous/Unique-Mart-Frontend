import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { baseApi, TAG } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";
import type {
  CreatePaymentArgs,
  CreateRefundArgs,
  Payment,
  PaymentRefunds,
  PaymentSession,
  Refund,
  RefundArgs,
} from "./payment.types";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // `null` until the shopper first starts paying (the backend answers 404).
    getOrderPayment: build.query<Payment | null, string>({
      async queryFn(orderId, _api, _extra, baseQuery) {
        const result = await baseQuery(`/payments/orders/${orderId}/status`);
        if (result.error?.status === 404) return { data: null };
        if (result.error) return { error: result.error as FetchBaseQueryError };
        return { data: (result.data as ApiResponse<Payment>).data };
      },
      providesTags: (_result, _error, orderId) => [{ type: TAG.payment, id: orderId }],
    }),

    // Starts an SSLCommerz session for a pending order. The payment is
    // recorded as pending before the shopper leaves for `checkoutUrl`.
    createPayment: build.mutation<PaymentSession, CreatePaymentArgs>({
      query: (body) => ({ url: "/payments/create", method: "POST", body }),
      transformResponse: (response: ApiResponse<PaymentSession>) => response.data,
      invalidatesTags: (_result, _error, { orderId }) => [{ type: TAG.payment, id: orderId }],
    }),

    // Admins only, for any customer's order. 404 means the order has no payment.
    getRefunds: build.query<PaymentRefunds, string>({
      query: (orderId) => `/payments/orders/${orderId}/refunds`,
      transformResponse: (response: ApiResponse<PaymentRefunds>) => response.data,
      providesTags: (_result, _error, orderId) => [{ type: TAG.payment, id: orderId }],
    }),

    // The backend reserves the amount before asking SSLCommerz, so even a
    // failed request can leave a pending refund behind: refetch either way.
    createRefund: build.mutation<unknown, CreateRefundArgs>({
      query: ({ orderId, ...body }) => ({ url: `/payments/orders/${orderId}/refunds`, method: "POST", body }),
      invalidatesTags: (_result, _error, { orderId }) => [{ type: TAG.payment, id: orderId }],
    }),

    // Resends a refund SSLCommerz never acknowledged (no `refundRefId` yet).
    retryRefund: build.mutation<unknown, RefundArgs>({
      query: ({ orderId, refundTransId }) => ({
        url: `/payments/orders/${orderId}/refunds/${refundTransId}/retry`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { orderId }) => [{ type: TAG.payment, id: orderId }],
    }),

    // A GET, but the backend records what SSLCommerz says, so it's a mutation.
    checkRefundStatus: build.mutation<Refund, RefundArgs>({
      query: ({ orderId, refundTransId }) => `/payments/orders/${orderId}/refunds/${refundTransId}/status`,
      transformResponse: (response: ApiResponse<Refund>) => response.data,
      invalidatesTags: (_result, _error, { orderId }) => [{ type: TAG.payment, id: orderId }],
    }),
  }),
});

export const {
  useGetOrderPaymentQuery,
  useCreatePaymentMutation,
  useGetRefundsQuery,
  useCreateRefundMutation,
  useRetryRefundMutation,
  useCheckRefundStatusMutation,
} = paymentApi;
