import { about_data } from "../config/constants";

export function AboutIntro() {
  const { title, lede } = about_data;

  return (
    <section className="pt-10 md:pt-14">
      <div className="container-page">
        {/* font-sans because the base layer paints h1–h6 in --font-display. */}
        <h1
          id="about-heading"
          className="font-sans font-bold text-ink"
        >
          {title}
        </h1>

        {/* Full container width, like the prose below it. */}
        <p className="mt-4 leading-[1.8] text-ink-muted">
          {lede}
        </p>
      </div>
    </section>
  );
}
