export type OfferSortId = "saving" | "amount" | "price-asc" | "price-desc";

export type OffersData = {
  /** `{percent}` is the deepest discount in the catalogue right now. */
  heroEyebrow: string;
  heroTitle: string;
  /** `{n}` is how many products are reduced. */
  heroBody: string;
  heroNote: string;

  title: string;
  countOne: string;
  countMany: string;
  sortLabel: string;
  sorts: { id: OfferSortId; label: string }[];

  /** Quick tiers. `min` is the lowest per cent the chip admits; 0 is "All". */
  tiers: { id: string; label: string; min: number }[];

  empty: string;
  saveLabel: string;
};
