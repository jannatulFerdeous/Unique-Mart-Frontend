import Image from "next/image";
import Link from "next/link";
import { home_data } from "../config/constants";

export function BrandWall() {
  const { title, brands } = home_data.brandWall;
  const [first, second] = title.split(" ");

  return (
    <section aria-labelledby="brand-wall-heading" className="pt-5">
      <div className="container-page">
        {/* The reference ships this whole panel as one flat 1320×330 image, which
            scales to 304px on a phone and is unreadable. Rebuilt as markup: real
            text, one logo per link, and a grid that reflows. */}
        <div className="grid gap-8 bg-surface-muted px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,34%)_1fr] lg:items-center lg:gap-10 lg:px-12">
          <div>
            {/* font-sans because the base layer paints h1–h6 in --font-display. */}
            <h2
              id="brand-wall-heading"
              className="font-sans text-3xl leading-[1.1] font-light tracking-[0.06em] uppercase text-ink-subtle sm:text-4xl lg:text-5xl"
            >
              {first}
              <span className="block text-[1.3em]">{second}</span>
            </h2>

            <hr className="mt-6 border-line-strong" />
          </div>

          {/* 36 divides by 3, 4, 6 and 9, so no step leaves a short last row.
              Nine columns wait for xl: at lg they share the row with the heading
              and each tile is only 45px wide, too small to read a wordmark. */}
          <ul className="grid grid-cols-3 gap-2 min-[500px]:grid-cols-4 md:grid-cols-6 xl:grid-cols-9">
            {brands.map((brand) => (
              <li key={brand.slug}>
                {/* fill, not a flow image: the logos have assorted intrinsic
                    ratios, and a flow image tall enough to beat the card grows
                    the whole grid row — Meta's wordmark did exactly that. */}
                <Link
                  href={`/brands/${brand.slug}`}
                  className="relative block aspect-3/2 bg-surface transition-shadow hover:shadow-card"
                >
                  <Image
                    src={brand.logo}
                    alt={brand.label}
                    fill
                    sizes="(min-width: 1024px) 8vw, (min-width: 768px) 15vw, 24vw"
                    className="object-contain p-2"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
