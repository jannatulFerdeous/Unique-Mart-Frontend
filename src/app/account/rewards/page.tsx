import type { Metadata } from "next";
import { UnavailableScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Reward Points" };

export default function AccountRewardsPage() {
  return <UnavailableScreen href="/account/rewards" />;
}
