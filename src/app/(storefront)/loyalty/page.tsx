import type { Metadata } from "next";
import { Loyalty } from "@/modules/Loyalty";

export const metadata: Metadata = {
  title: "Loyalty Program",
  description:
    "Earn points on everything you buy at Unique Mart and spend them on your next order. Free to join, with tiers for regular customers.",
};

export default function LoyaltyPage() {
  return <Loyalty />;
}
