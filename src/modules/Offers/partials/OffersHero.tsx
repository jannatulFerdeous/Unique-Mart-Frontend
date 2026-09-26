import { TicketPercent } from "lucide-react";
import { offers_data } from "../config/constants";

type Props = {
  topPercent: number;
  count: number;
};

export function OffersHero({ topPercent, count }: Props) {
  const { heroEyebrow, heroTitle, heroBody, heroNote } = offers_data;

  return (
    <section className="pt-6 pb-10">
      <div className="container-page">
        <div className="rounded-banner bg-tertiary px-6 py-10 text-tertiary-contrast md:px-12 md:py-14">
          <p className="flex items-center gap-2 font-bold tracking-wider uppercase">
            <TicketPercent aria-hidden className="size-5" />
            {heroEyebrow}
          </p>

          <h1 className="mt-3 font-sans font-bold text-tertiary-contrast">
            {heroTitle.replace("{percent}", String(topPercent))}
          </h1>

          <p className="mt-3 max-w-2xl leading-relaxed">
            {heroBody.replace("{n}", String(count))}
          </p>

          <p className="mt-4 max-w-2xl text-sm opacity-90">{heroNote}</p>
        </div>
      </div>
    </section>
  );
}
