import { refuseUnlessAdmin } from "@/shared/libs/server/auth";
import { badRequest, exclusive, failed, fileField, HREF_ERROR, publish, readForm } from "@/shared/libs/hero/respond";
import { newSlideId, readSlides, removeImage, saveImage } from "@/shared/libs/hero/storage";
import { isSafeHref, type HeroUploadSlide } from "@/shared/libs/hero/types";

/* The slide list: read it, add to it, reorder it, clear it. One slide's own
   edits are in `[id]/route.ts`. */

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ slides: await readSlides() });
}

/** Adds a slide at the end of the list, shown on the homepage straight away. */
export async function POST(request: Request) {
  return refuseUnlessAdmin(request) ?? exclusive(() => add(request));
}

async function add(request: Request) {
  const form = await readForm(request);
  if (!form) return badRequest("Send the slide as a form upload.");

  const href = String(form.get("href") ?? "").trim();
  if (!isSafeHref(href)) return badRequest(HREF_ERROR);

  const desktopFile = fileField(form, "desktop");
  if (!desktopFile) return badRequest("A desktop image is required.");
  const mobileFile = fileField(form, "mobile");

  let desktop: string | null = null;
  let mobile: string | null = null;
  try {
    desktop = await saveImage(desktopFile);
    mobile = mobileFile ? await saveImage(mobileFile) : null;

    const slide: HeroUploadSlide = {
      id: newSlideId(),
      href,
      desktop,
      mobile,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    return await publish([...(await readSlides()), slide]);
  } catch (error) {
    // Nothing points at these yet, so they would only be orphans on disk.
    await removeImage(desktop);
    await removeImage(mobile);
    return failed(error);
  }
}

/** Reorders the list. Takes every id, in the new order. */
export async function PUT(request: Request) {
  return refuseUnlessAdmin(request) ?? exclusive(() => reorder(request));
}

async function reorder(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const order = (body as { order?: unknown } | null)?.order;
  if (!Array.isArray(order) || !order.every((id) => typeof id === "string")) {
    return badRequest("Send the new order as a list of slide ids.");
  }

  const current = await readSlides();
  /* Must be the same set of ids. A list that has changed in another tab since
     this one loaded would otherwise drop or duplicate a slide. */
  const same =
    order.length === current.length &&
    new Set(order).size === order.length &&
    current.every((slide) => order.includes(slide.id));
  if (!same) return badRequest("The slides changed since this page loaded. Reload and try again.", 409);

  const byId = new Map(current.map((slide) => [slide.id, slide]));
  try {
    return await publish(order.map((id) => byId.get(id)!));
  } catch (error) {
    return failed(error);
  }
}

/** Removes every uploaded slide. The homepage goes back to its built-in six. */
export async function DELETE(request: Request) {
  return refuseUnlessAdmin(request) ?? exclusive(reset);
}

async function reset() {
  try {
    const current = await readSlides();
    const response = await publish([]);
    for (const slide of current) {
      await removeImage(slide.desktop);
      await removeImage(slide.mobile);
    }
    return response;
  } catch (error) {
    return failed(error);
  }
}
