/* Hero slides on disk.
 *
 * The one piece of the portal that is not browser-only: a banner has to reach
 * every visitor, so it lives on the server, in `storage/hero` — a JSON list and
 * a folder of images beside it.
 *
 * Outside `public/` on purpose. `next start` serves `public/` as it was at build
 * time, so an image dropped in there afterwards would 404 in production. The
 * images are served by `app/api/hero-slides/images/[file]` instead.
 *
 * The disk itself is `shared/libs/server/files` — see there for what hosting
 * this needs. */

import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { readJson, removeFile, STORAGE_ROOT, writeJson } from "@/shared/libs/server/files";
import {
  HERO_FILE_PATTERN,
  HERO_MAX_BYTES,
  HERO_TYPES,
  isSafeHref,
  type HeroMime,
  type HeroUploadSlide,
} from "./types";

const ROOT = path.join(STORAGE_ROOT, "hero");
const IMAGES = path.join(ROOT, "images");
const LIST = path.join(ROOT, "slides.json");

const isSlide = (value: unknown): value is HeroUploadSlide => {
  if (typeof value !== "object" || value === null) return false;
  const each = value as Record<string, unknown>;
  return (
    typeof each.id === "string" &&
    typeof each.href === "string" &&
    isSafeHref(each.href) &&
    typeof each.desktop === "string" &&
    HERO_FILE_PATTERN.test(each.desktop) &&
    (each.mobile === null ||
      (typeof each.mobile === "string" && HERO_FILE_PATTERN.test(each.mobile))) &&
    typeof each.enabled === "boolean"
  );
};

/** Every uploaded slide, hidden ones included, in homepage order. An absent or
 *  unreadable file is an empty list — the homepage then shows its built-in
 *  slides, which is the right thing to show while nothing has been uploaded. */
export const readSlides = async (): Promise<HeroUploadSlide[]> => {
  const parsed = await readJson(LIST);
  return Array.isArray(parsed) ? parsed.filter(isSlide) : [];
};

export const writeSlides = (slides: HeroUploadSlide[]): Promise<void> => writeJson(LIST, slides);

/** The slides the homepage shows. */
export const publishedSlides = async (): Promise<HeroUploadSlide[]> =>
  (await readSlides()).filter((slide) => slide.enabled);

/* ------------------------------------------------------------------ images */

/** What the file really is, read from its first bytes. The browser's declared
 *  type is whatever the client says it is, so it decides nothing here. */
const sniff = (bytes: Uint8Array): HeroMime | null => {
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.subarray(from, to));

  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return "image/avif";
  return null;
};

export class UploadError extends Error {}

/** Checks an uploaded file and stores it under a fresh name. */
export const saveImage = async (file: File): Promise<string> => {
  if (file.size === 0) throw new UploadError("That file is empty.");
  if (file.size > HERO_MAX_BYTES) throw new UploadError("Images must be 5 MB or smaller.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniff(bytes);
  if (!type) throw new UploadError("Only PNG, JPG, WebP and AVIF images can be uploaded.");

  /* Random rather than derived from the upload, so a replaced image gets a new
     URL and no browser or optimiser cache can keep serving the old one. */
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${HERO_TYPES[type]}`;

  await mkdir(IMAGES, { recursive: true });
  await writeFile(path.join(IMAGES, name), bytes);
  return name;
};

/** Reads a stored image back. Null for anything that is not one. */
export const readImage = async (
  file: string,
): Promise<{ bytes: Buffer; type: HeroMime } | null> => {
  if (!HERO_FILE_PATTERN.test(file)) return null;

  try {
    const bytes = await readFile(path.join(IMAGES, file));
    const type = sniff(bytes);
    return type ? { bytes, type } : null;
  } catch {
    return null;
  }
};

export const removeImage = async (file: string | null): Promise<void> => {
  if (file && HERO_FILE_PATTERN.test(file)) await removeFile(path.join(IMAGES, file));
};

export const newSlideId = (): string => `HS-${randomBytes(5).toString("hex")}`;
