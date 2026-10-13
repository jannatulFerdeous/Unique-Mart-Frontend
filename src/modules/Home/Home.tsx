import { getHeroSlides } from "@/shared/api/banners";
import { getCatalog } from "@/shared/api/storefront";
import {
  brandOf,
  brandPageHref,
  findNode,
  findNodeBySlug,
  productsUnder,
  toBrandMarks,
  toCard,
  type ApiProduct,
  type BrandMark,
  type Catalog,
} from "@/shared/libs/storefront/catalog";
import { home_data } from "./config/constants";
import type { BrandTab, FeaturedCategory } from "./config/types";
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

// Cards per homepage row; the row's "View all" link shows the rest.
const ROW = 12;

const cards = (catalog: Catalog, products: ApiProduct[]) =>
  products.slice(0, ROW).map((product) => toCard(catalog, product));

// The products behind a /category/... link from the homepage config.
const linked = (catalog: Catalog, href: string) => {
  const path = href.replace(/^\/category\//, "").split("/");
  const node = path.length === 1 ? findNodeBySlug(catalog, path[0]) : findNode(catalog, path);
  return node ? productsUnder(catalog, node) : [];
};

// Every row is driven by what the admin sets: the Exclusive / Featured ticks,
// date added, sales, brand and category.
const rowsFor = (catalog: Catalog) => {
  const all = catalog.products; // newest first
  const exclusive = all.filter((product) => product.isExclusive);
  const featured = all.filter((product) => product.isFeatured);

  return {
    // Until something is ticked Exclusive, the row shows featured products.
    exclusive: cards(catalog, exclusive.length ? exclusive : featured),
    topSelling: cards(
      catalog,
      [...all].sort((a, b) => b.salesCount - a.salesCount || Number(b.isFeatured) - Number(a.isFeatured)),
    ),
    newArrival: cards(catalog, all),
    soundSurround: cards(catalog, linked(catalog, home_data.soundSurround.href)),
    cases: cards(catalog, linked(catalog, home_data.casesAndProtectors.href)),
  };
};

// The brands with the most live products, each with a row of them.
const brandTabs = (catalog: Catalog, brands: BrandMark[]): BrandTab[] =>
  brands
    .filter((brand) => brand.productCount > 0)
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, home_data.brands.tabs)
    .map((brand) => ({
      key: brand.slug,
      label: brand.label,
      logo: brand.logo,
      href: brandPageHref(brand.slug),
      products: cards(
        catalog,
        catalog.products.filter((product) => brandOf(catalog, product)?.slug === brand.slug),
      ),
    }));

// Category tiles whose link leads somewhere with products, pointed at the full address.
const featuredCategories = (catalog: Catalog): FeaturedCategory[] =>
  home_data.categories.items.flatMap((item) => {
    const path = item.href.replace(/^\/category\//, "").split("/");
    const node = path.length === 1 ? findNodeBySlug(catalog, path[0]) : findNode(catalog, path);
    return node && node.productCount > 0 ? [{ ...item, href: node.href }] : [];
  });

export async function Home() {
  const [fromAdmin, catalog] = await Promise.all([getHeroSlides(), getCatalog()]);
  // Backend down or no live banners → keep the bundled slides so the hero never disappears.
  const slides = fromAdmin?.length ? fromAdmin : home_data.hero.slides;
  const rows = rowsFor(catalog);
  const brandMarks = toBrandMarks(catalog);
  const brands = brandTabs(catalog, brandMarks);

  return (
    <>
      <HeroBanner slides={slides} interval={home_data.hero.interval} />
      <TrustStrip />
      <Exclusive products={rows.exclusive} />
      <FeaturedCategories items={featuredCategories(catalog)} />
      {brands.length > 0 && <ShopByBrands items={brands} />}
      <TopSelling products={rows.topSelling} />
      <PromoBanners />
      {brandMarks.length > 0 && <BrandWall brands={brandMarks} />}
      <NewArrival products={rows.newArrival} />
      <StrapBanner />
      <SoundSurround products={rows.soundSurround} />
      <CasesAndProtectors products={rows.cases} />
      <AboutCopy />
    </>
  );
}
