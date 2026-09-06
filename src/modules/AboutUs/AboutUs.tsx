import { AboutContact } from "./partials/AboutContact";
import { AboutFaq } from "./partials/AboutFaq";
import { AboutIntro } from "./partials/AboutIntro";
import { AboutStory } from "./partials/AboutStory";
import { Commitment } from "./partials/Commitment";
import { WhyShop } from "./partials/WhyShop";

export function AboutUs() {
  return (
    <>
      <AboutIntro />
      <AboutStory />
      <WhyShop />
      <Commitment />
      <AboutFaq />
      <AboutContact />
    </>
  );
}
