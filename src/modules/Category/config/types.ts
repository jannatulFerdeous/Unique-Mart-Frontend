import type { Product } from "@/shared/config/catalog";

/** One filter checkbox: what it matches, what it reads, how many it covers. */
export type FacetOption = {
  value: string;
  label: string;
  count: number;
};

/** A sidebar group, already reduced to the values these products actually have. */
export type FacetGroupView = {
  id: string;
  label: string;
  options: FacetOption[];
};

/** A product as the listing needs it — the card's data plus the two things the
 *  filters sort on that do not live on `Product`. */
export type ListingProduct = {
  product: Product;
  /** Direct child of the category being viewed, when the product sits under
   *  one. Absent on a leaf category, where there is nothing to drill into. */
  child?: string;
  /** Spec-derived facet values, keyed by facet id. See shared/config/facets.ts. */
  facets: Record<string, string[]>;
};

export type SortId = "featured" | "price-asc" | "price-desc" | "name";

export type CategoryData = {
  /** `{name}` is replaced with the category's own name. */
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
  /** Only the groups that are not spec-derived; the rest name themselves
   *  from `shared/config/facets.ts`. */
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
    /** `{name}` again. */
    headingTemplate: string;
    product: string;
    price: string;
    note: string;
  };
};
