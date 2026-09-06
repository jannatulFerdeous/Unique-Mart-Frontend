import type { NavItem } from "@/shared/config/navigation";

export type Crumb = NavItem;

export type ProductDetailsData = {
  tabs: { id: string; label: string }[];
  labels: {
    inStock: string;
    outOfStock: string;
    status: string;
    color: string;
    share: string;
    buyNow: string;
    cashPrice: string;
    cashNote: string;
    emiPrice: string;
    emiFrom: string;
    emiNote: string;
    similar: string;
    trust: string;
    noSpecs: string;
  };
};
