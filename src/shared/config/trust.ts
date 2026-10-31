import {
  ArrowRightLeft,
  BadgeCheck,
  PackageCheck,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type TrustClaim = {
  icon: LucideIcon;
  label: string;
  detail: string;
};

export const trustClaims: TrustClaim[] = [
  {
    icon: BadgeCheck,
    label: "100% Authentic",
    detail:
      "Everything we list is sourced through official channels. No grey-market stock, and nothing refurbished sold as new.",
  },
  {
    icon: PackageCheck,
    label: "Official Product",
    detail:
      "The unit that reaches you is the one the manufacturer intended for this market, not an import meant for somewhere else.",
  },
  {
    icon: ArrowRightLeft,
    label: "Exchange",
    detail:
      "Trade in the device you are already carrying on eligible products and put its value straight against the new one.",
  },
  {
    icon: Truck,
    label: "Fastest Delivery",
    detail:
      "Every order ships nationwide, so the same catalogue reaches you wherever in Bangladesh you happen to be.",
  },
  {
    icon: ShieldCheck,
    label: "100% Secure Payment",
    detail:
      "Checkout runs over encrypted, established payment channels, so your details are never handled in the clear.",
  },
];
