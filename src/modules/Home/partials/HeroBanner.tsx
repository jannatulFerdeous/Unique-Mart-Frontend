"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import type { HeroSlide, HeroSlideImage } from "../config/types";

const SWIPE_THRESHOLD = 44;

/** `slides` are read on the server — the portal's uploads, or the built-in set
 *  — so this component never knows which it was handed. */
export function HeroBanner({ slides: source, interval }: { slides: HeroSlide[]; interval: number }) {

  // The two artworks per slide are different compositions, not two sizes of
  // one, so `<picture>` art-directs them. getImageProps keeps the md-and-up
  // <source> on the optimiser — a bare `slide.desktop.src` would ship the
  // original PNG, and one of these is 2MB.
  const slides = useMemo<HeroSlideImage[]>(
    () =>
      source.map((slide, position) => {
        const common = {
          alt: slide.alt,
          loading: position === 0 ? ("eager" as const) : ("lazy" as const),
        };

        // Each variant gets the sizes of the viewport it renders in.
        const {
          props: { srcSet: desktopSrcSet },
        } = getImageProps({ ...common, src: slide.desktop, sizes: "85vw" });

        const { props: img } = getImageProps({
          ...common,
          src: slide.mobile,
          sizes: "100vw",
        });

        return {
          key: slide.id ?? slide.href,
          theme: slide.theme,
          href: slide.href,
          desktopSrcSet: desktopSrcSet ?? "",
          img,
        };
      }),
    [source],
  );

  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const pointerStart = useRef(0);
  const swiped = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Keyed on `index`, so a dot press or a swipe restarts the dwell.
  useEffect(() => {
    if (paused || reduced || count < 2) return;

    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % count),
      interval,
    );
    return () => window.clearTimeout(timer);
  }, [index, paused, reduced, count, interval]);

  // Wraps, so -1 lands on the last slide and `count` on the first.
  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  const onDark = slides[index]?.theme === "dark";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(index + 1);
        if (event.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div className="container-page-bleed">
        <div className="p-2">
          <div
            className="relative aspect-10/7 touch-pan-y overflow-hidden md:aspect-64/19"
            onPointerDown={(event) => {
              pointerStart.current = event.clientX;
              swiped.current = false;
            }}
            onPointerUp={(event) => {
              const distance = event.clientX - pointerStart.current;
              if (Math.abs(distance) < SWIPE_THRESHOLD) return;
              swiped.current = true;
              go(index + (distance < 0 ? 1 : -1));
            }}
            // A swipe that starts on a slide would otherwise follow its link.
            onClickCapture={(event) => {
              if (!swiped.current) return;
              event.preventDefault();
              event.stopPropagation();
              swiped.current = false;
            }}
          >
            <div
              aria-live={paused || reduced ? "polite" : "off"}
              className="flex h-full transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((slide, position) => (
                <div
                  key={slide.key}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${position + 1} of ${count}`}
                  inert={position !== index}
                  className="h-full w-full shrink-0"
                >
                  <Link href={slide.href} className="block h-full w-full" draggable={false}>
                    <picture className="block h-full w-full">
                      <source media="(min-width: 768px)" srcSet={slide.desktopSrcSet} />
                      {/* `alt` is repeated out of the spread only so the
                          jsx-a11y rule can see it. */}
                      <img
                        {...slide.img}
                        alt={slide.img.alt ?? ""}
                        draggable={false}
                        className="h-full w-full rounded-banner object-cover"
                      />
                    </picture>
                  </Link>
                </div>
              ))}
            </div>

            {/* Dots take their contrast from the slide underneath — a black dot
                vanishes on a black banner. */}
            <div className="absolute inset-x-0 bottom-2 flex justify-center">
              {slides.map((slide, position) => (
                <button
                  key={slide.key}
                  type="button"
                  onClick={() => go(position)}
                  aria-label={`Go to slide ${position + 1}`}
                  aria-current={position === index}
                  className={cn(
                    // 24px target, pulled back to the reference's 16px pitch.
                    "-mx-1 grid size-6 cursor-pointer place-items-center",
                    onDark && "focus-visible:outline-ink-inverse",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full transition-colors duration-300",
                      position === index
                        ? onDark
                          ? "bg-ink-inverse"
                          : "bg-ink"
                        : onDark
                          ? "bg-ink-inverse/35"
                          : "bg-ink/20",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
