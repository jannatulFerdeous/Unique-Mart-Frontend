import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categoryPath } from "@/shared/config/categories";
import { cn } from "@/shared/utils/cn";
import { formatPrice } from "@/shared/utils/price";
import { category_data } from "../config/constants";

type Props = {
  name: string;
  trail: { slug: string; name: string }[];
  /** Lowest price in the category, or null when it holds nothing. */
  from: number | null;
  /** Sub-categories with stock, shown as the chip row the reference has. */
  links: { slug: string; name: string }[];
  activeSlug: string;
};

export function CategoryIntro({ name, trail, from, links, activeSlug }: Props) {
  const { headingTemplate, summaryRange, summaryOne, summaryEmpty, browseLabel } =
    category_data;

  const summary =
    from === null
      ? summaryEmpty
      : summaryRange
          .replace("{name}", name)
          .replace("{from}", formatPrice(from));

  return (
    <section className="pt-6">
      <div className="container-page">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
            <li className="flex items-center gap-1">
              <Link
                href="/"
                className="text-ink-muted transition-colors hover:text-tertiary"
              >
                Home
              </Link>
              <ChevronRight aria-hidden className="size-4 text-ink-subtle" />
            </li>
            {trail.map((crumb) => (
              <li key={crumb.slug} className="flex items-center gap-1">
                <Link
                  href={categoryPath(crumb.slug)}
                  className="text-ink-muted transition-colors hover:text-tertiary"
                >
                  {crumb.name}
                </Link>
                <ChevronRight aria-hidden className="size-4 text-ink-subtle" />
              </li>
            ))}
            <li>
              <span aria-current="page" className="text-tertiary">
                {name}
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="mt-4 font-sans font-bold text-tertiary">
          {headingTemplate.replace("{name}", name)}
        </h1>

        <p className="mt-2 max-w-3xl text-ink-muted">
          {from !== null && links.length === 0
            ? summaryOne.replace("{name}", name)
            : summary}
        </p>

        {links.length > 0 && (
          <nav aria-label={browseLabel} className="mt-4">
            <ul className="flex flex-wrap gap-2">
              {links.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={categoryPath(link.slug)}
                    aria-current={link.slug === activeSlug ? "page" : undefined}
                    className={cn(
                      "block rounded-control border px-3 py-1.5 text-sm transition-colors",
                      link.slug === activeSlug
                        ? "border-tertiary bg-tertiary-soft font-medium text-tertiary"
                        : "border-line bg-surface text-ink-muted hover:border-tertiary hover:text-tertiary",
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
