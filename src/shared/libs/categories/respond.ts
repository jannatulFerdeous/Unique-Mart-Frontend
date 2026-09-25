/* What the category route handlers share. Kept out of the route files, which
   may only export HTTP methods and segment config. */

import "server-only";
import { revalidatePath } from "next/cache";
import { refuseUnlessAdmin } from "@/shared/libs/server/auth";
import { createQueue } from "@/shared/libs/server/files";
import { EditError } from "./edits";
import { readTree, revive, writeTree } from "./storage";
import type { CategoryTree } from "./types";

const exclusive = createQueue();

/** Checks the passcode, then runs one read-change-write against the tree and
 *  saves what it returns. The tree feeds the header on every page, so the whole
 *  site is re-rendered — each page on its next visit, not all at once. */
export const editTree = (
  request: Request,
  change: (tree: CategoryTree) => CategoryTree | Promise<CategoryTree>,
): Promise<Response> | Response =>
  refuseUnlessAdmin(request) ??
  exclusive(async () => {
    try {
      const tree = await change(await readTree());
      /* Checked with the same rules the reader uses. A tree the reader would
         reject is not saved: it would be read back as "malformed", the shop
         would fall back to the built-in menu, and every edit would vanish
         without a word. Refusing here says so at the moment it happens. */
      if (!revive(structuredClone(tree))) {
        throw new Error("Refusing to save a category tree that would not read back.");
      }
      await writeTree(tree);
      revalidatePath("/", "layout");
      return Response.json({ tree });
    } catch (error) {
      if (error instanceof EditError) {
        return Response.json({ error: error.message }, { status: error.status });
      }
      console.error("[categories]", error);
      return Response.json({ error: "The server could not save that. Try again." }, { status: 500 });
    }
  });

/** The JSON body, or an empty object — every field is then "not sent". */
export const readBody = async (request: Request): Promise<Record<string, unknown>> => {
  const body: unknown = await request.json().catch(() => null);
  return typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
};
