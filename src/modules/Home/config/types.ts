import type { ImgHTMLAttributes } from "react";
import type { StaticImageData } from "next/image";
import type { BrandMark } from "@/shared/config/brands";
import type { TrustClaim } from "@/shared/config/trust";
import type { Product, ProductRailData } from "@/shared/config/catalog";

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

export type BrandTab = {
  key: string;
  label: string;
  logo: StaticImageData;
  href: string;
  products: Product[];
};

export type HomeData = {
  trust: TrustClaim[];
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
    brands: PromoBanner[];
    offers: PromoBanner[];
    straps: WideBanner;
  };
  brands: {
    title: string;
    href: string;
    items: BrandTab[];
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
