import { refuseUnlessAdmin } from "@/shared/libs/server/auth";
import { badRequest, exclusive, failed, fileField, HREF_ERROR, publish, readForm } from "@/shared/libs/hero/respond";
import { readSlides, removeImage, saveImage } from "@/shared/libs/hero/storage";
import { isSafeHref } from "@/shared/libs/hero/types";

/* One slide: change its link, show or hide it, swap either image, or delete it. */

/** Every field is optional; only what is sent changes.
 *
 *  - `href`         new link
 *  - `enabled`      "true" or "false"
 *  - `desktop`      replacement desktop image
 *  - `mobile`       replacement mobile image
 *  - `clearMobile`  "true" drops the mobile image, so phones get the desktop one */
export async function PATCH(request: Request, ctx: RouteContext<"/api/hero-slides/[id]">) {
  const refused = refuseUnlessAdmin(request);
  if (refused) return refused;

  const { id } = await ctx.params;
  return exclusive(() => update(request, id));
}

async function update(request: Request, id: string) {
  const form = await readForm(request);
  if (!form) return badRequest("Send the change as a form upload.");

  const current = await readSlides();
  const slide = current.find((each) => each.id === id);
  if (!slide) return badRequest("That slide no longer exists. Reload the page.", 404);

  const next = { ...slide };

  const href = form.get("href");
  if (href !== null) {
    const trimmed = String(href).trim();
    if (!isSafeHref(trimmed)) return badRequest(HREF_ERROR);
    next.href = trimmed;
  }

  const enabled = form.get("enabled");
  if (enabled !== null) next.enabled = enabled === "true";

  const desktopFile = fileField(form, "desktop");
  const mobileFile = fileField(form, "mobile");
  const saved: string[] = [];

  try {
    if (desktopFile) saved.push((next.desktop = await saveImage(desktopFile)));
    if (mobileFile) {
      next.mobile = await saveImage(mobileFile);
      saved.push(next.mobile);
    } else if (form.get("clearMobile") === "true") {
      next.mobile = null;
    }

    const response = await publish(current.map((each) => (each.id === id ? next : each)));

    // The list no longer points at the old files, so they can go.
    if (next.desktop !== slide.desktop) await removeImage(slide.desktop);
    if (next.mobile !== slide.mobile) await removeImage(slide.mobile);
    return response;
  } catch (error) {
    for (const file of saved) await removeImage(file);
    return failed(error);
  }
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/hero-slides/[id]">) {
  const refused = refuseUnlessAdmin(request);
  if (refused) return refused;

  const { id } = await ctx.params;
  return exclusive(() => remove(id));
}

async function remove(id: string) {
  const current = await readSlides();
  const slide = current.find((each) => each.id === id);
  if (!slide) return badRequest("That slide no longer exists. Reload the page.", 404);

  try {
    const response = await publish(current.filter((each) => each.id !== id));
    await removeImage(slide.desktop);
    await removeImage(slide.mobile);
    return response;
  } catch (error) {
    return failed(error);
  }
}
