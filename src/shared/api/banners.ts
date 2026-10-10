import type { ApiResponse } from "@/redux/api/types";
import type { Banner } from "@/redux/features/banner/banner.types";
import type { HeroSlide } from "@/modules/Home/config/types";
import { API_BASE_URL } from "@/shared/config/api";
import { HERO_SIZE } from "@/shared/libs/hero/types";

// Cache tag for the homepage slides; the admin clears it after every change.
export const HERO_BANNERS_TAG = "hero-banners";

// Safety net if a clear is ever missed: refetch at most this often.
const REVALIDATE_SECONDS = 300;

const toHeroSlide = (banner: Banner): HeroSlide => {
  const art = { src: banner.image.url, width: HERO_SIZE.width, height: HERO_SIZE.height };

  return {
    id: banner._id,
    theme: "light",
    alt: banner.title,
    href: banner.link,
    // The backend stores one image, so phones crop the desktop art.
    desktop: art,
    mobile: art,
  };
};

// Server-side on purpose: the slides land in the first HTML response, so
// crawlers see them and the first image starts loading immediately.
// Returns null when the backend can't be reached, so callers can fall back.
export async function getHeroSlides(): Promise<HeroSlide[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/banners/active`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [HERO_BANNERS_TAG] },
    });
    if (!response.ok) return null;

    const { data }: ApiResponse<Banner[]> = await response.json();
    return data.map(toHeroSlide);
  } catch {
    return null;
  }
}
