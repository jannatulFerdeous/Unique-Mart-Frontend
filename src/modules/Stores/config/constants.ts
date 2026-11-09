import { deliveryChargeSummary } from "@/shared/config/shipping";
import { site } from "@/shared/config/site";

export type Store = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  mapUrl?: string;
};

export const stores_data = {
  title: "Store Locator",
  heading: "Where to find us",
  intro: `Visit our shop in Gangachara, Rangpur, or order online and we will deliver anywhere in Bangladesh.`,

  stores: [
    {
      name: site.name,
      address: site.address,
      hours: site.hours,
      phone: site.phone,
      mapUrl: site.mapUrl,
    },
  ] as Store[],
  mapLabel: "Open in Google Maps",

  // Shown only when the store list is empty.
  onlineTitle: "We are an online shop",
  onlineBody:
    "There is no shop to visit. Every order is placed on this site and delivered to your door.",

  deliveryTitle: "Delivery",
  delivery: [
    {
      title: "Where we deliver",
      body: "Anywhere in Bangladesh, through our courier partners.",
    },
    {
      title: "Delivery charge",
      body: `${deliveryChargeSummary[0]?.toUpperCase()}${deliveryChargeSummary.slice(1)}. Checkout shows the charge before you place your order.`,
    },
    {
      title: "How you pay",
      body: "Pay online through SSLCOMMERZ, or cash on delivery when your order arrives.",
    },
  ],

  reachTitle: "Talk to us",
  phoneHours: site.hours,
  emailNote: "We answer within one working day",
} as const;
