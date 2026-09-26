"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { cn } from "@/shared/utils/cn";

type Props = {
  images: StaticImageData[];
  name: string;
  active: number;
  onSelect: (index: number) => void;
};

export function ProductGallery({ images, name, active, onSelect }: Props) {
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
                  className="size-full object-contain p-1"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="min-w-0 flex-1 border border-line bg-surface">
        <Image
          src={images[active]}
          alt={name}
          priority
          sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 90vw"
          className="aspect-square w-full object-contain p-4"
        />
      </div>
    </div>
  );
}
