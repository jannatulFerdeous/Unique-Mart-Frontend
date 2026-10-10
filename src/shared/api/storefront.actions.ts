"use server";

import { updateTag } from "next/cache";
import { STOREFRONT_TAG } from "./storefront";

// Called by the admin after a product, category, brand or attribute changes,
// so the next shop visit fetches fresh data instead of serving the cache.
export async function refreshStorefront() {
  updateTag(STOREFRONT_TAG);
}
