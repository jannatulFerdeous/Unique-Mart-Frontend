import type { ImgHTMLAttributes } from "react";
import type { StaticImageData } from "next/image";
import type { TrustClaim } from "@/shared/config/trust";
import type { Product } from "@/shared/config/catalog";

export type HeroArt = { src: string; width: number; height: number };

export type HeroSlide = {
  id?: string;
  theme: "dark" | "light";
  alt: string;
  href: string;
  desktop: StaticImageData | HeroArt;
  mobile: StaticImageData | HeroArt;
};

export type HeroSlideImage = {
  key: string;
  theme: HeroSlide["theme"];
  href: string;
  desktopSrcSet: string;
  img: ImgHTMLAttributes<HTMLImageElement>;
};

export type FeaturedCategory = {
  label: string;
  href: string;
  image: StaticImageData;
};

export type PromoBanner = {
  href: string;
  alt: string;
  image: StaticImageData;
};

export type WideBanner = {
  href: string;
  alt: string;
  desktop: StaticImageData;
  mobile: StaticImageData;
};

// A homepage product row; its products come from the admin (see Home.tsx).
export type HomeRow = {
  title: string;
  href: string;
};

// `key` is the brand's slug in the admin; `logo` is null when none was uploaded.
export type BrandTab = {
  key: string;
  label: string;
  logo: StaticImageData | null;
  href: string;
  products: Product[];
};

export type HomeData = {
  trust: TrustClaim[];
  exclusive: HomeRow;
  topSelling: HomeRow;
  newArrival: HomeRow;
  soundSurround: HomeRow;
  casesAndProtectors: HomeRow;
  brandWall: {
    title: string;
  };
  promos: {
    brands: PromoBanner[];
    offers: PromoBanner[];
    straps: WideBanner;
  };
  brands: {
    title: string;
    href: string;
    tabs: number;
  };
  categories: {
    title: string;
    items: FeaturedCategory[];
  };
  hero: {
    interval: number;
    slides: HeroSlide[];
  };
};
