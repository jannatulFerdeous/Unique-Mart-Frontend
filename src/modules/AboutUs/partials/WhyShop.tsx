import { about_data } from "../config/constants";

export function WhyShop() {
  const { title, intro, claims } = about_data.why;

  return (
    <section aria-labelledby="about-why-heading" className="pt-14">
      <div className="container-page">
        <h2
          id="about-why-heading"
          className="font-sans font-bold text-ink"
        >
          {title}
        </h2>

        <p className="mt-4 leading-[1.85] text-ink-muted">
          {intro}
        </p>

        {/* The same six claims and icons the home strip renders, from
            shared/config/trust.ts — the two cannot drift apart. */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {claims.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="bg-surface p-6">
              <Icon
                strokeWidth={1.5}
                aria-hidden
                className="size-8 text-ink"
              />

              <h3 className="mt-4 font-sans font-bold text-ink">
                {label}
              </h3>

              <p className="mt-2 leading-[1.8] text-ink-muted">
                {detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
