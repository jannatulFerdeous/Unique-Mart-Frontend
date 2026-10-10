import type { BrandMark } from "@/shared/config/brands";

export type BrandsData = {
  title: string;
  intro: string;
  search: {
    label: string;
    placeholder: string;
  };
  empty: string;
  items: BrandMark[];
};
