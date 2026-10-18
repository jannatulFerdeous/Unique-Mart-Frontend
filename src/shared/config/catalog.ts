import type { StaticImageData } from "next/image";

export type Product = {
  // The backend product's _id: what the cart, wishlist and reviews refer to.
  id: string;
  // For a product with variants, the one a card saves to the wishlist: the
  // first in stock, else the first, as the product page starts on.
  variantId?: string;
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

// One buyable version of a product: the option values that pick it, and its own
// price and stock. `options` is keyed by the VariantGroup label.
export type VariantOffer = {
  // The backend variant's _id, which the cart needs to add this version.
  id?: string;
  sku: string;
  options: Record<string, string>;
  price: number;
  compareAt?: number;
  stock: number;
};

export type ProductDetail = {
  breadcrumb?: { label: string; slug: string }[];
  gallery: StaticImageData[];
  inStock: boolean;
  highlights: string[];
  colors?: ColorOption[];
  options?: VariantGroup[];
  variants?: VariantOffer[];
  emi?: { months: number; perMonth: number };
  specs: SpecGroup[];
  // The scraped reference details (config/product-details) use these blocks.
  description?: {
    title: string;
    blocks: DescriptionBlock[];
  };
  // The admin's rich-text description, sanitised on the server.
  richDescription?: {
    title: string;
    html: string;
  };
};
