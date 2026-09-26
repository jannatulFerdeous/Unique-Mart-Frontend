import { ProductRail } from "@/common/components/ProductRail";
import { SectionHeader } from "@/common/components/SectionHeader";
import { home_data } from "../config/constants";

export function TopSelling() {
  const { title, href, products } = home_data.topSelling;

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
