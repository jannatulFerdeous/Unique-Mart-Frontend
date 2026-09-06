"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brandHref } from "@/shared/config/brands";
import { brands_data } from "../config/constants";

export function BrandDirectory() {
  const { title, intro, items, search, empty } = brands_data;
  const [query, setQuery] = useState("");
  const inputId = useId();

  // The reference debounces this into a `?search=` API call. We hold all 36
  // marks already, so the filter is local and instant — no request, no spinner.
  // Slug as well as label, so a hyphenated guess ("harman-kardon") still hits.
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? items.filter(
        (brand) =>
          brand.label.toLowerCase().includes(needle) ||
          brand.slug.includes(needle),
      )
    : items;

  return (
    <section aria-labelledby="brands-heading" className="pt-10 pb-12 md:pt-14">
      <div className="container-page">
        {/* Heading and standfirst on the left, the search on the right of the
            same row from md up; stacked below it. */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="min-w-0">
            {/* font-sans because the base layer paints h1–h6 in
                --font-display. */}
            <h1
              id="brands-heading"
              className="font-sans font-bold text-ink"
            >
              {title}
            </h1>

            <p className="mt-2 text-ink-muted">{intro}</p>
          </div>

          <div className="w-full shrink-0 md:w-72 lg:w-96 xl:w-125">
            <label htmlFor={inputId} className="sr-only">
              {search.label}
            </label>
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={search.placeholder}
              autoComplete="off"
              className="w-full rounded-control border border-line-strong bg-surface p-2 text-base text-ink placeholder:text-ink-subtle"
            />
          </div>
        </div>

        {/* The grid changes under a screen reader with no visible cue, so the
            result count is announced instead. */}
        <p role="status" className="sr-only">
          {matches.length} of {items.length} brands shown
        </p>

        {matches.length > 0 ? (
          // 36 divides by 2, 3, 4 and 6, so no step leaves a short last row.
          // Six at xl rather than the reference's five, which strands one card
          // alone on a ninth row.
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {matches.map((brand) => (
              <li key={brand.slug}>
                <Link
                  href={brandHref(brand.slug)}
                  className="flex h-full flex-col items-center bg-surface p-4 transition-shadow hover:shadow-card"
                >
                  {/* fill, not a flow image: the logos have assorted intrinsic
                      ratios and a tall one would grow the whole grid row. */}
                  <div className="relative size-24 md:size-28 lg:size-32">
                    <Image
                      src={brand.logo}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 128px, (min-width: 768px) 112px, 96px"
                      className="object-contain"
                    />
                  </div>

                  {/* The link's accessible name, so the logo stays decorative. */}
                  <span className="mt-2 text-center text-sm font-bold text-ink md:mt-4">
                    {brand.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-14 text-center text-ink-muted">{empty}</p>
        )}
      </div>
    </section>
  );
}
