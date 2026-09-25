import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

/** A titled card. The portal's only container, so every screen is built from
 *  the same box and nothing needs its own spacing decisions. */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  /** Controls in the header — a filter, a link, a button. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        /* `min-w-0` is load-bearing, not tidiness. A grid or flex item defaults to
           `min-width: auto`, which means it refuses to shrink below its content's
           min-content width — and a panel holding a table with a min-width pushes
           its whole column open, taking every sibling panel with it and scrolling
           the page sideways on a phone. Zeroing it lets the table's own
           `overflow-x-auto` do the scrolling, which is where it belongs. */
        "min-w-0 rounded-card border border-line bg-surface shadow-card",
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3 md:px-5">
          <div className="min-w-0">
            {title && <h2 className="truncate font-sans text-h5 font-bold">{title}</h2>}
            {description && (
              <p className="mt-0.5 text-sm text-ink-muted md:text-sm">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn("px-4 py-4 md:px-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** The heading every screen opens with. Separate from Panel because it sits
 *  above the cards rather than inside one. */
export function ScreenHeader({
  title,
  blurb,
  actions,
}: {
  title: string;
  blurb?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-sans text-h3 font-bold md:text-h3">{title}</h1>
        {blurb && <p className="mt-1 max-w-2xl text-ink-muted">{blurb}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/** Shown in place of a table that has no rows. Says why it is empty and, where
 *  there is one, offers the action that would fill it. */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
      <p className="font-sans font-bold text-ink">{title}</p>
      {body && <p className="max-w-sm text-sm text-ink-muted">{body}</p>}
      {action}
    </div>
  );
}
