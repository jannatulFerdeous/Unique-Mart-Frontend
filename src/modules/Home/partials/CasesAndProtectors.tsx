import { ProductRail } from "@/common/components/ProductRail";
import { SectionHeader } from "@/common/components/SectionHeader";
import { home_data } from "../config/constants";

export function CasesAndProtectors() {
  const { title, href, products } = home_data.casesAndProtectors;

  return (
    <section aria-labelledby="cases-and-protectors-heading" className="pt-5">
      <div className="container-page">
        {/* Left-aligned, like every rail after Exclusive. */}
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
