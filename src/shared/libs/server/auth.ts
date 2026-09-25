/* Who may change what the server stores for the shop — hero slides and the
 * category tree.
 *
 * The portal's own gate is a flag in the browser (see `shared/libs/admin/gate`),
 * which is fine while every edit stays in that browser. These do not: they are
 * written to the server and shown to every visitor, so an unguarded route would
 * let anyone on the internet rewrite the homepage or the menu. This is the
 * smallest check that closes that.
 *
 * The passcode is `ADMIN_PASSCODE` from the server's environment. Outside
 * production it falls back to the demo passcode so the portal works on a fresh
 * checkout. In production there is no fallback — the demo passcode is printed in
 * the page's own JavaScript, so accepting it would be no lock at all — and
 * writes are refused until the variable is set.
 *
 * Still a shared secret rather than accounts. When real sign-in lands, this is
 * the function to replace with a session check. */

import "server-only";
import { timingSafeEqual } from "node:crypto";
import { DEMO_PASSCODE, PASSCODE_HEADER } from "@/shared/libs/admin/access";

const expected = (): string | null =>
  process.env.ADMIN_PASSCODE ||
  (process.env.NODE_ENV === "production" ? null : DEMO_PASSCODE);

/** A 401 or 503 to send back, or null when the request may write. */
export const refuseUnlessAdmin = (request: Request): Response | null => {
  const want = expected();
  if (!want) {
    return Response.json(
      { error: "Saving is switched off: set ADMIN_PASSCODE on the server to turn it on." },
      { status: 503 },
    );
  }

  const given = Buffer.from(request.headers.get(PASSCODE_HEADER) ?? "");
  const target = Buffer.from(want);

  /* Compared in constant time, so response timing does not leak how many
     leading characters of a guess were right. */
  const ok = given.length === target.length && timingSafeEqual(given, target);
  return ok
    ? null
    : Response.json({ error: "The admin passcode was not accepted." }, { status: 401 });
};
