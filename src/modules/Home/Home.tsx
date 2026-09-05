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

export function Home() {
  return (
    <>
      <HeroBanner />
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
