import Image from "next/image";
import Link from "next/link";
import { brandHref } from "@/shared/config/brands";
import { home_data } from "../config/constants";

export function BrandWall() {
  const { title, brands } = home_data.brandWall;
  const [first, second] = title.split(" ");

  return (
    <section aria-labelledby="brand-wall-heading" className="pt-5">
      <div className="container-page">
        <div className="grid gap-8 bg-surface-muted px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,34%)_1fr] lg:items-center lg:gap-10 lg:px-12">
          <div>
            <h2
              id="brand-wall-heading"
              className="font-sans text-3xl leading-[1.1] font-light tracking-[0.06em] uppercase text-ink-subtle sm:text-4xl lg:text-5xl"
            >
              {first}
              <span className="block text-[1.3em]">{second}</span>
            </h2>

            <hr className="mt-6 border-line-strong" />
          </div>

          <ul className="grid grid-cols-3 gap-2 min-[500px]:grid-cols-4 md:grid-cols-6 xl:grid-cols-9">
            {brands.map((brand) => (
              <li key={brand.slug}>
                <Link
                  href={brandHref(brand.slug)}
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
