"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/common/components/ProductCard";
import { facetGroups } from "@/shared/config/facets";
import { cn } from "@/shared/utils/cn";
import { category_data } from "../config/constants";
import type { FacetGroupView, FacetOption, ListingProduct, SortId } from "../config/types";
import { CategoryFilters } from "./CategoryFilters";

type Props = {
  name: string;
  items: ListingProduct[];
  /** Direct children that hold stock, in tree order, for the Category group. */
  childLabels: { value: string; label: string }[];
};

const EMPTY: Record<string, string[]> = {};

/** Brand and sub-category live on the product, not in the spec sheet, so they
 *  are matched here rather than through `facets`. */
const own = (item: ListingProduct, id: string): string[] => {
  if (id === "brand") return item.product.brand ? [item.product.brand] : [];
  if (id === "child") return item.child ? [item.child] : [];
  return item.facets[id] ?? [];
};

export function CategoryBrowser({ name, items, childLabels }: Props) {
  const {
    sorts, sortLabel, itemsOne, itemsMany, noMatch, clearAll,
    pageSize, previous, next, filtersToggle, groups: labels,
  } = category_data;

  const bounds = useMemo(() => {
    const prices = items.map((item) => item.product.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [items]);

  const [price, setPrice] = useState(bounds);
  const [selected, setSelected] = useState<Record<string, string[]>>(EMPTY);
  const [sort, setSort] = useState<SortId>("featured");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const dirty =
    price.min !== bounds.min ||
    price.max !== bounds.max ||
    Object.values(selected).some((values) => values.length > 0);

  const clear = () => {
    setPrice(bounds);
    setSelected(EMPTY);
    setPage(1);
  };

  const toggle = (group: string, value: string) => {
    setSelected((prev) => {
      const current = prev[group] ?? [];
      return {
        ...prev,
        [group]: current.includes(value)
          ? current.filter((each) => each !== value)
          : [...current, value],
      };
    });
    setPage(1);
  };

  /* Counts describe the whole category rather than the current selection, so a
     box never reads (0) just because a different box is ticked. */
  const count = (id: string, value: string) =>
    items.filter((item) => own(item, id).includes(value)).length;

  const brands: FacetOption[] = useMemo(() => {
    const names = new Set(
      items.map((item) => item.product.brand).filter((brand): brand is string => !!brand),
    );
    return [...names]
      .map((value) => ({ value, label: value, count: count("brand", value) }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const subCategories: FacetOption[] = useMemo(
    () =>
      childLabels
        .map(({ value, label }) => ({ value, label, count: count("child", value) }))
        .filter((option) => option.count > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childLabels, items],
  );

  /* In most phone and speaker sections the sub-categories *are* the brands, so
     showing both repeats the same checkboxes twice. Where they largely
     coincide, Category wins: it is the more precise of the two, and it catches
     products whose `brand` is deliberately unset. */
  const brandsAreCategories = useMemo(() => {
    if (subCategories.length < 2 || brands.length === 0) return false;
    const names = new Set(subCategories.map((each) => each.label.toLowerCase()));
    return (
      brands.filter((each) => names.has(each.label.toLowerCase())).length /
        brands.length >=
      0.6
    );
  }, [brands, subCategories]);

  /* The sidebar, in the reference's order: availability, brand, category, then
     every spec-derived group these products actually record. A group with
     fewer than two live values would filter nothing, so it is left out. */
  const groups: FacetGroupView[] = useMemo(() => {
    const built: FacetGroupView[] = [];

    for (const group of facetGroups) {
      const options = group.values
        .map((value) => ({ value, label: value, count: count(group.id, value) }))
        .filter((option) => option.count > 0);

      if (options.length > 1) built.push({ ...group, options });

      // Brand and Category follow Availability, as on the reference.
      if (group.id === "availability") {
        if (!brandsAreCategories && brands.length > 1) {
          built.push({ id: "brand", label: labels.brand, options: brands });
        }
        if (subCategories.length > 1) {
          built.push({ id: "child", label: labels.category, options: subCategories });
        }
      }
    }

    return built;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, brands, subCategories, brandsAreCategories, labels]);

  const live = useMemo(() => new Set(groups.map((group) => group.id)), [groups]);

  const filtered = useMemo(() => {
    const matched = items.filter((item) => {
      if (item.product.price < price.min || item.product.price > price.max) {
        return false;
      }

      // A hidden group must not keep filtering by a value that is no longer
      // on screen — Brand disappears on phone sections, for instance.
      for (const [id, values] of Object.entries(selected)) {
        if (!values.length || !live.has(id)) continue;
        const mine = own(item, id);
        if (!values.some((value) => mine.includes(value))) return false;
      }

      return true;
    });

    const sorted = [...matched];
    if (sort === "price-asc") sorted.sort((a, b) => a.product.price - b.product.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.product.price - a.product.price);
    if (sort === "name") sorted.sort((a, b) => a.product.name.localeCompare(b.product.name));
    return sorted;
  }, [items, price, selected, sort, live]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);

  const sidebar = (
    <CategoryFilters
      bounds={bounds}
      price={price}
      onPrice={(nextPrice) => {
        setPrice(nextPrice);
        setPage(1);
      }}
      groups={groups}
      selected={selected}
      onToggle={toggle}
      dirty={dirty}
      onClear={clear}
    />
  );

  return (
    <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      {/* Sidebar from lg; a sheet below it, because a 260px rail beside a 2-up
          grid leaves the cards unreadable.

          Not sticky and not its own scroller: with ten groups the column is
          taller than the viewport, so sticking it pinned the bottom groups out
          of reach and an inner scrollbar put a second scroll gesture next to
          the page's own. It scrolls with the page instead. */}
      <aside className="hidden lg:block">{sidebar}</aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-ink-muted">
            {filtered.length === 1
              ? itemsOne.replace("{name}", name)
              : itemsMany.replace("{n}", String(filtered.length)).replace("{name}", name)}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-control border border-line px-3 py-2 font-medium text-ink transition-colors hover:border-line-strong lg:hidden"
            >
              <SlidersHorizontal aria-hidden className="size-4" />
              {filtersToggle}
            </button>

            <label className="flex items-center gap-2 text-ink-muted">
              <span className="shrink-0">{sortLabel}</span>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as SortId);
                  setPage(1);
                }}
                className="rounded-control border border-line-strong bg-surface p-2 text-ink"
              >
                {sorts.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-ink-muted">{noMatch}</p>
            <button
              type="button"
              onClick={clear}
              className="mt-3 font-medium text-tertiary underline decoration-tertiary/40 underline-offset-4 transition-colors hover:decoration-tertiary"
            >
              {clearAll}
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((item) => (
              <li key={item.product.slug} className="h-full">
                <ProductCard product={item.product} />
              </li>
            ))}
          </ul>
        )}

        {pages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => setPage(current - 1)}
              disabled={current === 1}
              className="rounded-control border border-line px-4 py-2 font-medium text-ink-muted transition-colors hover:border-line-strong disabled:opacity-40"
            >
              {previous}
            </button>

            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                aria-current={number === current ? "page" : undefined}
                className={cn(
                  "min-w-10 rounded-control border px-3 py-2 font-medium transition-colors tabular-nums",
                  number === current
                    ? "border-tertiary bg-tertiary text-tertiary-contrast"
                    : "border-line text-ink-muted hover:border-line-strong",
                )}
              >
                {number}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage(current + 1)}
              disabled={current === pages}
              className="rounded-control border border-line px-4 py-2 font-medium text-ink-muted transition-colors hover:border-line-strong disabled:opacity-40"
            >
              {next}
            </button>
          </nav>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-inverse-deep/50"
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-surface p-5">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="rounded-control p-1 text-ink-muted transition-colors hover:text-ink"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}
