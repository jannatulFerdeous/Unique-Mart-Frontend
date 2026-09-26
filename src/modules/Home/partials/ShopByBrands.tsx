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

  const page = (direction: 1 | -1) => {
    const el = strip.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const select = (index: number) => {
    const next = (index + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

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
                    "relative flex h-12 w-24 shrink-0 items-center justify-center border-b-[3px] px-1 transition-opacity",
                    isActive
                      ? "border-tertiary"
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
