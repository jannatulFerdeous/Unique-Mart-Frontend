/* The signed-in visitor.
 *
 * There is no auth backend yet, so an "account" is a name kept in this
 * browser. Nothing is verified and no password is stored — the sign-in screens
 * say so plainly. What this buys is a real seam: everything that needs to know
 * who the visitor is already asks `currentUser()`, so when a backend lands,
 * `currentUser`, `signIn` and `signOut` are the only three functions to
 * reimplement and every caller keeps working.
 *
 * Every `localStorage` access is wrapped: it throws outright in some contexts
 * (private mode, embedded previews, blocked site data) and a page must still
 * render when it does. */

import { useCallback, useSyncExternalStore } from "react";

export type SessionUser = {
  name: string;
  email?: string;
  phone?: string;
  /** Set once accounts can carry a photo; the avatar falls back to initials. */
  avatar?: string;
};

const KEY = "unique-mart.session.v1";
const CHANGED = "unique-mart:session-changed";

const isUser = (value: unknown): value is SessionUser =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as SessionUser).name === "string" &&
  (value as SessionUser).name.length > 0;

const stored = (): string | null => {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

/* `useSyncExternalStore` compares snapshots by identity and would re-render
   forever if a fresh object came back each call, so the parsed user is cached
   against the exact string it was parsed from. */
let cache: { raw: string | null; user: SessionUser | null } = {
  raw: null,
  user: null,
};

/** The visitor, or null while nobody is signed in. */
export const currentUser = (): SessionUser | null => {
  if (typeof window === "undefined") return null;

  const raw = stored();
  if (cache.raw === raw) return cache.user;

  let user: SessionUser | null = null;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (isUser(parsed)) user = parsed;
  } catch {
    user = null;
  }

  cache = { raw, user };
  return user;
};

const announce = () => {
  window.dispatchEvent(new CustomEvent(CHANGED));
};

export const signIn = (user: SessionUser): SessionUser => {
  const clean: SessionUser = {
    name: user.name.trim().slice(0, 60),
    ...(user.email ? { email: user.email.trim().slice(0, 254) } : {}),
    ...(user.phone ? { phone: user.phone.trim().slice(0, 30) } : {}),
  };

  try {
    window.localStorage.setItem(KEY, JSON.stringify(clean));
  } catch {
    // Storage blocked — hold it for this page view only.
    cache = { raw: stored(), user: clean };
  }

  announce();
  return clean;
};

export const signOut = () => {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    cache = { raw: null, user: null };
  }
  announce();
};

/** Up to two initials for an avatar. Falls back to nothing usable when a name
 *  is only punctuation or emoji, and the caller shows a person glyph. */
export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toUpperCase();

/** The session, kept in step across components and browser tabs.
 *
 *  `getServerSnapshot` returns null so prerendered HTML is always the
 *  signed-out state; React swaps in the real one right after hydration, which
 *  is what `useSyncExternalStore` exists to make safe. */
export const useSession = () => {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const handle = (event: Event) => {
      if (event instanceof StorageEvent && event.key !== null && event.key !== KEY) {
        return;
      }
      onStoreChange();
    };

    window.addEventListener(CHANGED, handle);
    window.addEventListener("storage", handle);
    return () => {
      window.removeEventListener(CHANGED, handle);
      window.removeEventListener("storage", handle);
    };
  }, []);

  const user = useSyncExternalStore(
    subscribe,
    () => currentUser(),
    () => null,
  );

  return { user, signIn, signOut };
};

/* ------------------------------------------------------- the `back` param */

/** Where to return to after signing in, base64 in the URL as the reference
 *  does it: `/auth/login?back=Lw%3D%3D` comes back to `/`. */
export const encodeBack = (path: string): string => {
  try {
    return btoa(path);
  } catch {
    return "";
  }
};

/** Decodes `back` into a path that is safe to navigate to.
 *
 *  **This is an open-redirect guard, not a formatting helper.** `back` comes
 *  from the query string, so a crafted link could otherwise bounce someone to
 *  another origin straight after they type a password. Only a single-slash
 *  relative path is allowed through: `//evil.com` and `https://evil.com` are
 *  both absolute once the browser resolves them, and both are rejected. */
export const decodeBack = (raw: string | undefined): string => {
  if (!raw) return "/";

  let path: string;
  try {
    path = atob(raw);
  } catch {
    return "/";
  }

  if (!path.startsWith("/")) return "/";
  // "//host" is protocol-relative and "/\host" is treated the same way by
  // some browsers — neither stays on this origin.
  if (path.startsWith("//") || path.startsWith("/\\")) return "/";
  if (path.includes("\n") || path.includes("\r")) return "/";

  return path;
};
