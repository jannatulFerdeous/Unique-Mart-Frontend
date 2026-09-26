import { MailIcon } from "@/common/components/icons/MailIcon";
import { PhoneIcon } from "@/common/components/icons/PhoneIcon";
import { mailHref, site, telHref } from "@/shared/config/site";
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

      <form action={site.newsletterPath} className="mt-3 mb-6 flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Enter your email"
          className="h-10 w-full min-w-0 flex-1 bg-surface px-3 py-1 text-base text-ink placeholder:text-ink-subtle focus-visible:outline-ink-inverse"
        />
        <button
          type="submit"
          className="h-10 shrink-0 bg-tertiary px-4 py-2.5 text-sm font-medium text-tertiary-contrast transition-colors hover:bg-tertiary-hover focus-visible:outline-ink-inverse"
        >
          Subscribe
        </button>
      </form>

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
