"use client";

import { useEffect } from "react";
import Link from "next/link";
import { UnpluggedArt } from "./ErrorArt";
import { ErrorScreen, error_copy, primaryButton, secondaryButton } from "./ErrorScreen";

// What a shop page shows when it fails to render (the 500 page).
export function ShopError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen {...error_copy.failed} art={<UnpluggedArt />} reference={error.digest}>
      <button type="button" onClick={() => retry()} className={primaryButton}>
        {error_copy.retry}
      </button>
      <Link href="/" className={secondaryButton}>
        {error_copy.home}
      </Link>
    </ErrorScreen>
  );
}
