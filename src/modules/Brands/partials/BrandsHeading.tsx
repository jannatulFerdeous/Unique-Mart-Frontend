import { brands_data } from "../config/constants";

export function BrandsHeading() {
  const { title, intro } = brands_data;

  return (
    <div className="container-page pt-8">
      {/* font-sans because the base layer paints h1–h6 in --font-display.
          Same size step as SectionHeader, so the page heading and the home
          page's section headings read as one scale. */}
      <h1
        id="brands-heading"
        className="font-sans text-[1.2rem] font-medium text-ink md:text-section"
      >
        {title}
      </h1>

      <p className="mt-2 text-sm text-ink-muted">{intro}</p>
    </div>
  );
}
