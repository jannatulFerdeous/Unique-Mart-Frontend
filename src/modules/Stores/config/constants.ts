import { site } from "@/shared/config/site";

export type Store = {
  name: string;
  address: string;
  hours: string;
  phone: string;
};

export const stores_data = {
  title: "Store Locator",
  heading: "Where to find us",
  intro: `${site.name} sells online and delivers across Bangladesh. Here is how orders reach you, and how to reach a person.`,

  stores: [] as Store[],

  onlineTitle: "We are an online shop",
  onlineBody:
    "There is no showroom to visit. Every order is placed on this site and delivered to your door, which is how we keep prices where they are. If you want to see a product before buying, call and we will talk you through it properly.",

  delivery: [
    {
      title: "Inside Dhaka",
      body: "Usually next day. Orders placed before 3pm most often go out the same afternoon.",
    },
    {
      title: "Outside Dhaka",
      body: "Two to four working days through our courier partners, anywhere in the country.",
    },
    {
      title: "Delivery charge",
      body: "Tk 120 per order, and free on orders of Tk 50,000 or more.",
    },
  ],

  reachTitle: "Talk to us",
  phoneHours: "Saturday to Thursday, 10am to 8pm",
  emailNote: "We answer within one working day",
} as const;
