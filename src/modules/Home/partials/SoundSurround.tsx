import { ProductRail } from "@/common/components/ProductRail";
import { SectionHeader } from "@/common/components/SectionHeader";
import { home_data } from "../config/constants";

export function SoundSurround() {
  const { title, href, products } = home_data.soundSurround;

  return (
    <section aria-labelledby="sound-surround-heading" className="pt-5">
      <div className="container-page">
        {/* Left-aligned, like every rail after Exclusive. */}
        <SectionHeader
          id="sound-surround-heading"
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
