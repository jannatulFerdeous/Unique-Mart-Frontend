import type { Metadata } from "next";
import { Prose, privacyPage } from "@/modules/Legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Unique & Smart handles information about you.",
};

export default function Page() {
  return <Prose page={privacyPage} />;
}
