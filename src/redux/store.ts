import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { authReducer } from "./features/auth/authSlice";
import { noticeReducer } from "./features/notice/noticeSlice";

// A factory, not a singleton: each provider mount gets its own store,
// so server renders never share state between users.
export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      notice: noticeReducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
