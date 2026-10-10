import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/shared/config/api";
import type { RootState } from "../store";
import { clearAuth, setAccessToken } from "../features/auth/authSlice";
import type { ApiResponse } from "./types";

export const TAG = {
  banner: "Banner",
  user: "User",
  brand: "Brand",
  mainCategory: "MainCategory",
  category: "Category",
  subCategory: "SubCategory",
  product: "Product",
  attributeGroup: "AttributeGroup",
  attribute: "Attribute",
  cart: "Cart",
  wishlist: "Wishlist",
  address: "Address",
  order: "Order",
  review: "Review",
  coupon: "Coupon",
  newsletter: "Newsletter",
  report: "Report",
} as const;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  // Fail instead of spinning forever when the server accepts but never answers.
  // Generous enough for a 5 MB image upload to Cloudinary.
  timeout: 60_000,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// One refresh at a time: parallel 401s wait for the same answer.
let refreshing: Promise<string | null> | null = null;

// Swaps the httpOnly refresh-token cookie for a new access token.
export const refreshAccessToken: BaseQueryFn<void, string | null> = async (_args, api, extra) => {
  refreshing ??= (async () => {
    const result = await rawBaseQuery({ url: "/auth/refresh-token", method: "POST" }, api, extra);
    const token = (result.data as ApiResponse<{ accessToken: string }> | undefined)?.data?.accessToken ?? null;
    if (token) api.dispatch(setAccessToken(token));
    else api.dispatch(clearAuth());
    return token;
  })().finally(() => {
    refreshing = null;
  });
  return { data: await refreshing };
};

// The access token is short-lived and only kept in memory, so a 401 usually
// means it expired or the page reloaded: refresh once, then retry.
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extra) => {
  const result = await rawBaseQuery(args, api, extra);
  const url = typeof args === "string" ? args : args.url;
  if (result.error?.status !== 401 || url.startsWith("/auth/")) return result;

  const { data: token } = await refreshAccessToken(undefined, api, extra);
  return token ? rawBaseQuery(args, api, extra) : result;
};

// One API slice for the whole app; each feature adds its endpoints with
// `baseApi.injectEndpoints` from `src/redux/features/<feature>/`.
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: Object.values(TAG),
  endpoints: () => ({}),
});
