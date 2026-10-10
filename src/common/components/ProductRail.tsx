"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/shared/config/catalog";
import { cn } from "@/shared/utils/cn";
import { ProductCard } from "./ProductCard";

type ProductRailProps = {
  products: Product[];
  label: string;
};

const ARROW =
  "absolute top-1/2 z-10 grid size-9.5 -translate-y-1/2 place-items-center rounded-control border border-line-strong bg-surface text-ink shadow-card transition-colors hover:bg-surface-muted";

const SLIDE_MS = 450;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export function ProductRail({ products, label }: ProductRailProps) {
  const track = useRef<HTMLUListElement>(null);
  const slide = useRef(0);
  const syncFrame = useRef(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const read = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  const sync = useCallback(() => {
    if (syncFrame.current) return;
    syncFrame.current = requestAnimationFrame(() => {
      syncFrame.current = 0;
      read();
    });
  }, [read]);

  const stop = useCallback(() => {
    if (!slide.current) return;
    cancelAnimationFrame(slide.current);
    slide.current = 0;
    track.current?.style.removeProperty("scroll-snap-type");
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(syncFrame.current);
      stop();
    };
  }, [read, stop]);

  const page = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    stop();

    const origin = el.getBoundingClientRect().left - el.scrollLeft;
    const edges = Array.from(
      el.children,
      (card) => card.getBoundingClientRect().left - origin,
    );
    const from = el.scrollLeft;
    const next =
      direction === 1
        ? edges.find((edge) => edge > from + 1)
        : edges.findLast((edge) => edge < from - 1);
    const to = Math.max(
      0,
      Math.min(el.scrollWidth - el.clientWidth, next ?? from),
    );
    const distance = to - from;
    if (!distance) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollLeft = to;
      return;
    }

    el.style.scrollSnapType = "none";
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / SLIDE_MS);
      el.scrollLeft = from + distance * easeOutCubic(progress);
      if (progress < 1) {
        slide.current = requestAnimationFrame(step);
        return;
      }
      slide.current = 0;
      el.style.removeProperty("scroll-snap-type");
    };
    slide.current = requestAnimationFrame(step);
  };

  return (
    <div className="relative">
      <ul
        ref={track}
        onScroll={sync}
        onPointerDown={stop}
        onWheel={stop}
        className="no-scrollbar flex snap-x snap-proximity gap-2 overflow-x-auto min-[500px]:gap-3"
      >
        {products.map((product) => (
          <li
            key={product.slug}
            className="w-[calc((100%-0.5rem)/2)] shrink-0 snap-start min-[500px]:w-[calc((100%-0.75rem)/2)] min-[800px]:w-[calc((100%-1.5rem)/3)] min-[1200px]:w-[calc((100%-3rem)/5)]"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => page(-1)}
        hidden={atStart}
        aria-label={`Scroll ${label} left`}
        className={cn(ARROW, "left-0")}
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>

      <button
        type="button"
        onClick={() => page(1)}
        hidden={atEnd}
        aria-label={`Scroll ${label} right`}
        className={cn(ARROW, "right-0")}
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}
