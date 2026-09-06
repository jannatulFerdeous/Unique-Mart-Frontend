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

// product detail page

export type SpecRow = {
  label: string;
  /** One line per value; the reference stacks multi-line values in one cell. */
  value: string[];
};

export type SpecGroup = {
  title: string;
  rows: SpecRow[];
};

export type ColorOption = {
  name: string;
  /** Swatch fill, as the reference's own colour attribute records it. */
  hex: string;
  /** The gallery shot this colour jumps to — the first photo of its variant. */
  image?: StaticImageData;
};

/** Any variant axis other than colour: storage, memory, dial size, strap size.
 *  The label is whatever the catalogue calls it, so it varies by product. */
export type VariantGroup = {
  label: string;
  values: string[];
};

export type DescriptionBlock = {
  /** Rendered as an h3 inside the description tab. Omit for a lead paragraph. */
  heading?: string;
  paragraphs: string[];
};

/** Everything a product needs beyond its card. Every field but the gallery can
 *  come back thin: the page renders the sections it has data for. */
export type ProductDetail = {
  /** Category names between Home and the product. Labels only — there are no
   *  category routes yet, so the breadcrumb renders them as plain text. Kept
   *  here rather than derived from `brand`, because the Exclusive rail's
   *  products carry no brand on purpose. */
  breadcrumb?: string[];
  gallery: StaticImageData[];
  inStock: boolean;
  /** The bulleted summary beside the price. */
  highlights: string[];
  colors?: ColorOption[];
  options?: VariantGroup[];
  /** Monthly instalment shown on the EMI option. */
  emi?: { months: number; perMonth: number };
  specs: SpecGroup[];
  description?: {
    title: string;
    blocks: DescriptionBlock[];
  };
};
