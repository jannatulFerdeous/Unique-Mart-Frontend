import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type SectionHeaderProps = {
  title: string;
  href: string;
  id: string;
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
