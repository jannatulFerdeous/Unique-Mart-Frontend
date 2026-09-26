import type { ProductDetailsData } from "./types";

export const product_details_data: ProductDetailsData = {
  tabs: [
    { id: "specification", label: "Specification" },
    { id: "description", label: "Description" },
    { id: "reviews", label: "Reviews" },
  ],

  labels: {
    status: "Status:",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    color: "Colour",
    share: "Share",
    buyNow: "Buy Now",
    addToCart: "Add To Cart",
    selectColorFirst: "Choose a colour first.",
    quantity: "Quantity",
    decrease: "One fewer",
    increase: "One more",
    added: "Added to your basket.",
    viewCart: "View basket",
    cashPrice: "Cash Discount Price",
    cashNote: "Online / Cash Payment",
    emiPrice: "0% EMI Price",
    emiFrom: "Start from",
    emiNote: "Terms depend on the card, the product and the current campaign.",
    similar: "Similar Products",
    trust: "Every order includes",
    noSpecs: "Full specifications for this product are on the way.",
  },

  reviews: {
    heading: "Reviews",
    empty: "No reviews yet — be the first to review this product.",
    write: "Write a Review",
    cancel: "Cancel",
    anonymous: "You",
    on: "on",
    ofFive: "out of 5",
    countOne: "1 review",
    countMany: "{n} reviews",
    storageNote:
      "Reviews are saved in your browser on this device. They will publish under your account name once sign-in and the review store are connected.",
    saved: "Thanks — your review is saved on this device.",

    form: {
      rating: "Your rating",
      ratingHint: "Pick a rating from 1 to 5 stars.",
      comment: "Your review",
      commentPlaceholder: "What did you think of it?",
      submit: "Submit review",
    },

    errors: {
      rating: "Choose a rating.",
      comment: "Write a few words about the product.",
    },
  },
};
