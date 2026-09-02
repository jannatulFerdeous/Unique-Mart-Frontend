import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom `--text-*` steps from globals.css. Without this, tailwind-merge reads
// `text-nav` as a color and drops it when a `text-<color>` class follows.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-nav"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
