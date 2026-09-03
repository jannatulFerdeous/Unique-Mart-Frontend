import type { ComponentType, SVGProps } from "react";
import { FacebookIcon } from "@/common/components/icons/FacebookIcon";
import { InstagramIcon } from "@/common/components/icons/InstagramIcon";
import { LinkedinIcon } from "@/common/components/icons/LinkedinIcon";
import { YoutubeIcon } from "@/common/components/icons/YoutubeIcon";
import type { NavItem } from "./navigation";

export type FooterColumn = {
  title: string;
  items: NavItem[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    items: [
      { label: "Our Brands", href: "/brands" },
      { label: "Careers", href: "/careers" },
      { label: "Blogs", href: "/blogs" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "FAQ", href: "/faq" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Loyalty Program", href: "/loyalty" },
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
  { label: "Facebook", href: "https://facebook.com/uniquemart", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com/uniquemart", Icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com/@uniquemart", Icon: YoutubeIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/uniquemart", Icon: LinkedinIcon },
];
