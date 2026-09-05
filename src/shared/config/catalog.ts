import type { StaticImageData } from "next/image";

// Shared because product cards render outside Home too, once Shop exists.
export type Product = {
  slug: string;
  name: string;
  image: StaticImageData;
  /** Shown above the title. Omitted in rails that are already one brand. */
  brand?: string;
  price: number;
  /** Original price. Struck through beside `price` when present. */
  compareAt?: number;
  rating?: number;
  /** Corner ribbon, e.g. "NEW ARRIVAL". */
  badge?: string;
};

export type ProductRailData = {
  title: string;
  href: string;
  products: Product[];
};
