import Link from "next/link";
import type { ReactNode } from "react";
import type { FooterColumn as FooterColumnData } from "@/shared/config/footer";

type Props = FooterColumnData & {
  /** Rendered above the heading — the call button in the first column. */
  lead?: ReactNode;
};

export function FooterColumn({ title, items, lead }: Props) {
  return (
    <div className="text-center md:text-left">
      {lead ? <div className="flex justify-center md:justify-start">{lead}</div> : null}

      <h3 className="mb-4 font-sans text-xl font-medium text-ink-inverse">
        {title}
      </h3>

      {/* Below md the list reads as one centered wrapping row, as on the
          reference; from md it stacks inside its grid column. */}
      <ul className="flex flex-wrap justify-center gap-x-4 md:block">
        {items.map((item) => (
          <li key={item.href} className="mb-4 text-sm">
            <Link
              href={item.href}
              className="transition-colors hover:text-ink-inverse-muted focus-visible:outline-ink-inverse"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
