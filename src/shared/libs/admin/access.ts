/* The demo passcode, and nothing else.
 *
 * Its own file for a boring but real reason: `gate.ts` calls `useSyncExternalStore`,
 * which makes it a client-only module, and the portal's config imports this
 * constant to print the hint on the sign-in screen. That config is also read by a
 * server component — the orders page validates `?status=` against it — so any
 * hook reachable from the config breaks the build. One constant with no imports
 * is safe for both sides.
 *
 * READ THIS BEFORE TRUSTING THE VALUE BELOW. It is in the page's own JavaScript,
 * in the clear, where anyone can read it. It is not a credential and the gate it
 * opens is not authentication — see the header comment in `gate.ts` for what a
 * real guard needs. */

export const DEMO_PASSCODE = "unique-admin";

/** Header the portal sends the passcode in when it writes to the server. See
 *  `shared/libs/server/auth`. */
export const PASSCODE_HEADER = "x-admin-passcode";
