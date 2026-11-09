import type { Metadata } from "next";
import { Prose, cookiePage } from "@/modules/Legal";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What Unique & Smart stores in your browser, and how to clear it.",
};

export default function Page() {
  return <Prose page={cookiePage} />;
}
