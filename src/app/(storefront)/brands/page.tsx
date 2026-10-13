import type { Metadata } from "next";
import { Brands, brands_data } from "@/modules/Brands";
import { getCatalog } from "@/shared/api/storefront";
import { toBrandMarks } from "@/shared/libs/storefront/catalog";

export const metadata: Metadata = {
  title: brands_data.title,
  description: brands_data.intro,
};

export default async function BrandsPage() {
  return <Brands items={toBrandMarks(await getCatalog())} />;
}
