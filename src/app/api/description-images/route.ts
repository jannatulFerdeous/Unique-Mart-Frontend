import { createHash } from "node:crypto";
import { API_BASE_URL } from "@/shared/config/api";

// Uploads one image for a product description to Cloudinary and answers with
// its address. The backend only uploads images attached to a record (a
// product's gallery, a brand's logo), so the description editor uses this.

const MAX_BYTES = 5 * 1024 * 1024;
// No SVG: it can carry scripts.
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const FOLDER = "unique-mart/descriptions";

const fail = (status: number, message: string) => Response.json({ success: false, message }, { status });

export async function POST(request: Request) {
  // Only admins. The backend lets the same roles list coupons as edit
  // products, so its answer to that says whether this token may upload.
  // It answers an expired or broken token with a 500, not a 401; both go back
  // as 401 so the dashboard refreshes the token and retries.
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return fail(401, "Please sign in again.");
  const check = await fetch(`${API_BASE_URL}/coupons`, { headers: { authorization }, cache: "no-store" }).catch(
    () => null,
  );
  if (!check) return fail(502, "Couldn't reach the server to check your sign-in.");
  if (check.status === 401 || check.status === 500) return fail(401, "Please sign in again.");
  if (check.status === 403) return fail(403, "Only admins can upload images.");
  if (!check.ok) return fail(502, "Couldn't check your sign-in. Please try again.");

  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return fail(500, "Image uploads aren't set up: the Cloudinary keys are missing.");

  const form = await request.formData().catch(() => null);
  const image = form?.get("image");
  if (!(image instanceof File)) return fail(400, "Choose an image to upload.");
  if (!TYPES.includes(image.type)) return fail(400, "Use a JPG, PNG, WebP, GIF or AVIF image.");
  if (image.size > MAX_BYTES) return fail(400, "Images can be up to 5 MB.");

  const timestamp = String(Math.round(Date.now() / 1000));
  const signature = createHash("sha1").update(`folder=${FOLDER}&timestamp=${timestamp}${secret}`).digest("hex");
  const upload = new FormData();
  upload.append("file", image);
  upload.append("api_key", key);
  upload.append("timestamp", timestamp);
  upload.append("folder", FOLDER);
  upload.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: upload,
  }).catch(() => null);
  const body = (await response?.json().catch(() => null)) as
    | { secure_url?: string; width?: number; height?: number; error?: { message?: string } }
    | null;
  if (!response?.ok || !body?.secure_url) {
    return fail(502, body?.error?.message ?? "Couldn't upload the image. Please try again.");
  }

  return Response.json({ success: true, data: { url: body.secure_url, width: body.width, height: body.height } });
}
