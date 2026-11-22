import { about_data } from "../config/constants";

// Business and management details from the trade license (SSLCommerz requires them).
export function CompanyInfo() {
  const { title, intro, rows } = about_data.company;

  return (
    <section aria-labelledby="about-company-heading" className="pt-14">
      <div className="container-page">
        <h2 id="about-company-heading" className="font-sans font-bold text-ink">
          {title}
        </h2>
        <p className="mt-3 text-sm text-ink-muted md:text-base">{intro}</p>

        <dl className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 border-b border-line py-3 sm:flex-row sm:gap-4">
              <dt className="shrink-0 text-sm font-medium text-ink sm:w-44">{row.label}</dt>
              <dd className="text-sm text-ink-muted">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
