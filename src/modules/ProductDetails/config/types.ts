export type ProductDetailsData = {
  tabs: { id: string; label: string }[];
  labels: {
    inStock: string;
    outOfStock: string;
    status: string;
    color: string;
    share: string;
    buyNow: string;
    addToCart: string;
    selectColorFirst: string;
    quantity: string;
    decrease: string;
    increase: string;
    added: string;
    viewCart: string;
    cashPrice: string;
    cashNote: string;
    emiPrice: string;
    emiFrom: string;
    emiNote: string;
    similar: string;
    trust: string;
    noSpecs: string;
  };
  reviews: {
    heading: string;
    empty: string;
    write: string;
    cancel: string;
    anonymous: string;
    on: string;
    ofFive: string;
    countOne: string;
    countMany: string;
    storageNote: string;
    saved: string;
    form: {
      rating: string;
      ratingHint: string;
      comment: string;
      commentPlaceholder: string;
      submit: string;
    };
    errors: {
      rating: string;
      comment: string;
    };
  };
};
