import "server-only";
import { publishedSlides } from "@/shared/libs/hero/storage";
import { HERO_SIZES, heroImageUrl } from "@/shared/libs/hero/types";
import { home_data } from "./constants";
import type { HeroSlide } from "./types";

/** The slides the homepage opens with.
 *
 *  Whatever the portal has published, in its order — or the built-in set while
 *  it has published nothing, so the banner is never empty. All or nothing on
 *  purpose: mixing the two would leave no way to retire a built-in slide. */
export const heroSlides = async (): Promise<HeroSlide[]> => {
  const uploads = await publishedSlides();
  if (!uploads.length) return home_data.hero.slides;

  return uploads.map((slide, position) => {
    const desktop = { src: heroImageUrl(slide.desktop), ...HERO_SIZES.desktop };

    return {
      id: slide.id,
      /* The portal does not ask for a ground colour, and the reference's own
         slides are all light, so the dots stay dark. */
      theme: "light",
      /* The portal does not collect alt text, so the link would otherwise have
         no name at all for a screen reader. */
      alt: `Featured offer ${position + 1} of ${uploads.length}`,
      href: slide.href,
      desktop,
      mobile: slide.mobile
        ? { src: heroImageUrl(slide.mobile), ...HERO_SIZES.mobile }
        : desktop,
    };
  });
};
