import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function ProductBreadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="pt-6">
      <div className="container-page">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;

            return (
              <li key={crumb.label} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-tertiary">
                    {crumb.label}
                  </span>
                ) : (
                  <>
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="text-ink-muted transition-colors hover:text-tertiary"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-ink-muted">{crumb.label}</span>
                    )}
                    <ChevronRight
                      aria-hidden
                      className="size-4 text-ink-subtle"
                    />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
