/* How the portal talks to the server, for the few things that live there —
 * hero slides and the category tree. Everything else in the portal stays in
 * this browser.
 *
 * Writes carry the admin passcode in a header, checked on the server. It starts
 * as the demo passcode, which is what a development server accepts; a production
 * server takes `ADMIN_PASSCODE` instead, and a screen asks for it the first time
 * a write is refused. It is then kept for this tab only. */

import { DEMO_PASSCODE, PASSCODE_HEADER } from "./access";

const CODE_KEY = "unique-mart.admin.publish-code";

const publishCode = (): string => {
  try {
    return window.sessionStorage.getItem(CODE_KEY) ?? DEMO_PASSCODE;
  } catch {
    return DEMO_PASSCODE;
  }
};

export const rememberPublishCode = (code: string) => {
  try {
    window.sessionStorage.setItem(CODE_KEY, code);
  } catch {
    // Blocked storage: the next write asks again, which is the safe way to fail.
  }
};

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Refused for want of a passcode, rather than for what was sent. */
export const needsPasscode = (error: unknown): boolean =>
  error instanceof AdminApiError && (error.status === 401 || error.status === 503);

/** A JSON request with the passcode attached. Resolves to the body, or throws
 *  an `AdminApiError` carrying the server's own sentence. */
export const adminFetch = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers);
  headers.set(PASSCODE_HEADER, publishCode());

  let response: Response;
  try {
    response = await fetch(url, { ...init, cache: "no-store", headers });
  } catch {
    throw new AdminApiError("Could not reach the server. Check the connection and try again.", 0);
  }

  const body = (await response.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!response.ok || !body) {
    throw new AdminApiError(body?.error ?? "The server could not do that. Try again.", response.status);
  }
  return body;
};

/** A JSON body, with the header that says so. */
export const jsonBody = (method: string, value: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(value),
});
