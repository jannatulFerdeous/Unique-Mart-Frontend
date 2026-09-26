import { Star } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type Props = {
  value: number;
  size?: string;
  className?: string;
};

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
