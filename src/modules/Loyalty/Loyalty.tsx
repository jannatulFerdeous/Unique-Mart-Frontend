import Link from "next/link";
import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { loyalty_data } from "./config/constants";

export function Loyalty() {
  const data = loyalty_data;

  return (
    <>
      <ProductBreadcrumb trail={[{ label: "Home", href: "/" }, { label: data.title }]} />

      <div className="container-page py-8">
        <header>
          <h1 className="font-sans font-bold text-ink">{data.heading}</h1>
          <p className="mt-3 text-ink-muted">{data.intro}</p>
          <p className="mt-4 rounded-control border border-line bg-surface px-4 py-3 text-sm text-ink-muted">
            {data.notLiveNote}
          </p>
        </header>

        <section aria-labelledby="how" className="mt-12">
          <h2 id="how" className="font-sans font-bold text-ink">
            {data.howTitle}
          </h2>

          <ol className="mt-5 grid gap-5 md:grid-cols-3">
            {data.steps.map((step, index) => (
              <li key={step.title} className="rounded-card border border-line bg-surface p-5">
                <span className="grid size-9 place-items-center rounded-full bg-tertiary-soft font-sans font-bold text-tertiary">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-sans font-bold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="tiers" className="mt-12">
          <h2 id="tiers" className="font-sans font-bold text-ink">
            {data.tiersTitle}
          </h2>
          <p className="mt-2 text-ink-muted">{data.tiersIntro}</p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-2xl border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th scope="col" className="border-b border-line py-3 pr-4 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                    {data.tierHead.tier}
                  </th>
                  <th scope="col" className="border-b border-line py-3 pr-4 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                    {data.tierHead.spend}
                  </th>
                  <th scope="col" className="border-b border-line py-3 pr-4 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                    {data.tierHead.earn}
                  </th>
                  <th scope="col" className="border-b border-line py-3 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                    {data.tierHead.extra}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.tiers.map((tier) => (
                  <tr key={tier.name}>
                    <td className="border-b border-line py-3 pr-4 font-medium text-ink">
                      {tier.name}
                    </td>
                    <td className="border-b border-line py-3 pr-4 text-ink-muted">{tier.spend}</td>
                    <td className="border-b border-line py-3 pr-4 text-ink-muted">{tier.earn}</td>
                    <td className="border-b border-line py-3 text-ink-muted">{tier.extra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="benefits" className="mt-12">
          <h2 id="benefits" className="font-sans font-bold text-ink">
            {data.benefitsTitle}
          </h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {data.benefits.map((benefit) => (
              <li key={benefit.title} className="rounded-card border border-line bg-surface p-5">
                <h3 className="font-sans font-bold text-ink">{benefit.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{benefit.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="rules" className="mt-12">
          <h2 id="rules" className="font-sans font-bold text-ink">
            {data.rulesTitle}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted marker:text-line-strong">
            {data.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>

          <p className="mt-6 text-ink-muted">
            {data.termsNote}{" "}
            <Link href="/terms" className="text-tertiary hover:underline">
              {data.termsLink}
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
