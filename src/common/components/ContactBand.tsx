import Link from "next/link";
import { cn } from "@/shared/utils/cn";

export type ContactAction = {
  label: string;
  href: string;
  primary?: boolean;
};

type ContactBandProps = {
  id: string;
  title: string;
  body: string;
  actions: ContactAction[];
};

const BASE =
  "rounded-control px-5 py-3 text-sm font-bold transition-colors focus-visible:outline-ink-inverse";

export function ContactBand({ id, title, body, actions }: ContactBandProps) {
  return (
    <section aria-labelledby={id} className="pt-14 pb-16">
      <div className="container-page">
        <div className="bg-inverse px-6 py-10 text-center md:px-12 md:py-14">
          <h2
            id={id}
            className="font-sans font-bold text-ink-inverse"
          >
            {title}
          </h2>

          <p className="mx-auto mt-4 max-w-[62ch] leading-[1.85] text-ink-inverse-muted">
            {body}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {actions.map(({ label, href, primary }) => {
              const className = cn(
                BASE,
                primary
                  ? "bg-ink-inverse text-inverse-deep hover:bg-secondary-hover"
                  : "border border-ink-inverse-muted text-ink-inverse hover:bg-inverse-raised",
              );

              return href.startsWith("/") ? (
                <Link key={label} href={href} className={className}>
                  {label}
                </Link>
              ) : (
                <a key={label} href={href} className={className}>
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
