import { brandMarks, brandsPath } from "@/shared/config/brands";
import { faqPath, featuredFaqs } from "@/shared/config/faq";
import { rootCategories } from "@/shared/config/categories";
import { mailHref, site, telHref } from "@/shared/config/site";
import { trustClaims } from "@/shared/config/trust";
import type { AboutData } from "./types";

export const about_data: AboutData = {
  title: `About ${site.name}`,
  metaTitle: "About Us",

  lede: `${site.name} is an online technology store in Bangladesh. We started in ${site.since} with one aim: make buying a phone, a laptop, or the cable that goes with it straightforward — and stand behind every one of them.`,

  story: {
    title: "Why we started",
    paragraphs: [
      "Technology has folded itself into every part of the day — the phone that wakes you up, the laptop you work on, the earbuds on the commute. Buying it, though, is rarely as simple as it should be: stock of uncertain origin, terms that shift between conversations, and a price that depends on who you ask.",
      `${site.name} is built the other way round. We sell online only. There is no showroom to find and no floor staff working to a target — one catalogue, one price, delivered anywhere in the country. What the product page says is what arrives.`,
      `The catalogue spans ${rootCategories.length} categories and ${brandMarks.length} brands, from phones, Macs and tablets through to audio, wearables, cameras, networking gear and the accessories that keep all of it running.`,
    ],
  },

  why: {
    title: `Why shop with ${site.name}`,
    intro:
      "Six promises, and we would rather explain them than list them. Each one holds on every order, not just the ones on offer.",
    claims: trustClaims,
  },

  commitment: {
    title: "Our commitment",
    paragraphs: [
      "Clear information, genuine products, and an answer when you need one. We would rather talk you out of the wrong purchase than process the return a week later.",
      "We are new, and we would rather earn the benefit of the doubt than assume it. As the catalogue grows the standard does not move: if we cannot source something properly, we do not list it.",
    ],
  },

  faq: {
    title: "Frequently asked questions",
    items: featuredFaqs,
    linkLabel: "See all questions",
    href: faqPath,
  },

  contact: {
    title: "Still deciding?",
    body: "A short conversation beats a returned parcel. Tell us what you are trying to do and we will point you at the right thing — or tell you honestly that we do not stock it.",
    actions: [
      { label: `Call ${site.phone}`, href: telHref, primary: true },
      { label: site.email, href: mailHref },
      { label: "Browse brands", href: brandsPath },
    ],
  },
};
