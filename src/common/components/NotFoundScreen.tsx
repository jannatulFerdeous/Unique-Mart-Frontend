import Link from "next/link";
import { LostBoxArt } from "./ErrorArt";
import { ErrorScreen, error_copy, secondaryButton } from "./ErrorScreen";

// The shop's 404: the lost-box illustration, a product search and ways on.
export function NotFoundScreen() {
  return (
    <ErrorScreen {...error_copy.notFound} art={<LostBoxArt />} search>
      <Link href="/" className={secondaryButton}>
        {error_copy.home}
      </Link>
      <Link href="/offers" className={secondaryButton}>
        {error_copy.offers}
      </Link>
    </ErrorScreen>
  );
}
