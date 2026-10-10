import { about_data } from "../config/constants";

export function Commitment() {
  const { title, paragraphs } = about_data.commitment;

  return (
    <section aria-labelledby="about-commitment-heading" className="pt-14">
      <div className="container-page">
        <div className="bg-surface-muted px-6 py-10 md:px-12 md:py-14">
          <h2
            id="about-commitment-heading"
            className="font-sans font-bold text-ink"
          >
            {title}
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-[1.85] text-ink-muted md:text-base">
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
