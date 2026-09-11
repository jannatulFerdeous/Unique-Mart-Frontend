/* The signed-in visitor.
 *
 * There is no auth yet — the `Login` and `Signup` modules are scaffolded and
 * empty — so this is a stub with one job: be the single place the rest of the
 * app asks "who is this?". Anything that needs the visitor's name imports from
 * here rather than asking for it in a form.
 *
 * When sign-in lands, `currentUser` is the only function to implement. */

export type SessionUser = {
  name: string;
  /** Set once accounts can carry a photo; the avatar falls back to initials. */
  avatar?: string;
};

/** The visitor, or null while nobody is signed in. */
export const currentUser = (): SessionUser | null => null;

/** Up to two initials for the avatar. Falls back to a person glyph when a name
 *  yields nothing usable (a display name that is only punctuation or emoji). */
export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toUpperCase();
