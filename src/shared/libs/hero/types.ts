export const HERO_SIZE = { width: 1920, height: 570 };

export const HERO_MAX_BYTES = 5 * 1024 * 1024;

// The backend allows this many active banners at once.
export const HERO_MAX_ACTIVE = 6;

export const HERO_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export const HERO_ACCEPT = Object.keys(HERO_TYPES).join(",");

export const HREF_MAX = 500;

export const TITLE_MAX = 150;

export const HREF_HINT = "A page on this site, like /category/iphone, or a full https:// address.";

export const SIZE_HINT = `${HERO_SIZE.width} × ${HERO_SIZE.height} px. PNG, JPG, WebP or AVIF, up to 5 MB.`;

export const checkImage = (file: File): string | null => {
  if (!(file.type in HERO_TYPES)) return "Choose a PNG, JPG, WebP or AVIF image.";
  if (file.size > HERO_MAX_BYTES) return "That image is over 5 MB. Export it smaller and try again.";
  return null;
};

export const checkTitle = (value: string): string | null => {
  if (!value) return "Add a short title. It describes the banner to search engines and screen readers.";
  if (value.length > TITLE_MAX) return `Keep the title under ${TITLE_MAX} characters.`;
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
