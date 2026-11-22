import type { ComponentType, SVGProps } from "react";
import { FacebookIcon } from "@/common/components/icons/FacebookIcon";
import { InstagramIcon } from "@/common/components/icons/InstagramIcon";
import { TiktokIcon } from "@/common/components/icons/TiktokIcon";
import { brandsPath } from "./brands";
import { faqPath } from "./faq";
import { legalPaths } from "./legal";
import type { NavItem } from "./navigation";

export type FooterColumn = {
  title: string;
  items: NavItem[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    items: [
      { label: "Our Brands", href: brandsPath },
      { label: "Careers", href: "/careers" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "FAQ", href: faqPath },
      { label: "Contact & Store", href: "/store-locator" },
    ],
  },
  {
    title: "Policy",
    items: [
      { label: "Terms & Conditions", href: legalPaths.terms },
      { label: "Return & Refund Policy", href: legalPaths.refund },
      { label: "Privacy Policy", href: legalPaths.privacy },
      { label: "Cookie Policy", href: legalPaths.cookies },
    ],
  },
];

export type SocialLink = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "https://www.facebook.com/uniqeesmart", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/uniqsmartbd", Icon: InstagramIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@uniquesmart.bd", Icon: TiktokIcon },
];
