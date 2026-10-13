export const checkout_data = {
  title: "Checkout",

  signInTitle: "Sign in to check out",
  signInBody: "Orders are placed from your account, so you can follow them afterwards.",
  signIn: "Sign in",
  loading: "Getting your order ready…",
  errorTitle: "Couldn't load your checkout",
  retry: "Try again",
  emptyTitle: "Your basket is empty",
  emptyBody: "Add something to your basket, then come back to check out.",
  emptyAction: "Keep shopping",

  addressHeading: "Delivery address",
  addAddress: "Add a new address",
  firstAddress: "Where should we deliver? Add an address to continue.",
  default: "Default",
  needAddress: "Choose or add a delivery address to place your order.",

  paymentHeading: "Payment",
  methods: {
    sslcommerz: {
      label: "Full payment",
      note: "Pay the whole amount now by card, mobile banking or internet banking. SSLCommerz opens in a pop-up window.",
      place: "Place order and pay",
      placing: "Opening SSLCommerz…",
    },
    cod: {
      label: "Cash on delivery",
      note: "Pay in cash when your order arrives.",
      place: "Place order",
      placing: "Placing your order…",
    },
  },

  payingHeading: "Finish paying in the SSLCommerz window",
  payingBody: "Your order is placed. Complete the payment in the pop-up window and this page will update when it's done.",
  payingClosed:
    "The payment window was closed. If you finished paying, this page will update in a moment. If not, you can pay from your order.",
  unpaidHeading: "Your order is placed, but SSLCommerz didn't open",
  unpaidBody: "Nothing has been charged. You can pay for it from your order.",
  unpaidFallback: "Couldn't start the payment.",
  showWindow: "Show the payment window",
  viewOrder: "Go to my order",
} as const;
