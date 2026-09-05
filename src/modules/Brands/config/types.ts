import type { BrandMark } from "@/shared/config/brands";

export type BrandsData = {
  title: string;
  /** One line under the heading. The reference page has no copy at all. */
  intro: string;
  search: {
    /** Visually hidden — the field has no visible label, as on the reference. */
    label: string;
    placeholder: string;
  };
  /** Shown in place of the grid when nothing matches. */
  empty: string;
  items: BrandMark[];
};
