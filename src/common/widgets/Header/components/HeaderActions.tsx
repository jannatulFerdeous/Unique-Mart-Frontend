import Link from "next/link";
import { Heart, MapPin, ShoppingCart, User } from "lucide-react";
import { ThunderIcon } from "@/common/components/icons/ThunderIcon";

const surface =
  "bg-ink-inverse/10 text-ink-inverse transition-colors hover:bg-ink-inverse/20 focus-visible:outline-ink-inverse";
const iconButton = `grid size-10 place-items-center rounded-control ${surface}`;

export function HeaderActions() {
  return (
    <div className="ml-auto flex items-center">
      <Link
        href="/offers"
        className="hidden items-center gap-0.5 font-medium text-tertiary transition-colors hover:text-tertiary-contrast focus-visible:outline-ink-inverse lg:flex"
      >
        <ThunderIcon className="size-5 animate-flash motion-reduce:animate-none" />
        Offers
      </Link>

      <div className="flex items-center gap-3 lg:gap-6 lg:pl-4">
        <Link
          href="/store-locator"
          className={`hidden h-10 items-center gap-2 rounded-control pr-3 pl-2.5 text-sm lg:flex ${surface}`}
        >
          <MapPin className="size-4.5" aria-hidden />
          Store Locator
        </Link>

        <Link href="/wishlist" aria-label="Wishlist" className={iconButton}>
          <Heart className="size-4.5" aria-hidden />
        </Link>

        <Link href="/cart" aria-label="Shopping cart" className={iconButton}>
          <ShoppingCart className="size-4.5" aria-hidden />
        </Link>

        <Link href="/account" aria-label="My account" className={iconButton}>
          <User className="size-4.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
