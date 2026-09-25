export type WishlistData = {
  crumbHome: string;
  crumbWishlist: string;
  title: string;
  /** `{n}` is how many products are saved. */
  countOne: string;
  countMany: string;

  /** On a product with no variants to choose — straight into the basket. */
  addToCart: string;
  /** On a product that has colours: the colour is still unchosen. */
  chooseOptions: string;
  inCart: string;
  remove: string;
  removeOne: string;
  clear: string;
  clearConfirm: string;
  keep: string;
  saved: string;

  emptyTitle: string;
  emptyBody: string;
  emptyAction: string;

  storageNote: string;
  /** Shown on a saved product that has since left the catalogue. */
  gone: string;
};
