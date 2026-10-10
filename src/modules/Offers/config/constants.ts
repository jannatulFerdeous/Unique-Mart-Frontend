import type { OffersData } from "./types";

export const offers_data: OffersData = {
  heroEyebrow: "Offers",
  heroTitle: "Save up to {percent}%",
  heroBody:
    "{n} products are reduced right now, from cases to flagship phones. Prices below are what you pay online.",
  heroNote:
    "0% EMI on eligible purchases through partner banks, and exchange on eligible products.",

  title: "All offers",
  countOne: "1 offer",
  countMany: "{n} offers",

  sortLabel: "Sort by",
  sorts: [
    { id: "saving", label: "Biggest saving" },
    { id: "amount", label: "Most money off" },
    { id: "price-asc", label: "Price: low to high" },
    { id: "price-desc", label: "Price: high to low" },
  ],

  tiers: [
    { id: "all", label: "All", min: 0 },
    { id: "10", label: "10% and over", min: 10 },
    { id: "20", label: "20% and over", min: 20 },
    { id: "30", label: "30% and over", min: 30 },
  ],

  empty: "No offers match that filter.",
  saveLabel: "Save",
};
