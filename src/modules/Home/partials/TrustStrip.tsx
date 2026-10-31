import { home_data } from "../config/constants";

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="mt-5">
      <div className="container-page">
        {/* Below xl the badges sit in a centred block of equal columns, each
            starting at its icon, so the icons line up down the rows. */}
        <ul className="mx-auto grid w-fit grid-cols-2 gap-x-6 gap-y-5 py-6 md:grid-cols-3 md:gap-x-10 xl:flex xl:w-auto xl:justify-center xl:gap-0">
          {home_data.trust.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 border-line-strong odd:last:col-span-2 md:odd:last:col-span-1 xl:h-12 xl:justify-center xl:gap-4 xl:border-r xl:px-3 xl:first:pl-0 xl:last:border-r-0 xl:last:pr-0"
            >
              <Icon
                strokeWidth={1.5}
                aria-hidden
                className="size-6 shrink-0 text-ink xl:size-9"
              />
              <span className="text-sm font-semibold text-ink-muted xl:text-base xl:font-bold xl:whitespace-nowrap">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
