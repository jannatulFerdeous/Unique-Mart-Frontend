import type { Metadata } from "next";
import { Prose, refundPage } from "@/modules/Legal";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "How returns, refunds and cancellations work at Unique & Smart, and how long a refund takes.",
};

export default function Page() {
  return <Prose page={refundPage} />;
}
