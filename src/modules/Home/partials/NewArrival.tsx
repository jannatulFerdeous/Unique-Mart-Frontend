import { ProductRail } from "@/common/components/ProductRail";
import { SectionHeader } from "@/common/components/SectionHeader";
import { home_data } from "../config/constants";

export function NewArrival() {
  const { title, href, products } = home_data.newArrival;

  return (
    <section aria-labelledby="new-arrival-heading" className="pt-5">
      <div className="container-page">
        {/* Left-aligned, like every rail after Exclusive. */}
        <SectionHeader
          id="new-arrival-heading"
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
