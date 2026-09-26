import Image from "next/image";
import Link from "next/link";
import type { PromoBanner } from "../config/types";
import { home_data } from "../config/constants";

export function PromoBanners() {
  const { brands, offers } = home_data.promos;

  return (
    <section aria-labelledby="promos-heading" className="pt-5">
      <div className="container-page">
        <h2 id="promos-heading" className="sr-only">
          Brand highlights and offers
        </h2>

        <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {brands.map((banner) => (
            <Tile
              key={banner.href}
              banner={banner}
              className="aspect-square"
              sizes="(min-width: 1024px) 21vw, 47vw"
            />
          ))}
        </ul>

        <ul className="mt-4 grid gap-2.5 md:grid-cols-2">
          {offers.map((banner) => (
            <Tile
              key={banner.href}
              banner={banner}
              className="aspect-655/343"
              sizes="(min-width: 768px) 43vw, 95vw"
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

type TileProps = {
  banner: PromoBanner;
  className: string;
  sizes: string;
};

function Tile({ banner, className, sizes }: TileProps) {
  return (
    <li>
      <Link href={banner.href} className="block">
        <Image
          src={banner.image}
          alt={banner.alt}
          sizes={sizes}
          className={`w-full object-cover ${className}`}
        />
      </Link>
    </li>
  );
}
