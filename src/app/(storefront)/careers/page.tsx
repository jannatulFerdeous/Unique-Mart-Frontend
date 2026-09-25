import type { Metadata } from "next";
import { Careers } from "@/modules/Careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Open positions and what it is like to work at Unique Mart. We read speculative applications too.",
};

export default function CareersPage() {
  return <Careers />;
}
