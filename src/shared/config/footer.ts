import type { ComponentType, SVGProps } from "react";
import { FacebookIcon } from "@/common/components/icons/FacebookIcon";
import { InstagramIcon } from "@/common/components/icons/InstagramIcon";
import { TiktokIcon } from "@/common/components/icons/TiktokIcon";
import { brandsPath } from "./brands";
import { faqPath } from "./faq";
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
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
  {
    title: "Policy",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
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
