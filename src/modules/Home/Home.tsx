import { home_data } from "./config/constants";
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
      <HeroBanner slides={home_data.hero.slides} interval={home_data.hero.interval} />
      <TrustStrip />
      <Exclusive />
      <FeaturedCategories />
      <ShopByBrands />
      <TopSelling />
      <PromoBanners />
      <BrandWall />
      <NewArrival />
      <StrapBanner />
      <SoundSurround />
      <CasesAndProtectors />
      <AboutCopy />
    </>
  );
}
