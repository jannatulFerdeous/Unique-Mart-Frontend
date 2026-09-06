import type { ContactAction } from "@/common/components/ContactBand";
import type { FaqItem } from "@/shared/config/faq";
import type { TrustClaim } from "@/shared/config/trust";

export type AboutSection = {
  title: string;
  paragraphs: string[];
};

export type AboutData = {
  title: string;
  /** For `<title>`, which the root layout already suffixes with the site name —
   *  the h1's "About Unique Mart" would otherwise say it twice. */
  metaTitle: string;
  /** The one-paragraph standfirst under the h1. */
  lede: string;
  story: AboutSection;
  why: {
    title: string;
    intro: string;
    claims: TrustClaim[];
  };
  commitment: AboutSection;
  faq: {
    title: string;
    /** A subset of the shared set; the rest live on /faq. */
    items: FaqItem[];
    linkLabel: string;
    href: string;
  };
  contact: {
    title: string;
    body: string;
    actions: ContactAction[];
  };
};
