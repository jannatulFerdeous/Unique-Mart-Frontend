import { site } from "./site";

export type FaqItem = {
  /** Stable key, the React key and the search index's handle. */
  id: string;
  question: string;
  answer: string;
};

export type FaqGroup = {
  /** Doubles as the anchor the jump nav targets. */
  id: string;
  title: string;
  items: FaqItem[];
};

/* Answers are held to the same rule as the rest of the site: they may restate
   the six promises in `trust.ts`, online-only, nationwide delivery and
   `site.since`, and nothing more. Where a real answer needs a number we do not
   have — delivery windows, charges, a return period, warranty lengths — the
   answer points at support rather than inventing one. See memory.md. */

export const faqGroups: FaqGroup[] = [
  {
    id: "ordering",
    title: "Ordering",
    items: [
      {
        id: "how-to-order",
        question: "How do I place an order?",
        answer:
          "Find what you want in the catalogue, add it to your cart and check out. Everything happens online — there is no branch to visit and no form to collect.",
      },
      {
        id: "showroom",
        question: `Does ${site.name} have a showroom?`,
        answer:
          "No. We are online only, which is a deliberate choice rather than a stage we are passing through. It keeps our overheads down, and it means the catalogue and the price are the same for everyone.",
      },
      {
        id: "not-sure-which",
        question: "I am not sure which model I need. Can you help?",
        answer: `Yes, and we would rather you asked. Call ${site.phone} or email ${site.email} with what you are trying to do, and we will point you at the right thing — or tell you honestly that we do not stock it.`,
      },
      {
        id: "change-order",
        question: "Can I change or cancel an order after placing it?",
        answer: `Contact us on ${site.phone} as soon as you can. What is still possible depends on how far along the order is, so the sooner you reach us the more we can do.`,
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: [
      {
        id: "delivery-where",
        question: "Where do you deliver?",
        answer:
          "Anywhere in Bangladesh. Delivery is nationwide on online orders, subject to product availability and courier coverage in your area.",
      },
      {
        id: "delivery-time",
        question: "How long will my order take to arrive?",
        answer: `It depends on where you are and on the courier serving that area, so we would rather give you a real answer than a general one. Call ${site.phone} with your address and we will tell you what to expect.`,
      },
      {
        id: "delivery-charge",
        question: "Is there a delivery charge?",
        answer: `Any charge depends on the destination and is shown before you confirm the order. If you want to know the charge to a specific address first, ask us on ${site.phone}.`,
      },
      {
        id: "delivery-outside-dhaka",
        question: "Do you deliver outside Dhaka?",
        answer:
          "Yes. Nationwide means nationwide — the same catalogue and the same prices apply wherever in the country you are ordering from.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment and EMI",
    items: [
      {
        id: "payment-methods",
        question: "What payment methods can I use?",
        answer:
          "The methods available to you are shown at checkout. Whichever you pick, payment runs over encrypted, established channels, so your details are never handled in the clear.",
      },
      {
        id: "emi",
        question: "Do you offer 0% EMI?",
        answer:
          "Eligible purchases qualify for 0% EMI through partner banks. The available duration and the cards accepted depend on the product and the campaign running at the time.",
      },
      {
        id: "emi-eligible",
        question: "How do I know if a product is EMI eligible?",
        answer: `Eligibility varies by product, card and campaign, so it is worth checking rather than assuming. Ask us on ${site.phone} about a specific product and we will confirm what applies to it today.`,
      },
      {
        id: "payment-safe",
        question: "Is it safe to pay online?",
        answer:
          "Yes. Checkout runs over encrypted, established payment channels — the same infrastructure your bank already uses — and your card details are not ours to keep.",
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    items: [
      {
        id: "genuine",
        question: "Are the products genuine?",
        answer:
          "Yes. Everything we list is sourced through official channels. We do not carry grey-market stock, and we do not sell refurbished units as new.",
      },
      {
        id: "official-product",
        question: 'What does "Official Product" mean?',
        answer:
          "That the unit reaching you is the one the manufacturer intended for this market, rather than an import meant for somewhere else. It is the difference between a device that is supported here and one that is not.",
      },
      {
        id: "refurbished",
        question: "Do you sell refurbished devices?",
        answer:
          "Refurbished phones have their own category and are labelled as refurbished wherever they appear. What we will never do is sell a refurbished unit as a new one.",
      },
      {
        id: "warranty",
        question: "What warranty do products come with?",
        answer: `Warranty is set by the manufacturer and differs by brand and by product, so there is no single answer we could give honestly. If warranty matters to your decision, ask us on ${site.phone} before you buy and we will tell you what applies to that specific product.`,
      },
      {
        id: "out-of-stock",
        question: "What if something is out of stock?",
        answer: `Availability moves, especially on new releases. Email ${site.email} with the model you are after and we will tell you whether it is coming back.`,
      },
    ],
  },
  {
    id: "exchange",
    title: "Exchange and returns",
    items: [
      {
        id: "exchange",
        question: "Can I trade in my current device?",
        answer:
          "Exchange is available on eligible products. The value of the device you trade in comes off the price of the new one.",
      },
      {
        id: "exchange-value",
        question: "How is the trade-in value decided?",
        answer: `It depends on the model and the condition it is in, so it is assessed per device rather than from a fixed table. Call ${site.phone} with what you are carrying and we will talk you through it.`,
      },
      {
        id: "returns",
        question: "Can I return something?",
        answer: `Contact us on ${site.phone} as soon as you can and tell us what the problem is. What is possible depends on the product and its condition, and we would rather sort it out with you directly than point you at a clause.`,
      },
      {
        id: "damaged",
        question: "What if my order arrives damaged or incorrect?",
        answer: `Tell us straight away — ${site.phone}, or ${site.email} with a photo if you can take one. Something arriving wrong is our problem to fix, not yours to absorb.`,
      },
    ],
  },
  {
    id: "help",
    title: "Help and contact",
    items: [
      {
        id: "contact",
        question: "How do I get in touch?",
        answer: `Call ${site.phone} or email ${site.email}. A short conversation beats a returned parcel, so please use them before ordering if anything is unclear.`,
      },
      {
        id: "since",
        question: `How long has ${site.name} been trading?`,
        answer: `We started in ${site.since}. We are new, and we would rather earn the benefit of the doubt than assume it.`,
      },
    ],
  },
];

export const faqPath = "/faq";

/** Flat view for search, JSON-LD and id lookups. */
export const faqItems: FaqItem[] = faqGroups.flatMap((group) => group.items);

/** The handful the About page repeats out of the full set. */
const featuredIds = ["showroom", "delivery-where", "genuine", "emi", "exchange"];

export const featuredFaqs: FaqItem[] = featuredIds.map((id) => {
  const item = faqItems.find((faq) => faq.id === id);
  // Throwing here fails the build rather than silently dropping a question.
  if (!item) throw new Error(`featuredFaqs: no FAQ with id "${id}"`);
  return item;
});
