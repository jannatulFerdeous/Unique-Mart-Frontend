"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductRail } from "@/common/components/ProductRail";
import { SectionHeader } from "@/common/components/SectionHeader";
import { cn } from "@/shared/utils/cn";
import { home_data } from "../config/constants";

export function ShopByBrands() {
  const { title, href, items } = home_data.brands;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const brand = items[active];

  // The strip hides its scrollbar, so without these chevrons a mouse user gets
  // no hint that the tabs past the fold exist. It overflows from ~1200 down.
  const sync = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  // No scroll snapping here, so the browser's own smooth scroll is enough —
  // unlike ProductRail, where snap fights it.
  const page = (direction: 1 | -1) => {
    const el = strip.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const select = (index: number) => {
    const next = (index + items.length) % items.length;
    setActive(next);
    // focus() also scrolls the tab into view, which keeps arrow-key
    // navigation working once the strip overflows.
    tabs.current[next]?.focus();
  };

  // The tabs pattern moves selection with the arrow keys, not with Tab: only
  // the active tab is tabbable, so the strip is one stop on the way to the rail.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    select(active + step);
  };

  return (
    <section aria-labelledby="brands-heading" className="pt-7">
      <div className="container-page">
        <SectionHeader id="brands-heading" title={title} href={href} />

        <div className="mt-5 flex items-center gap-1 border-b border-line-strong">
          <button
            type="button"
            onClick={() => page(-1)}
            hidden={atStart}
            aria-label={`Scroll ${title} left`}
            className="shrink-0 self-stretch px-0.5 text-ink-muted transition-colors hover:text-ink"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>

          <div
            ref={strip}
            onScroll={sync}
            role="tablist"
            aria-label={title}
            className="no-scrollbar flex min-w-0 flex-1 gap-6 overflow-x-auto"
          >
            {items.map((item, index) => {
              const isActive = index === active;

              return (
                <button
                  key={item.key}
                  ref={(node) => {
                    tabs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`brand-tab-${item.key}`}
                  aria-selected={isActive}
                  aria-controls="brand-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={onKeyDown}
                  className={cn(
                    // relative matters: the sr-only label below is absolutely
                    // positioned, and without a positioned ancestor its
                    // containing block is the page, so it escapes the strip's
                    // overflow clip and drags the whole document sideways.
                    "relative flex h-12 w-24 shrink-0 items-center justify-center border-b-[3px] px-1 transition-opacity",
                    isActive
                      ? "border-ink"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={item.logo}
                    alt=""
                    className="max-h-11 w-full object-contain"
                  />
                  <span className="sr-only">{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => page(1)}
            hidden={atEnd}
            aria-label={`Scroll ${title} right`}
            className="shrink-0 self-stretch px-0.5 text-ink-muted transition-colors hover:text-ink"
          >
            <ChevronRight className="size-6" aria-hidden />
          </button>
        </div>

        <div
          id="brand-panel"
          role="tabpanel"
          aria-labelledby={`brand-tab-${brand.key}`}
          className="mt-6"
        >
          {/* key remounts the rail, so switching brands resets its scroll
              position and its arrows instead of stranding them mid-track. */}
          <ProductRail
            key={brand.key}
            products={brand.products}
            label={brand.label}
          />
        </div>
      </div>
    </section>
  );
}
