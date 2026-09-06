import { ContactBand } from "@/common/components/ContactBand";
import { faq_data } from "../config/constants";

export function FaqContact() {
  return <ContactBand id="faq-contact-heading" {...faq_data.contact} />;
}
