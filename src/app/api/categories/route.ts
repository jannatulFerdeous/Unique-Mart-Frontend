import { revalidatePath } from "next/cache";
import { refuseUnlessAdmin } from "@/shared/libs/server/auth";
import { createCategory } from "@/shared/libs/categories/edits";
import { editTree, readBody } from "@/shared/libs/categories/respond";
import { readTree, resetTree, seedTree } from "@/shared/libs/categories/storage";

/* The whole tree: read it, add to it, or throw every edit away. One node's own
   edits are in `[slug]/route.ts`. */

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ tree: await readTree() });
}

/** Adds a node at the end of its level. `{ name, parent }` — no parent for a
 *  top-level Category. */
export async function POST(request: Request) {
  const body = await readBody(request);
  return editTree(request, (tree) => createCategory(tree, body).tree);
}

/** Forgets every edit and goes back to the tree generated from the catalogue. */
export async function DELETE(request: Request) {
  const refused = refuseUnlessAdmin(request);
  if (refused) return refused;

  await resetTree();
  revalidatePath("/", "layout");
  return Response.json({ tree: seedTree() });
}
