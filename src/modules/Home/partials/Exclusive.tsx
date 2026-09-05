import { ProductRail } from "@/common/components/ProductRail";
import { SectionHeader } from "@/common/components/SectionHeader";
import { home_data } from "../config/constants";

export function Exclusive() {
  const { title, href, products } = home_data.exclusive;

  return (
    <section aria-labelledby="exclusive-heading" className="pt-5">
      <div className="container-page">
        <SectionHeader id="exclusive-heading" title={title} href={href} />

        <div className="mt-9">
          <ProductRail products={products} label={title} />
        </div>
      </div>
    </section>
  );
}
