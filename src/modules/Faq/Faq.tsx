import { FaqBrowser } from "./partials/FaqBrowser";
import { FaqContact } from "./partials/FaqContact";
import { FaqIntro } from "./partials/FaqIntro";

export function Faq() {
  return (
    <>
      <FaqIntro />
      <FaqBrowser />
      <FaqContact />
    </>
  );
}
