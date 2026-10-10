import { about_data } from "../config/constants";

export function AboutIntro() {
  const { title, lede } = about_data;

  return (
    <section className="pt-10 md:pt-14">
      <div className="container-page">
        <h1
          id="about-heading"
          className="font-sans font-bold text-ink"
        >
          {title}
        </h1>

        <p className="mt-4 leading-[1.8] text-ink-muted">
          {lede}
        </p>
      </div>
    </section>
  );
}
