// The policy pages: linked from the footer and from the checkout agreement.
export const legalPaths = {
  terms: "/terms",
  privacy: "/privacy",
  refund: "/return-refund-policy",
  cookies: "/cookies",
} as const;

// Approved refunds reach the shopper within this window (SSLCommerz requires a stated timeline).
export const refundTimeline = "7 to 10 working days";

// Days after delivery to report a damaged, faulty or wrong item.
export const returnWindowDays = 3;
