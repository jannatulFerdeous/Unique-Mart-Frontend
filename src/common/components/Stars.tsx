import { Star } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type Props = {
  /** 0–5. Rounded to the nearest whole star, as the reference does. */
  value: number;
  /** Tailwind size utility for one star. */
  size?: string;
  className?: string;
};

/** The filled/dim star row. Decorative on its own — whatever renders it is
 *  responsible for saying the score in text nearby. */
export function Stars({ value, size = "size-4", className }: Props) {
  const filled = Math.round(value);

  return (
    <span className={cn("flex", className)} aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            size,
            "stroke-none",
            index < filled ? "fill-ink" : "fill-line-strong",
          )}
        />
      ))}
    </span>
  );
}
