import {
  deleteCategory,
  EditError,
  moveCategory,
  renameCategory,
  setCategoryProducts,
  setHidden,
} from "@/shared/libs/categories/edits";
import { editTree, readBody } from "@/shared/libs/categories/respond";

/* One node. Every field of the PATCH body is optional; only what is sent
   changes:

   - `name`      rename
   - `hidden`    true drops it, and everything under it, off the shop
   - `move`      "up" or "down" within its level
   - `products`  the product slugs filed directly on it */

export async function PATCH(request: Request, ctx: RouteContext<"/api/categories/[slug]">) {
  const { slug } = await ctx.params;
  const body = await readBody(request);

  return editTree(request, (source) => {
    let tree = source;
    if (body.name !== undefined) tree = renameCategory(tree, slug, body.name);
    if (body.hidden !== undefined) {
      if (typeof body.hidden !== "boolean") throw new EditError("`hidden` is true or false.");
      tree = setHidden(tree, slug, body.hidden);
    }
    if (body.move !== undefined) {
      if (body.move !== "up" && body.move !== "down") throw new EditError("`move` is up or down.");
      tree = moveCategory(tree, slug, body.move);
    }
    if (body.products !== undefined) tree = setCategoryProducts(tree, slug, body.products);
    return tree;
  });
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/categories/[slug]">) {
  const { slug } = await ctx.params;
  return editTree(request, (tree) => deleteCategory(tree, slug));
}
