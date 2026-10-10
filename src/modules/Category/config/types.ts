import type { Product } from "@/shared/config/catalog";

export type FacetOption = {
  value: string;
  label: string;
  count: number;
};

export type FacetGroupView = {
  id: string;
  label: string;
  options: FacetOption[];
};

export type ListingProduct = {
  product: Product;
  child?: string;
  facets: Record<string, string[]>;
};

export type SortId = "featured" | "price-asc" | "price-desc" | "name";

export type CategoryData = {
  headingTemplate: string;
  summaryOne: string;
  summaryRange: string;
  summaryEmpty: string;
  itemsOne: string;
  itemsMany: string;
  browseLabel: string;
  emptyTitle: string;
  emptyBody: string;
  noMatch: string;
  clearAll: string;
  filtersTitle: string;
  filtersToggle: string;
  sortLabel: string;
  sorts: { id: SortId; label: string }[];
  groups: {
    price: string;
    brand: string;
    category: string;
  };
  priceFrom: string;
  priceTo: string;
  pageSize: number;
  previous: string;
  next: string;
  priceTable: {
    headingTemplate: string;
    product: string;
    price: string;
    note: string;
  };
};
