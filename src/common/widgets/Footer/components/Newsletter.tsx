import { MailIcon } from "@/common/components/icons/MailIcon";
import { PhoneIcon } from "@/common/components/icons/PhoneIcon";
import { mailHref, site, telHref } from "@/shared/config/site";
import { NewsletterForm } from "./NewsletterForm";
import { SocialLinks } from "./SocialLinks";

const contactLink =
  "flex items-center gap-3 text-sm font-medium transition-colors hover:text-ink-inverse-muted focus-visible:outline-ink-inverse";

export function Newsletter() {
  return (
    <div className="text-center md:text-left">
      <h3 className="mb-4 font-sans text-xl font-medium text-ink-inverse">
        Newsletter
      </h3>

      <p className="font-medium">
        Sign up to get the latest news and updates
      </p>

      <NewsletterForm />

      <div className="flex flex-wrap justify-center gap-4 md:justify-start">
        <a href={telHref} className={contactLink}>
          <PhoneIcon className="size-5 shrink-0" />
          {site.phone}
        </a>
        <a href={mailHref} className={contactLink}>
          <MailIcon className="size-5 shrink-0" />
          {site.email}
        </a>
      </div>

      <SocialLinks />
    </div>
  );
}
