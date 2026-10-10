import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// The access token lives in memory only; the backend keeps the long-lived
// refresh token in an httpOnly cookie that JavaScript can't read.
type AuthState = { accessToken: string | null };

const initialState: AuthState = { accessToken: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearAuth: () => initialState,
  },
});

export const { setAccessToken, clearAuth } = authSlice.actions;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const authReducer = authSlice.reducer;
