import { deliveryChargeSummary } from "./shipping";
import { site } from "./site";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqGroup = {
  id: string;
  title: string;
  items: FaqItem[];
};

export const faqGroups: FaqGroup[] = [
  {
    id: "ordering",
    title: "Ordering",
    items: [
      {
        id: "how-to-order",
        question: "How do I place an order?",
        answer:
          "Find what you want in the catalogue, add it to your cart and check out. You need an account to order, and checkout asks for your delivery address and how you want to pay. You can also buy in person at our shop.",
      },
      {
        id: "showroom",
        question: `Does ${site.name} have a shop I can visit?`,
        answer: `Yes. Our shop is at ${site.address}, open ${site.hours.toLowerCase()}. You can see products in person there before buying, or buy on the spot. Online orders have the same prices and are delivered anywhere in Bangladesh.`,
      },
      {
        id: "not-sure-which",
        question: "I am not sure which model I need. Can you help?",
        answer: `Yes, and we would rather you asked. Call ${site.phone} or email ${site.email} with what you are trying to do, and we will point you at the right thing — or tell you honestly that we do not stock it.`,
      },
      {
        id: "change-order",
        question: "Can I change or cancel an order after placing it?",
        answer: `You can cancel an order yourself from your account until it is shipped, as long as it has not been paid online. If you paid online, or want to change something, call ${site.phone} as soon as you can. The sooner you reach us, the more we can do.`,
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
        answer: `Yes: ${deliveryChargeSummary}. Checkout shows the charge for your address before you place the order.`,
      },
      {
        id: "delivery-outside-dhaka",
        question: "Do I need to live near the shop to order?",
        answer:
          "Yes. We deliver anywhere in Bangladesh, and the catalogue and prices are the same wherever you order from.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    items: [
      {
        id: "payment-methods",
        question: "What payment methods can I use?",
        answer:
          "Two ways: pay in full online through SSLCOMMERZ, by card, mobile banking or internet banking, or pay cash on delivery when the order arrives. At our shop you can pay in person.",
      },
      {
        id: "payment-safe",
        question: "Is it safe to pay online?",
        answer:
          "Yes. Online payments go through SSLCOMMERZ over an encrypted connection. You enter your card or mobile banking details on SSLCOMMERZ's page, not ours, so we never see or store them.",
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
        answer: `Call ${site.phone}, email ${site.email}, or visit our shop at ${site.address} (open ${site.hours.toLowerCase()}). A short conversation beats a returned parcel, so please get in touch before ordering if anything is unclear.`,
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

export const faqItems: FaqItem[] = faqGroups.flatMap((group) => group.items);

const featuredIds = ["showroom", "delivery-where", "genuine", "payment-safe", "exchange"];

export const featuredFaqs: FaqItem[] = featuredIds.map((id) => {
  const item = faqItems.find((faq) => faq.id === id);
  if (!item) throw new Error(`featuredFaqs: no FAQ with id "${id}"`);
  return item;
});
