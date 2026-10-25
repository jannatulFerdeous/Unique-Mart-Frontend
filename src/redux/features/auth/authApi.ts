import { baseApi } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";
import { clearAuth, setAccessToken } from "./authSlice";

export type LoginArgs = { email: string; password: string };

// For POST /auth/change-password. `currentPassword` is left out by an account
// that has only signed in with Google and so has none yet.
export type ChangePasswordArgs = { currentPassword?: string; newPassword: string };

// Both sign-ins set the refresh-token cookie and return a short-lived access token.
const keepToken = async (
  _args: unknown,
  { dispatch, queryFulfilled }: { dispatch: (action: unknown) => unknown; queryFulfilled: Promise<{ data: string }> },
) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(setAccessToken(data));
  } catch {
    // The caller shows the error from `unwrap()`.
  }
};

const toToken = (response: ApiResponse<{ accessToken: string }>) => response.data.accessToken;

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<string, LoginArgs>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: toToken,
      onQueryStarted: keepToken,
    }),

    // `idToken` is the credential Google Identity Services hands the page.
    googleLogin: build.mutation<string, { idToken: string }>({
      query: (body) => ({ url: "/auth/google", method: "POST", body }),
      transformResponse: toToken,
      onQueryStarted: keepToken,
    }),

    // Swaps the refresh-token cookie for a new access token, e.g. after a reload.
    refreshToken: build.mutation<string, void>({
      query: () => ({ url: "/auth/refresh-token", method: "POST" }),
      transformResponse: toToken,
      onQueryStarted: keepToken,
    }),

    // The signed-in user's own password.
    changePassword: build.mutation<null, ChangePasswordArgs>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
      transformResponse: () => null,
    }),

    // Clears the refresh-token cookie on the server.
    logout: build.mutation<null, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearAuth());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi;
