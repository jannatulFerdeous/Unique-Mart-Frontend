import Image from "next/image";
import Link from "next/link";
import { home_data } from "../config/constants";

export function FeaturedCategories() {
  const { title, items } = home_data.categories;

  return (
    <section aria-labelledby="categories-heading" className="pt-7">
      <div className="container-page">
        {/* No SectionHeader here: this section has no "Show All" link, so the
            title is centred on the container rather than on the leftover space.
            font-sans because the base layer paints every h1–h6 in --font-display. */}
        <h2
          id="categories-heading"
          className="text-center font-sans font-medium text-ink"
        >
          {title}
        </h2>

        {/* flex-wrap rather than a grid: a short trailing row centres itself,
            which is what the reference's last seven categories do. 15 divides
            by 3 and 5, so those two steps fill their rows exactly; 6 and 8
            leave a short centred row. */}
        <ul className="mt-8 flex flex-wrap justify-center">
          {items.map((category) => (
            <li
              key={category.href}
              className="w-1/3 px-1 pb-6 min-[500px]:w-1/5 md:w-1/6 xl:w-[12.5%]"
            >
              <Link href={category.href} className="group block text-center">
                {/* w-full first, so the circle shrinks with a narrow column
                    instead of overflowing it the way the reference's does. */}
                <span className="mx-auto grid aspect-square w-full max-w-18 place-items-center overflow-hidden rounded-full bg-surface-muted transition-colors group-hover:bg-line min-[500px]:max-w-20 md:max-w-24 lg:max-w-26">
                  <Image
                    src={category.image}
                    alt=""
                    className="size-full object-contain p-4"
                  />
                </span>

                {/* Two lines are reserved whether the label needs them or not,
                    so every circle in a row starts at the same height. */}
                <span className="mt-4 line-clamp-2 block min-h-[calc(2*var(--text-nav--line-height)*var(--text-nav))] text-nav font-bold text-ink">
                  {category.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
