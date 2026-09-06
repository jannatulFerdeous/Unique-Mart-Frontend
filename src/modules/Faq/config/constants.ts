import { faqGroups, faqItems } from "@/shared/config/faq";
import { mailHref, site, telHref } from "@/shared/config/site";
import type { FaqData } from "./types";

export const faq_data: FaqData = {
  title: "Frequently asked questions",
  metaTitle: "FAQ",

  lede: `${faqItems.length} answers about ordering, delivery, payment and everything after it. If yours is not here, call ${site.phone} — we would rather answer it than have you guess.`,

  search: {
    label: "Search questions",
    placeholder: "Search questions...",
  },

  empty: "No question matches that. Try a different word, or just call us.",

  navLabel: "Jump to a topic",
  expandAll: "Expand all",
  collapseAll: "Collapse all",

  groups: faqGroups,

  contact: {
    title: "Still stuck?",
    body: "Not every question fits in a list. Tell us what you are trying to work out and we will give you a straight answer.",
    actions: [
      { label: `Call ${site.phone}`, href: telHref, primary: true },
      { label: site.email, href: mailHref },
      { label: "About us", href: "/about" },
    ],
  },
};
