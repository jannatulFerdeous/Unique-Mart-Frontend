import { readImage } from "@/shared/libs/hero/storage";

/* Serves uploaded hero artwork out of `storage/hero/images`. The homepage never
   links here directly — it goes through the image optimiser, which fetches from
   here once per size and caches the result. */

export async function GET(_request: Request, ctx: RouteContext<"/api/hero-slides/images/[file]">) {
  const { file } = await ctx.params;
  const image = await readImage(file);
  if (!image) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(image.bytes), {
    headers: {
      "Content-Type": image.type,
      /* Every upload gets a fresh name and a replaced image gets another, so
         what is behind a name never changes and can be cached for good. */
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
