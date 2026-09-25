import type { CartData } from "./types";

export const cart_data: CartData = {
  crumbHome: "Home",
  crumbCart: "Cart List",
  title: "Your basket",

  selectAll: "Select all",
  selectedCount: "{n} selected",
  color: "Colour",
  remove: "Remove",
  removeOne: "Remove {name} from the basket",
  decrease: "One fewer",
  increase: "One more",
  quantity: "Quantity",
  each: "each",

  summary: "Order Summary",
  subtotal: "Subtotal",
  delivery: "Delivery",
  deliveryFree: "Free",
  /* The threshold is the one the admin portal's settings screen shows. Both
     read the same number so the shop cannot promise one thing and charge
     another — see `shared/config/shipping`. */
  deliveryNote: "Free delivery on orders over {threshold}.",
  total: "TOTAL",
  checkout: "Checkout",
  nothingSelected: "Tick something to check out.",

  emptyTitle: "Your basket is empty",
  emptyBody: "Nothing here yet. Browse the offers or pick up where you left off.",
  emptyAction: "See what is reduced",

  storageNote:
    "This basket is kept in this browser. There is no checkout behind it yet, so nothing is ordered and no payment is taken.",
  clear: "Empty the basket",
  clearConfirm: "Remove everything?",
};
