import type { ImgHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import type { BrandMark } from "@/shared/config/brands";
import type { Product, ProductRailData } from "@/shared/config/catalog";

// hero banner

export type HeroSlide = {
  /** Ground the artwork sits on. Drives the pagination dot colour. */
  theme: "dark" | "light";
  alt: string;
  href: string;
  /** 1920×570 — shown from `md` up. */
  desktop: StaticImageData;
  /** 1000×700 — shown below `md`. */
  mobile: StaticImageData;
};

/** A slide after `HeroBanner` has run both artworks through `getImageProps`.
 *  The carousel is a client component, so the optimiser work happens on the
 *  server and only the finished attributes cross the boundary. */
export type HeroSlideImage = {
  theme: HeroSlide["theme"];
  href: string;
  /** srcSet for the `md`-and-up `<source>`, already optimised. */
  desktopSrcSet: string;
  /** Everything the `<img>` fallback needs, below `md`. */
  img: ImgHTMLAttributes<HTMLImageElement>;
};

// trust strip

export type TrustItem = {
  icon: LucideIcon;
  label: string;
};

// featured categories

export type FeaturedCategory = {
  label: string;
  href: string;
  /** 132×132 PNG, product cut out on a transparent ground. */
  image: StaticImageData;
};

// promo banners

export type PromoBanner = {
  href: string;
  /** Describes the artwork, offer copy included — it is all inside the image. */
  alt: string;
  image: StaticImageData;
};

/** A banner the reference art-directs: two compositions, not two sizes. */
export type WideBanner = {
  href: string;
  alt: string;
  /** 1320×330 (4:1) — shown from `md` up. */
  desktop: StaticImageData;
  /** 655×343 (1.909:1) — shown below `md`. */
  mobile: StaticImageData;
};

// shop by brands

export type BrandTab = {
  /** Stable key — the React key and the tab's id fragment. */
  key: string;
  /** The tab's accessible name; the logo itself is decorative. */
  label: string;
  /** 384×200 wordmark on a transparent ground. */
  logo: StaticImageData;
  href: string;
  products: Product[];
};

export type HomeData = {
  trust: TrustItem[];
  exclusive: ProductRailData;
  topSelling: ProductRailData;
  newArrival: ProductRailData;
  soundSurround: ProductRailData;
  casesAndProtectors: ProductRailData;
  brandWall: {
    title: string;
    brands: BrandMark[];
  };
  promos: {
    /** Square brand tiles — four across at lg, two below. */
    brands: PromoBanner[];
    /** 655×343 offer banners — two across from md. */
    offers: PromoBanner[];
    /** The full-width strap banner, below New Arrival. */
    straps: WideBanner;
  };
  brands: {
    title: string;
    href: string;
    items: BrandTab[];
  };
  /** No "Show All" link — the reference section is heading-only. */
  categories: {
    title: string;
    items: FeaturedCategory[];
  };
  hero: {
    /** Dwell per slide in ms. The 300ms slide itself is `duration-300` on the
     *  track in `HeroBanner`. */
    interval: number;
    slides: HeroSlide[];
  };
};
