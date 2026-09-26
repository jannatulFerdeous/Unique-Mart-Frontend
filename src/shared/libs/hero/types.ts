export type AdminHeroSlide = {
  id: string;
  href: string;
  desktop: string;
  mobile: string | null;
  enabled: boolean;
};

export type HeroImageSlot = "desktop" | "mobile";

export const HERO_SIZES: Record<HeroImageSlot, { width: number; height: number }> = {
  desktop: { width: 1920, height: 570 },
  mobile: { width: 1000, height: 700 },
};

export const HERO_MAX_BYTES = 5 * 1024 * 1024;

export const HERO_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export const HERO_ACCEPT = Object.keys(HERO_TYPES).join(",");

export const HREF_MAX = 500;

export const checkImage = (file: File): string | null => {
  if (!(file.type in HERO_TYPES)) return "Choose a PNG, JPG, WebP or AVIF image.";
  if (file.size > HERO_MAX_BYTES) return "That image is over 5 MB. Export it smaller and try again.";
  return null;
};

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
