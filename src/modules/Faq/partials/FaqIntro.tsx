import { faq_data } from "../config/constants";

export function FaqIntro() {
  const { title, lede } = faq_data;

  return (
    <section className="pt-10 md:pt-14">
      <div className="container-page text-center">
        <h1
          id="faq-heading"
          className="font-sans font-bold text-ink"
        >
          {title}
        </h1>

        <p className="mx-auto mt-4 max-w-[70ch] leading-[1.8] text-ink-muted">
          {lede}
        </p>
      </div>
    </section>
  );
}
