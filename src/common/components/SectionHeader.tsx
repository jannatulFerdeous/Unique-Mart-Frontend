import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type SectionHeaderProps = {
  title: string;
  href: string;
  /** Used by the section's own aria-labelledby. */
  id: string;
  /** The reference centres only Exclusive and Shop By Brands; every rail
   *  after them is left-aligned in the same row. */
  align?: "center" | "left";
};

export function SectionHeader({
  title,
  href,
  id,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Centred, the title centres in the space left over by the link, exactly
          as the reference does — so it sits a little left of true centre. */}
      {/* font-sans because the base layer paints every h1–h6 in --font-display;
          only the logo uses Montserrat. Same override the footer needs. */}
      <h2
        id={id}
        className={cn(
          "flex-1 font-sans font-medium text-ink",
          align === "center" ? "text-center" : "text-left",
        )}
      >
        {title}
      </h2>

      <Link
        href={href}
        className="flex shrink-0 items-center gap-1 text-sm font-medium text-tertiary transition-colors hover:text-tertiary-hover"
      >
        Show All
        <ChevronRight className="size-4" aria-hidden />
        <span className="sr-only">{title}</span>
      </Link>
    </div>
  );
}
