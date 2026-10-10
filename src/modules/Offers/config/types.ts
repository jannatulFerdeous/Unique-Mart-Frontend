export type OfferSortId = "saving" | "amount" | "price-asc" | "price-desc";

export type OffersData = {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroNote: string;

  title: string;
  countOne: string;
  countMany: string;
  sortLabel: string;
  sorts: { id: OfferSortId; label: string }[];

  tiers: { id: string; label: string; min: number }[];

  empty: string;
  saveLabel: string;
};
