import type { CategoryData } from "./types";

export const category_data: CategoryData = {
  headingTemplate: "{name} Price in Bangladesh",

  // Only ever states our own price range, so it cannot go stale or overclaim.
  summaryOne: "Browse the {name} we carry and order yours below.",
  summaryRange:
    "{name} start from {from} at Unique Mart. Browse the range below and order yours.",
  summaryEmpty: "We are not carrying anything in this category yet.",

  itemsOne: "1 item found in {name}",
  itemsMany: "{n} items found in {name}",
  browseLabel: "Browse",

  emptyTitle: "Nothing here yet",
  emptyBody:
    "This category is part of the catalogue, but we are not stocking anything in it right now. Try one of the sections above, or browse everything on the home page.",
  noMatch: "No products match these filters.",
  clearAll: "Clear all",

  filtersTitle: "Filter",
  filtersToggle: "Filters",
  sortLabel: "Sort by",
  sorts: [
    { id: "featured", label: "Featured" },
    { id: "price-asc", label: "Price: low to high" },
    { id: "price-desc", label: "Price: high to low" },
    { id: "name", label: "Name: A to Z" },
  ],

  groups: {
    price: "Price",
    brand: "Brand",
    category: "Category",
  },

  priceFrom: "Min",
  priceTo: "Max",

  pageSize: 24,
  previous: "Previous",
  next: "Next",

  priceTable: {
    headingTemplate: "Latest {name} price list",
    product: "Product",
    price: "Price in BDT",
    note: "Prices are the current online price and change with offers.",
  },
};
