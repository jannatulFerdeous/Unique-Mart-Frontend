/* The portal's side of the hero-slide API.
 *
 * Unlike most collections in this folder, hero slides are not kept in
 * `localStorage`: they are the homepage banner, so they live on the server and
 * every change here is live for every visitor. See `shared/libs/hero/storage`,
 * and `./api` for how the passcode travels. */

import { HERO_MAX_BYTES, HERO_TYPES, type HeroUploadSlide } from "@/shared/libs/hero/types";
import { adminFetch, jsonBody } from "./api";

const ENDPOINT = "/api/hero-slides";

const call = async (path: string, init?: RequestInit): Promise<HeroUploadSlide[]> =>
  (await adminFetch<{ slides: HeroUploadSlide[] }>(`${ENDPOINT}${path}`, init)).slides;

export const listHeroSlides = () => call("");

export const addHeroSlide = (form: FormData) => call("", { method: "POST", body: form });

export const updateHeroSlide = (id: string, form: FormData) =>
  call(`/${encodeURIComponent(id)}`, { method: "PATCH", body: form });

export const deleteHeroSlide = (id: string) =>
  call(`/${encodeURIComponent(id)}`, { method: "DELETE" });

export const reorderHeroSlides = (order: string[]) => call("", jsonBody("PUT", { order }));

export const resetHeroSlides = () => call("", { method: "DELETE" });

/** Browser-side check before an upload is spent on a file the server will
 *  refuse anyway. Returns the problem, or null. */
export const checkImage = (file: File): string | null => {
  if (!(file.type in HERO_TYPES)) return "Choose a PNG, JPG, WebP or AVIF image.";
  if (file.size > HERO_MAX_BYTES) return "That image is over 5 MB. Export it smaller and try again.";
  return null;
};
