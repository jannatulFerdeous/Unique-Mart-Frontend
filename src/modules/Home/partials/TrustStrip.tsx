import { home_data } from "../config/constants";

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="mt-5">
      <div className="container-page">
        {/* Grid until there is room for the reference's single centred row.
            That row needs the xl type step to fit six across, which is the same
            1280 where the reference steps its own sizes up. The reference hides
            this strip entirely below 1024; we keep all six. */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 py-6 md:grid-cols-3 xl:flex xl:justify-center xl:gap-0">
          {home_data.trust.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center justify-center gap-3 border-line-strong xl:h-12 xl:gap-4 xl:border-r xl:px-3 xl:first:pl-0 xl:last:border-r-0 xl:last:pr-0"
            >
              <Icon
                strokeWidth={1.5}
                aria-hidden
                className="size-6 shrink-0 text-ink xl:size-9"
              />
              <span className="text-center text-sm font-semibold text-ink-muted xl:text-base xl:font-bold xl:whitespace-nowrap">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
