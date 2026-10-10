"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { AuthRestore } from "./AuthRestore";
import { makeStore } from "./store";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  // Refetch on window focus / reconnect for queries that opt in.
  useEffect(() => setupListeners(store.dispatch), [store]);

  return (
    <Provider store={store}>
      <AuthRestore />
      {children}
    </Provider>
  );
}
