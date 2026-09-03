import { socialLinks } from "@/shared/config/footer";

export function SocialLinks() {
  return (
    <div className="my-6 flex justify-center gap-4 md:justify-start">
      {socialLinks.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          title={label}
          aria-label={label}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-ink-inverse-muted focus-visible:outline-ink-inverse"
        >
          <Icon className="size-6" />
        </a>
      ))}
    </div>
  );
}
