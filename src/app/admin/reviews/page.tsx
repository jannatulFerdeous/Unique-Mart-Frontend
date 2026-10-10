import type { Metadata } from "next";
import { ReviewsScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Reviews" };

export default function AdminReviewsPage() {
  return <ReviewsScreen />;
}
