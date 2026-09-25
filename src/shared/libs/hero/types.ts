/* Hero slides the portal uploads — the shapes and rules both sides agree on.
 *
 * No Node imports in here: the admin screen reads the limits to check a file
 * before it spends an upload on it, and the route handlers read the same ones to
 * refuse it anyway. The browser check is a courtesy; the server check is the
 * rule. */

export type HeroUploadSlide = {
  id: string;
  /** Where the slide goes. A path on this site or an http(s) URL — see
   *  `isSafeHref` for why nothing else is let through. */
  href: string;
  /** File name under the image route. Generated on the server, never taken
   *  from the upload, so it cannot point anywhere but the images folder. */
  desktop: string;
  /** Optional. The homepage falls back to the desktop artwork below `md`. */
  mobile: string | null;
  /** Hidden slides stay in the list, so a finished offer can be switched off
   *  and back on without uploading it again. */
  enabled: boolean;
  createdAt: string;
};

export type HeroImageSlot = "desktop" | "mobile";

/** The artwork sizes the homepage frame is cut to. Anything else is cropped by
 *  `object-cover` rather than rejected — they are advice, not a check. */
export const HERO_SIZES: Record<HeroImageSlot, { width: number; height: number }> = {
  desktop: { width: 1920, height: 570 },
  mobile: { width: 1000, height: 700 },
};

export const HERO_MAX_BYTES = 5 * 1024 * 1024;

/** Formats the image optimiser can re-encode. SVG is left out on purpose: it can
 *  carry script, and the optimiser refuses it by default anyway. */
export const HERO_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export type HeroMime = keyof typeof HERO_TYPES;

export const HERO_ACCEPT = Object.keys(HERO_TYPES).join(",");

export const HREF_MAX = 500;

/** Stored image file names. Anchored on both ends, so a path separator or a
 *  `..` can never reach the file system through the image route. */
export const HERO_FILE_PATTERN = /^[a-z0-9-]+\.(png|jpg|webp|avif)$/;

export const heroImageUrl = (file: string): string => `/api/hero-slides/images/${file}`;

/** Only a path on this site or an http(s) URL. A `javascript:` link on the
 *  first thing every visitor sees is the reason this is an allow-list; `//host`
 *  is refused because it looks like a path and leaves the site. */
export const isSafeHref = (value: string): boolean => {
  if (!value || value.length > HREF_MAX) return false;
  if (value.startsWith("/")) return !value.startsWith("//") && !value.startsWith("/\\");

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};
