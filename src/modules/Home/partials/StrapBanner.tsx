import { getImageProps } from "next/image";
import Link from "next/link";
import { home_data } from "../config/constants";

export function StrapBanner() {
  const { href, alt, desktop, mobile } = home_data.promos.straps;

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ alt, src: desktop, sizes: "85vw" });

  const { props: img } = getImageProps({ alt, src: mobile, sizes: "95vw" });

  return (
    <section className="pt-5">
      <div className="container-page">
        <Link href={href} className="block">
          <picture className="block">
            <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
            <img
              {...img}
              alt={img.alt ?? ""}
              className="aspect-655/343 w-full object-cover md:aspect-4/1"
            />
          </picture>
        </Link>
      </div>
    </section>
  );
}
