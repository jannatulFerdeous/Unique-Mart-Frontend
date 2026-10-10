import type { Metadata } from "next";
import { AboutUs, about_data } from "@/modules/AboutUs";

export const metadata: Metadata = {
  title: about_data.metaTitle,
  description: about_data.lede,
};

export default function AboutPage() {
  return <AboutUs />;
}
