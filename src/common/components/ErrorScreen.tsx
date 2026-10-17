import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export const error_copy = {
  notFound: {
    eyebrow: "Error 404",
    title: "This page went out of stock",
    body: "We looked everywhere, but there's nothing at this address. The link may be old or mistyped, or the product is no longer sold.",
  },
  failed: {
    eyebrow: "Error 500",
    title: "Something came unplugged",
    body: "We couldn't load this page just now. It's on our side, not yours, so please try again in a moment.",
  },
  searchLabel: "Search products",
  searchPlaceholder: "Search phones, cases, watches…",
  search: "Search",
  home: "Go to the homepage",
  offers: "See offers",
  retry: "Try again",
  dashboard: "Back to dashboard",
  reference: "Error reference",
} as const;

export const primaryButton =
  "inline-flex items-center justify-center rounded-control bg-tertiary px-6 py-3 font-bold whitespace-nowrap text-tertiary-contrast transition-colors hover:bg-tertiary-hover";

export const secondaryButton =
  "inline-flex items-center justify-center rounded-control border border-line-strong bg-surface px-6 py-3 font-bold whitespace-nowrap text-ink transition-colors hover:border-ink-subtle";

// The top of every error page: what happened, a product search on shop pages,
// ways on, and an illustration beside it (above it when `compact`, as in the
// dashboard). `reference` is the error digest, to quote to support.
export function ErrorScreen({
  eyebrow,
  title,
  body,
  art,
  search = false,
  reference,
  compact = false,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  art: ReactNode;
  search?: boolean;
  reference?: string;
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby="error-title" className="relative overflow-hidden">
      {!compact && (
        <>
          <div aria-hidden className="absolute -top-24 -left-24 size-72 rounded-full bg-tertiary-soft blur-3xl" />
          <div aria-hidden className="absolute -right-16 bottom-0 size-64 rounded-full bg-tertiary-soft/70 blur-3xl" />
        </>
      )}

      <div
        className={cn(
          "relative mx-auto grid w-full items-center gap-8 px-4",
          compact ? "max-w-xl justify-items-center py-10 text-center" : "max-w-6xl py-12 md:grid-cols-2 md:gap-12 md:py-20",
        )}
      >
        <div className={cn("w-full", compact ? "max-w-55" : "order-first mx-auto max-w-115 md:order-last")}>
          {art}
        </div>

        <div className={cn("flex flex-col", compact ? "items-center" : "items-center text-center md:items-start md:text-left")}>
          <p className="rounded-full bg-tertiary-soft px-3 py-1 text-xs font-bold tracking-wider text-tertiary uppercase">
            {eyebrow}
          </p>
          <h1 id="error-title" className="mt-4 font-sans font-bold text-ink">
            {title}
          </h1>
          <p className="mt-3 max-w-md text-ink-muted">{body}</p>

          {search && (
            <form action="/search" method="get" role="search" className="mt-7 flex w-full max-w-md gap-2">
              <label className="relative flex-1">
                <span className="sr-only">{error_copy.searchLabel}</span>
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
                <input
                  type="search"
                  name="q"
                  placeholder={error_copy.searchPlaceholder}
                  className="w-full rounded-control border border-line-strong bg-surface py-3 pr-3 pl-9 text-ink shadow-card placeholder:text-ink-subtle focus:border-tertiary focus:outline-none"
                />
              </label>
              <button type="submit" className={primaryButton}>
                {error_copy.search}
              </button>
            </form>
          )}

          {children && <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">{children}</div>}

          {reference && (
            <p className="mt-7 text-xs text-ink-subtle">
              {error_copy.reference}: <span className="font-mono">{reference}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
