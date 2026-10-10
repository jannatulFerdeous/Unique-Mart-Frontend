import type { Metadata } from "next";
import { Brands, brands_data } from "@/modules/Brands";

export const metadata: Metadata = {
  title: brands_data.title,
  description: brands_data.intro,
};

export default function BrandsPage() {
  return <Brands />;
}
