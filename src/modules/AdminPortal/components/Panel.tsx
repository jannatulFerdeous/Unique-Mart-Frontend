import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

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
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
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
