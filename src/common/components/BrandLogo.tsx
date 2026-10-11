import Image from "next/image";
import type { BrandMark } from "@/shared/libs/storefront/catalog";
import { cn } from "@/shared/utils/cn";

// Fills its (relative, sized) parent with the brand's logo or, when the admin
// hasn't uploaded one, its name (or just its initial where the name is
// already printed next to it).
export function BrandLogo({
  brand,
  sizes,
  fallback = "name",
  className,
}: {
  brand: Pick<BrandMark, "label" | "logo">;
  sizes: string;
  fallback?: "name" | "initial";
  className?: string;
}) {
  return brand.logo ? (
    <Image src={brand.logo} alt="" fill sizes={sizes} className={cn("object-contain", className)} />
  ) : (
    <span
      aria-hidden
      className={cn(
        "absolute inset-0 flex items-center justify-center text-center leading-tight font-bold text-ink-muted",
        fallback === "initial" && "rounded-full bg-surface-muted text-5xl text-ink-subtle uppercase",
        className,
      )}
    >
      {fallback === "initial" ? brand.label.charAt(0) : brand.label}
    </span>
  );
}
