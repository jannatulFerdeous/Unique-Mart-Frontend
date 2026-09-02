import Link from "next/link";
import { site } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        "flex shrink-0 items-center gap-3 focus-visible:outline-ink-inverse",
        className,
      )}
    >
      <span className="flex flex-col">
        <span className="font-display text-lg leading-none font-extrabold tracking-tight text-ink-inverse uppercase lg:text-xl">
          {site.name}
        </span>
        <span className="mt-1 text-[0.625rem] leading-none font-medium tracking-[0.18em] text-ink-inverse-muted uppercase">
          {site.descriptor}
        </span>
      </span>
    </Link>
  );
}
