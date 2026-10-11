import type { BrandMark } from "@/shared/libs/storefront/catalog";
import { BrandDirectory } from "./partials/BrandDirectory";

export function Brands({ items }: { items: BrandMark[] }) {
  return <BrandDirectory items={items} />;
}
