import type { ProductDetailsData } from "./types";

export const product_details_data: ProductDetailsData = {
  // The reference has four; Reviews and Questions need a backend, so ours are
  // the two that can be real today. See memory.md.
  tabs: [
    { id: "specification", label: "Specification" },
    { id: "description", label: "Description" },
  ],

  labels: {
    status: "Status:",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    color: "Colour",
    // Every other variant axis labels itself from the catalogue — Storage,
    // Memory, Dial Size, Strap Size — so there is no constant for it here.
    share: "Share",
    buyNow: "Buy Now",
    cashPrice: "Cash Discount Price",
    cashNote: "Online / Cash Payment",
    emiPrice: "0% EMI Price",
    emiFrom: "Start from",
    emiNote: "Terms depend on the card, the product and the current campaign.",
    similar: "Similar Products",
    trust: "Every order includes",
    noSpecs: "Full specifications for this product are on the way.",
  },
};
