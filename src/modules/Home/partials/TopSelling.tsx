import { ProductRail } from "@/common/components/ProductRail";
import { SectionHeader } from "@/common/components/SectionHeader";
import type { Product } from "@/shared/config/catalog";
import { home_data } from "../config/constants";

export function TopSelling({ products }: { products: Product[] }) {
  const { title, href } = home_data.topSelling;
  if (!products.length) return null;

  return (
    <section aria-labelledby="top-selling-heading" className="pt-5">
      <div className="container-page">
        <SectionHeader
          id="top-selling-heading"
          title={title}
          href={href}
          align="left"
        />

        <div className="mt-9">
          <ProductRail products={products} label={title} />
        </div>
      </div>
    </section>
  );
}
