import type { Metadata } from "next";
import { Prose, termsPage } from "@/modules/Legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms you agree to by using Unique Mart.",
};

export default function Page() {
  return <Prose page={termsPage} />;
}
