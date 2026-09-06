import { PhoneIcon } from "@/common/components/icons/PhoneIcon";
import { site, telHref } from "@/shared/config/site";

export function CallButton() {
  return (
    <a
      href={telHref}
      className="mb-4 flex w-min gap-1 rounded-lg border border-tertiary p-2 whitespace-nowrap text-tertiary transition-colors duration-500 hover:bg-tertiary hover:text-tertiary-contrast focus-visible:outline-ink-inverse xl:px-4 xl:py-2"
    >
      <PhoneIcon className="size-5 xl:size-8" />
      <span className="text-base font-bold xl:text-2xl">{site.phone}</span>
    </a>
  );
}
