import Image from "next/image";
import Link from "next/link";
import logoLight from "@/images/brand/logo-light.png";
import { site } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

// The header is dark, so it uses the logo with white lettering.
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("flex shrink-0 items-center focus-visible:outline-ink-inverse", className)}
    >
      <Image src={logoLight} alt="" priority sizes="120px" className="h-10 w-auto lg:h-12" />
    </Link>
  );
}
