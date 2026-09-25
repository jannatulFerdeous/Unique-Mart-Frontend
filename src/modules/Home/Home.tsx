import { home_data } from "./config/constants";
import { heroSlides } from "./config/hero";
import { AboutCopy } from "./partials/AboutCopy";
import { BrandWall } from "./partials/BrandWall";
import { CasesAndProtectors } from "./partials/CasesAndProtectors";
import { Exclusive } from "./partials/Exclusive";
import { FeaturedCategories } from "./partials/FeaturedCategories";
import { HeroBanner } from "./partials/HeroBanner";
import { NewArrival } from "./partials/NewArrival";
import { PromoBanners } from "./partials/PromoBanners";
import { ShopByBrands } from "./partials/ShopByBrands";
import { SoundSurround } from "./partials/SoundSurround";
import { StrapBanner } from "./partials/StrapBanner";
import { TopSelling } from "./partials/TopSelling";
import { TrustStrip } from "./partials/TrustStrip";

export async function Home() {
  // Read on the server: the portal's slides live on disk, not in the bundle.
  const slides = await heroSlides();

  return (
    <>
      <HeroBanner slides={slides} interval={home_data.hero.interval} />
      <TrustStrip />
      <Exclusive />
      <FeaturedCategories />
      <ShopByBrands />
      <TopSelling />
      <PromoBanners />
      <BrandWall />
      <NewArrival />
      <StrapBanner />
      {/* The reference runs Gaming Mania between the strap banner and this. */}
      <SoundSurround />
      <CasesAndProtectors />
      {/* SEO copy closes the page, as it does on the reference. */}
      <AboutCopy />
    </>
  );
}
