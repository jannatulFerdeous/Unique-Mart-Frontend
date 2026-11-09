import { MapPin } from "lucide-react";
import { MailIcon } from "@/common/components/icons/MailIcon";
import { PhoneIcon } from "@/common/components/icons/PhoneIcon";
import { mailHref, site, telHref } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";
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

      {/* Its own line, and w-0 + min-w-full keep it from widening this column
          (which would squeeze the link columns beside it): it wraps to the
          width the phone and email set instead. */}
      <a
        href={site.mapUrl}
        target="_blank"
        rel="noreferrer"
        className={cn(contactLink, "mt-4 w-0 min-w-full justify-center md:justify-start")}
      >
        <MapPin className="size-5 shrink-0" aria-hidden />
        <address className="text-left not-italic">{site.address}</address>
      </a>

      <SocialLinks />
    </div>
  );
}
