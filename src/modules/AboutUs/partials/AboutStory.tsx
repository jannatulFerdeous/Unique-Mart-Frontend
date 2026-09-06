import { about_data } from "../config/constants";

export function AboutStory() {
  const { title, paragraphs } = about_data.story;

  return (
    <section aria-labelledby="about-story-heading" className="pt-14">
      <div className="container-page">
        <h2
          id="about-story-heading"
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
    </section>
  );
}
