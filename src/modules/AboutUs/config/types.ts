import type { ContactAction } from "@/common/components/ContactBand";
import type { FaqItem } from "@/shared/config/faq";
import type { TrustClaim } from "@/shared/config/trust";

export type AboutSection = {
  title: string;
  paragraphs: string[];
};

export type AboutData = {
  title: string;
  metaTitle: string;
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
