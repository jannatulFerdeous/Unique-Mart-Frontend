import type { CartData } from "./types";

export const cart_data: CartData = {
  crumbHome: "Home",
  crumbCart: "Cart List",
  title: "Your basket",

  remove: "Remove",
  removeOne: "Remove {name} from the basket",
  decrease: "One fewer",
  increase: "One more",
  each: "each",
  missing: "This product is no longer sold. Remove it to check out.",

  summary: "Order Summary",
  subtotal: "Subtotal",
  delivery: "Delivery",
  deliveryFree: "Free",
  total: "TOTAL",
  checkout: "Checkout",
  missingBlocks: "Remove the products that are no longer sold to check out.",

  emptyTitle: "Your basket is empty",
  emptyBody: "Nothing here yet. Browse the offers or pick up where you left off.",
  emptyAction: "See what is reduced",

  signInTitle: "Sign in to see your basket",
  signInBody: "Your basket is saved to your account, so it follows you to any device.",
  signInAction: "Sign in",
  loading: "Loading your basket…",
  errorTitle: "Couldn't load your basket",
  retry: "Try again",

  note: "Everything in the basket is ordered together at checkout. You pay cash on delivery.",
  clear: "Empty the basket",
  clearConfirm: "Remove everything?",
  keep: "Keep it",
};
