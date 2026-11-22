import { legalPaths, refundTimeline, returnWindowDays } from "@/shared/config/legal";
import { deliveryChargeSummary } from "@/shared/config/shipping";
import { site } from "@/shared/config/site";

// The coupon list at checkout. Set false to hide it.
export const COUPONS_AT_CHECKOUT = true;

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
  deliveryTo: "Delivery {price}",

  couponsHeading: "Coupons",
  couponsLoading: "Finding coupons for your basket…",
  couponSaves: "You save {amount}",
  couponUse: "Apply",
  couponInUse: "Applied",
  couponsMore: "Show {n} more",
  couponsLess: "Show fewer",
  couponHaveCode: "Have a code?",
  couponLabel: "Coupon code",
  couponPlaceholder: "Enter a code",
  couponApply: "Apply",
  couponApplying: "Checking…",
  couponRemove: "Remove",
  couponFailed: "Couldn't check that code. Please try again.",

  agreeBefore: "I have read and agree to the ",
  agreeTerms: "Terms & Conditions",
  agreePrivacy: "Privacy Policy",
  agreeRefund: "Return & Refund Policy",

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

// The agreement shown when the shopper presses Place order. Short versions of
// each policy; the full pages are linked. The box starts unticked (SSLCommerz rule).
export const agreement = {
  title: "Before you place your order",
  intro: "Please read this short summary of our policies. The full versions are linked below.",
  sections: [
    {
      heading: "Returns & refunds",
      href: legalPaths.refund,
      link: "Read the full Return & Refund Policy",
      points: [
        `Report a damaged, faulty or wrong item within ${returnWindowDays} days of delivery.`,
        "Return it unused, in its original packaging, with all accessories and the invoice.",
        `Approved refunds are completed within ${refundTimeline}, to the payment method you used.`,
        "You can cancel from your account until the order is shipped.",
      ],
    },
    {
      heading: "Delivery",
      points: [
        "We deliver anywhere in Bangladesh.",
        `Delivery charge: ${deliveryChargeSummary}. It is shown in your order summary.`,
      ],
    },
    {
      heading: "Terms & conditions",
      href: legalPaths.terms,
      link: "Read the full Terms & Conditions",
      points: [
        "You are responsible for orders placed from your account, so keep your details correct.",
        "The price that applies is the one shown when you place the order.",
        "Warranty is given by the manufacturer on its own terms. Keep your invoice for claims.",
      ],
    },
    {
      heading: "Privacy",
      href: legalPaths.privacy,
      link: "Read the full Privacy Policy",
      points: [
        "We use your name, phone and address only to process and deliver your order and to contact you about it.",
        "Online payments go through SSLCOMMERZ. We never see or store your card or mobile banking details.",
        "We do not sell your information.",
      ],
    },
  ],
  contact: `Questions? Call ${site.phone} or email ${site.email}.`,
  confirm: "Agree & place order",
  cancel: "Cancel",
  close: "Close",
  tickFirst: "Tick the box above to continue.",
} as const;
