import type { Metadata } from "next";
import { MyReviewsScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "My Reviews" };

export default function AccountReviewsPage() {
  return <MyReviewsScreen />;
}
