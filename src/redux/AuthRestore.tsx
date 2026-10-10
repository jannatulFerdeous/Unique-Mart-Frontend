"use client";

import { useEffect } from "react";
import { useRefreshTokenMutation } from "./features/auth/authApi";
import { selectAccessToken } from "./features/auth/authSlice";
import { useAppSelector } from "./hooks";
import { signOut, useSession } from "@/shared/libs/session";

// The access token lives in memory, so a reload loses it while the browser
// still shows the person as signed in. Swap the refresh-token cookie for a new
// one; if the server says the sign-in is over, drop the stale session too.
export function AuthRestore() {
  const { user } = useSession();
  const token = useAppSelector(selectAccessToken);
  const [refresh] = useRefreshTokenMutation();
  const signedIn = Boolean(user?.id);

  useEffect(() => {
    if (!signedIn || token) return;
    refresh()
      .unwrap()
      .catch((problem: { status?: unknown }) => {
        // 401/403/404: no cookie, blocked account or deleted user. Anything
        // else (server down) keeps the session until it can be checked.
        if (problem.status === 401 || problem.status === 403 || problem.status === 404) signOut();
      });
  }, [signedIn, token, refresh]);

  return null;
}
