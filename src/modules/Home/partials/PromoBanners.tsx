import Image from "next/image";
import Link from "next/link";
import type { PromoBanner } from "../config/types";
import { home_data } from "../config/constants";

export function PromoBanners() {
  const { brands, offers } = home_data.promos;

  return (
    // The reference's banner blocks carry no heading. Ours gets a hidden one so
    // the section still lands in the heading outline beside Exclusive and Top
    // Selling — and so it does not collide with the hero, which already
    // announces itself as "Featured offers".
    <section aria-labelledby="promos-heading" className="pt-5">
      <div className="container-page">
        <h2 id="promos-heading" className="sr-only">
          Brand highlights and offers
        </h2>

        {/* Two-up then four-up. The reference steps through three columns at md,
            which leaves the fourth tile alone on its own row. */}
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

        {/* 16px between the two blocks, 10px within each — the reference's own
            split, which comes from a padding-bottom on the first block. */}
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
  /** The artwork's own ratio, so the cell never letterboxes. */
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
