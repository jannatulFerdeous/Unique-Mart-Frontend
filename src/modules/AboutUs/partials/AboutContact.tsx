import { ContactBand } from "@/common/components/ContactBand";
import { about_data } from "../config/constants";

export function AboutContact() {
  return <ContactBand id="about-contact-heading" {...about_data.contact} />;
}
