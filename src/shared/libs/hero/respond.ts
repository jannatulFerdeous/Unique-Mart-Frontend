/* What the hero-slide route handlers share. Kept out of the route files, which
   may only export HTTP methods and segment config. */

import "server-only";
import { revalidatePath } from "next/cache";
import { createQueue } from "@/shared/libs/server/files";
import { UploadError, writeSlides } from "./storage";
import type { HeroUploadSlide } from "./types";

/** A file field, or null for a missing one — an empty file input still posts a
 *  zero-byte part, which means "nothing chosen", not "an empty image". */
export const fileField = (form: FormData, name: string): File | null => {
  const value = form.get(name);
  return value instanceof File && value.size > 0 ? value : null;
};

/** Saves the list and re-renders the homepage, which is otherwise prerendered
 *  with whatever was on disk at build time. */
export const publish = async (slides: HeroUploadSlide[]): Promise<Response> => {
  await writeSlides(slides);
  revalidatePath("/");
  return Response.json({ slides });
};

/** One slide-list write at a time. See `createQueue`. */
export const exclusive = createQueue();

export const badRequest = (error: string, status = 400): Response =>
  Response.json({ error }, { status });

export const failed = (error: unknown): Response => {
  if (error instanceof UploadError) return badRequest(error.message);
  console.error("[hero-slides]", error);
  return badRequest("The server could not save that. Try again.", 500);
};

export const readForm = async (request: Request): Promise<FormData | null> => {
  try {
    return await request.formData();
  } catch {
    return null;
  }
};

export const HREF_ERROR =
  "The link must be a path on this site, like /offers, or a full https:// address.";
