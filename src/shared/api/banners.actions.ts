"use server";

import { updateTag } from "next/cache";
import { HERO_BANNERS_TAG } from "./banners";

// Called by the admin after a banner changes, so the next homepage visit
// fetches fresh slides instead of serving the cached ones.
export async function refreshHomepageBanners() {
  updateTag(HERO_BANNERS_TAG);
}
