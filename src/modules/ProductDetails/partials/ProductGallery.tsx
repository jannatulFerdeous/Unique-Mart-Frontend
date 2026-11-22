"use client";

import { useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { cn } from "@/shared/utils/cn";

type Props = {
  images: StaticImageData[];
  name: string;
  active: number;
  onSelect: (index: number) => void;
  // "cover" for real photos (used items): they fill the frame, which takes their
  // portrait 3:4 shape. Studio shots stay "contain" on a square.
  fit?: "contain" | "cover";
};

export function ProductGallery({ images, name, active, onSelect, fit = "contain" }: Props) {
  const cover = fit === "cover";
  // Hover zoom, mouse only (a tap on a phone shouldn't zoom): the photo scales
  // up around the cursor and follows it.
  const [zoom, setZoom] = useState<string | null>(null);
  const follow = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    setZoom(`${((event.clientX - box.left) / box.width) * 100}% ${((event.clientY - box.top) / box.height) * 100}%`);
  };
  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <ul className="flex min-w-0 gap-3 overflow-x-auto sm:max-h-125 sm:shrink-0 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "block size-20 shrink-0 overflow-hidden border bg-surface transition-colors sm:size-22",
                  index === active
                    ? "border-tertiary"
                    : "border-line hover:border-line-strong",
                )}
              >
                <Image
                  src={image}
                  alt=""
                  className={cn("size-full", cover ? "object-cover" : "object-contain p-1")}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        onPointerEnter={follow}
        onPointerMove={follow}
        onPointerLeave={() => setZoom(null)}
        className={cn("min-w-0 flex-1 self-start overflow-hidden border border-line bg-surface", zoom && "cursor-zoom-in")}
      >
        <Image
          src={images[active]}
          alt={name}
          priority
          sizes="(min-width: 1024px) 68vw, 100vw"
          style={zoom ? { transformOrigin: zoom } : undefined}
          className={cn(
            "w-full transition-transform duration-200 motion-reduce:transition-none",
            cover ? "aspect-[3/4] object-cover" : "aspect-square object-contain p-4",
            zoom && "scale-200",
          )}
        />
      </div>
    </div>
  );
}
