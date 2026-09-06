import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FaqAccordion } from "@/common/components/FaqAccordion";
import { about_data } from "../config/constants";

export function AboutFaq() {
  const { title, items, linkLabel, href } = about_data.faq;

  return (
    <section aria-labelledby="about-faq-heading" className="pt-14">
      <div className="container-page">
        <h2
          id="about-faq-heading"
          className="font-sans font-bold text-ink"
        >
          {title}
        </h2>

        <FaqAccordion items={items} className="mt-6" />

        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink transition-colors hover:text-ink-muted"
        >
          {linkLabel}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
