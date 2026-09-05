import { getImageProps } from "next/image";
import Link from "next/link";
import { home_data } from "../config/constants";

export function StrapBanner() {
  const { href, alt, desktop, mobile } = home_data.promos.straps;

  // Two compositions, not two sizes of one: the reference crops a 4:1 banner for
  // desktop and a 1.9:1 one for phones. `<picture>` art-directs them, and
  // getImageProps keeps the md-and-up <source> on the optimiser — the same
  // pattern the hero uses, and for the same reason. Toggling two <Image>s with
  // `hidden` would download both files.
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
            {/* `alt` is repeated out of the spread only so the jsx-a11y rule
                can see it; the spread already carries it. */}
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
