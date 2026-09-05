import { brandMarks } from "@/shared/config/brands";
import type { BrandsData } from "./types";

export const brands_data: BrandsData = {
  title: "Brands",
  intro: "Every brand we carry, from phones to the cases that protect them.",
  search: {
    label: "Search brands",
    placeholder: "Search brand...",
  },
  empty: "No brand found!",
  items: brandMarks,
};
