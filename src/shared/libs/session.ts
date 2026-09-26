import { useCallback, useSyncExternalStore } from "react";

export { initials } from "@/shared/utils/initials";

export type SessionUser = {
  name: string;
  email?: string;
  phone?: string;
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

let cache: { raw: string | null; user: SessionUser | null } = {
  raw: null,
  user: null,
};

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

export const encodeBack = (path: string): string => {
  try {
    return btoa(path);
  } catch {
    return "";
  }
};

export const decodeBack = (raw: string | undefined): string => {
  if (!raw) return "/";

  let path: string;
  try {
    path = atob(raw);
  } catch {
    return "/";
  }

  if (!path.startsWith("/")) return "/";
  if (path.startsWith("//") || path.startsWith("/\\")) return "/";
  if (path.includes("\n") || path.includes("\r")) return "/";

  return path;
};
