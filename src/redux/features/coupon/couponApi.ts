import { baseApi, TAG } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";
import type { Coupon, SaveCouponArgs } from "./coupon.types";

const LIST = { type: TAG.coupon, id: "LIST" } as const;

export const couponApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Newest first, every status.
    getCoupons: build.query<Coupon[], void>({
      query: () => "/coupons",
      transformResponse: (response: ApiResponse<Coupon[]>) => response.data,
      providesTags: (coupons = []) => [LIST, ...coupons.map(({ _id }) => ({ type: TAG.coupon, id: _id }))],
    }),

    getCoupon: build.query<Coupon, string>({
      query: (id) => `/coupons/${id}`,
      transformResponse: (response: ApiResponse<Coupon>) => response.data,
      providesTags: (_result, _error, id) => [{ type: TAG.coupon, id }],
    }),

    // The backend's DELETE only switches a coupon off, the same as saving
    // `status: "inactive"`, so the admin uses this for both.
    saveCoupon: build.mutation<Coupon, SaveCouponArgs>({
      query: ({ id, fields }) =>
        id ? { url: `/coupons/${id}`, method: "PATCH", body: fields } : { url: "/coupons", method: "POST", body: fields },
      transformResponse: (response: ApiResponse<Coupon>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [LIST, ...(id ? [{ type: TAG.coupon, id }] : [])],
    }),
  }),
});

export const { useGetCouponsQuery, useGetCouponQuery, useSaveCouponMutation } = couponApi;
