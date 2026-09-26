import type { StaticImageData } from "next/image";

export type Product = {
  slug: string;
  name: string;
  image: StaticImageData;
  brand?: string;
  price: number;
  compareAt?: number;
  rating?: number;
  badge?: string;
};

export type ProductRailData = {
  title: string;
  href: string;
  products: Product[];
};

export type SpecRow = {
  label: string;
  value: string[];
};

export type SpecGroup = {
  title: string;
  rows: SpecRow[];
};

export type ColorOption = {
  name: string;
  hex: string;
  image?: StaticImageData;
};

export type VariantGroup = {
  label: string;
  values: string[];
};

export type DescriptionBlock = {
  heading?: string;
  paragraphs: string[];
};

export type ProductDetail = {
  breadcrumb?: { label: string; slug: string }[];
  gallery: StaticImageData[];
  inStock: boolean;
  highlights: string[];
  colors?: ColorOption[];
  options?: VariantGroup[];
  emi?: { months: number; perMonth: number };
  specs: SpecGroup[];
  description?: {
    title: string;
    blocks: DescriptionBlock[];
  };
};
