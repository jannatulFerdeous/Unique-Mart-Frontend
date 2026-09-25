import { fileProduct } from "@/shared/libs/categories/edits";
import { editTree, readBody } from "@/shared/libs/categories/respond";

/* A product's side of the category tree: `{ categories: [...] }` files it on
   exactly those nodes and takes it off every other. The product editor saves
   through here. */

export async function PUT(request: Request, ctx: RouteContext<"/api/product-categories/[product]">) {
  const { product } = await ctx.params;
  const body = await readBody(request);
  return editTree(request, (tree) => fileProduct(tree, product, body.categories));
}
