import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { site, mailHref } from "@/shared/config/site";
import { careers_data } from "./config/constants";

/* Careers.
 *
 * `openings` is deliberately empty. Inventing a vacancy is not a placeholder
 * like lorem ipsum is — a careers page is read by people who will spend an
 * afternoon writing an application for a job that does not exist. So the page
 * renders a real empty state and is built to fill: add an entry to `openings`
 * in the config and the listing appears with no code change. */
export function Careers() {
  const data = careers_data;

  return (
    <>
      <ProductBreadcrumb trail={[{ label: "Home", href: "/" }, { label: data.title }]} />

      <div className="container-page py-8">
        <header>
          <h1 className="font-sans font-bold text-ink">{data.heading}</h1>
          <p className="mt-3 text-ink-muted">{data.intro}</p>
        </header>

        <section aria-labelledby="why" className="mt-12">
          <h2 id="why" className="font-sans font-bold text-ink">
            {data.whyTitle}
          </h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {data.why.map((item) => (
              <li key={item.title} className="rounded-card border border-line bg-surface p-5">
                <h3 className="font-sans font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="openings" className="mt-12">
          <h2 id="openings" className="font-sans font-bold text-ink">
            {data.openingsTitle}
          </h2>

          {data.openings.length === 0 ? (
            <div className="mt-5 rounded-card border border-line bg-surface px-6 py-12 text-center">
              <p className="font-sans font-bold text-ink">{data.noOpeningsTitle}</p>
              <p className="mx-auto mt-2 max-w-lg text-ink-muted">{data.noOpeningsBody}</p>
              <a
                href={`${mailHref}?subject=${encodeURIComponent(data.speculativeSubject)}`}
                className="mt-5 inline-block rounded-control bg-tertiary px-6 py-3 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
              >
                {data.speculativeAction}
              </a>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {data.openings.map((role) => (
                <li key={role.title} className="rounded-card border border-line bg-surface p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-sans font-bold text-ink">{role.title}</h3>
                    <p className="text-sm text-ink-muted">
                      {role.location} · {role.type}
                    </p>
                  </div>
                  <p className="mt-2 text-ink-muted">{role.summary}</p>

                  <h4 className="mt-4 font-sans text-sm font-bold text-ink">
                    {data.responsibilities}
                  </h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted marker:text-line-strong">
                    {role.responsibilities.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>

                  <h4 className="mt-4 font-sans text-sm font-bold text-ink">
                    {data.requirements}
                  </h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted marker:text-line-strong">
                    {role.requirements.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="apply" className="mt-12">
          <h2 id="apply" className="font-sans font-bold text-ink">
            {data.applyTitle}
          </h2>
          <p className="mt-3 text-ink-muted">
            {data.applyBody}{" "}
            <a href={mailHref} className="text-tertiary hover:underline">
              {site.email}
            </a>
            . {data.applyNote}
          </p>
        </section>
      </div>
    </>
  );
}
