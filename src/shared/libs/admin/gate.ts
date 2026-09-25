/* Who is allowed into the portal.
 *
 * READ THIS BEFORE TRUSTING IT. This is not authentication and it is not
 * access control. It is a flag in this browser's `localStorage`, set by typing a
 * passcode that is written in plain text three lines below, in client-side
 * JavaScript that anyone can read. Clearing the flag is a devtools keystroke
 * away, and so is reading the code.
 *
 * It exists for two honest reasons: so the portal is not the first thing a
 * stray click lands on, and so the shape of a real guard is already in place.
 * The portal says all of this on the sign-in screen rather than implying a lock
 * that is not there.
 *
 * What a real guard needs, whenever a backend lands: a session cookie the
 * browser cannot read, a role checked on the server for every request, and the
 * check in `proxy.ts` — every admin screen re-checks server-side, because a
 * client-side redirect only hides a page, it does not protect the data on it. */

import { useSyncExternalStore } from "react";
import { DEMO_PASSCODE } from "./access";

const KEY = "unique-mart.admin.gate.v1";
const CHANGED = "unique-mart:admin-gate-changed";

/* The passcode lives in `./access` so the portal's config can print the hint
   without dragging this module's hooks into a server component. Re-exported here
   because this is the file that checks it, and a reader looking for "where is the
   passcode used" should land on one place. */
export { DEMO_PASSCODE };

export type AdminIdentity = {
  name: string;
  /** Only one role today. Listed as a field because the first thing a real
   *  backend will send back is a role, and every screen should already ask. */
  role: "owner";
  since: string;
};

const stored = (): string | null => {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

const isIdentity = (value: unknown): value is AdminIdentity =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as AdminIdentity).name === "string" &&
  (value as AdminIdentity).name.length > 0;

/* Identity cache, same reason as everywhere else in this folder: a fresh object
   per call sends `useSyncExternalStore` into a render loop. */
let cache: { raw: string | null; identity: AdminIdentity | null } = {
  raw: null,
  identity: null,
};

export const currentAdmin = (): AdminIdentity | null => {
  if (typeof window === "undefined") return null;

  const raw = stored();
  if (cache.raw === raw) return cache.identity;

  let identity: AdminIdentity | null = null;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (isIdentity(parsed)) identity = parsed;
  } catch {
    identity = null;
  }

  cache = { raw, identity };
  return identity;
};

const announce = () => {
  window.dispatchEvent(new CustomEvent(CHANGED));
};

/** Checks the passcode and lets them in. Returns false on a wrong code.
 *
 *  The comparison is a plain one. A constant-time compare would be theatre
 *  around a secret that is already in the bundle. */
export const signInAdmin = (passcode: string, name = "Store owner"): boolean => {
  if (passcode.trim() !== DEMO_PASSCODE) return false;

  const identity: AdminIdentity = {
    name: name.trim().slice(0, 60) || "Store owner",
    role: "owner",
    since: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(KEY, JSON.stringify(identity));
  } catch {
    cache = { raw: stored(), identity };
  }

  announce();
  return true;
};

export const signOutAdmin = () => {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    cache = { raw: null, identity: null };
  }
  announce();
};

/* Module scope, not inside the hook: a `subscribe` rebuilt on every render makes
   `useSyncExternalStore` tear down and re-add its listeners every render. */
const subscribe = (onStoreChange: () => void) => {
  const handle = (event: Event) => {
    if (event instanceof StorageEvent && event.key !== null && event.key !== KEY) return;
    onStoreChange();
  };

  window.addEventListener(CHANGED, handle);
  window.addEventListener("storage", handle);
  return () => {
    window.removeEventListener(CHANGED, handle);
    window.removeEventListener("storage", handle);
  };
};

const locked = () => null;

/** The signed-in admin, kept in step across components and tabs.
 *
 *  `getServerSnapshot` returns null, so prerendered HTML is always the locked
 *  state and the portal never ships a rendered dashboard to someone who has not
 *  passed the gate. React swaps in the real answer after hydration. */
export const useAdmin = () => {
  const admin = useSyncExternalStore(subscribe, currentAdmin, locked);

  return { admin, signIn: signInAdmin, signOut: signOutAdmin };
};
