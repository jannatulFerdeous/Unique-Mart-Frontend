import { ProductRail } from "@/common/components/ProductRail";
import { SectionHeader } from "@/common/components/SectionHeader";
import type { Product } from "@/shared/config/catalog";
import { home_data } from "../config/constants";

export function CasesAndProtectors({ products }: { products: Product[] }) {
  const { title, href } = home_data.casesAndProtectors;
  if (!products.length) return null;

  return (
    <section aria-labelledby="cases-and-protectors-heading" className="pt-5">
      <div className="container-page">
        <SectionHeader
          id="cases-and-protectors-heading"
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
