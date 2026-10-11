import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export type NoticeScope =
  | "banners"
  | "users"
  | "products"
  | "catalog"
  | "specs"
  | "account"
  | "coupons"
  | "reviews"
  | "newsletter"
  | "reports"
  | "refunds"
  | "orders";

export type Notice = { scope: NoticeScope; tone: "good" | "danger"; text: string };

// One-line feedback that survives a client-side navigation,
// e.g. "Banner added." shown on the list after the form page saves.
const noticeSlice = createSlice({
  name: "notice",
  initialState: null as Notice | null,
  reducers: {
    showNotice: (_state, action: PayloadAction<Notice>) => action.payload,
    clearNotice: () => null,
  },
});

export const { showNotice, clearNotice } = noticeSlice.actions;

export const selectNotice = (scope: NoticeScope) => (state: RootState) =>
  state.notice?.scope === scope ? state.notice : null;

export const noticeReducer = noticeSlice.reducer;
