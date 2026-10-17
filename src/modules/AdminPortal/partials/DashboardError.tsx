"use client";

import { useEffect } from "react";
import Link from "next/link";
import { UnpluggedArt } from "@/common/components/ErrorArt";
import { ErrorScreen, error_copy, primaryButton, secondaryButton } from "@/common/components/ErrorScreen";
import { useSession } from "@/shared/libs/session";
import { homeFor } from "../config/access";

// A dashboard page that failed to render, shown inside the dashboard so the
// sidebar stays.
export function DashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { user } = useSession();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-card border border-line bg-surface">
      <ErrorScreen {...error_copy.failed} art={<UnpluggedArt />} reference={error.digest} compact>
        <button type="button" onClick={() => retry()} className={primaryButton}>
          {error_copy.retry}
        </button>
        <Link href={homeFor(user?.role)} className={secondaryButton}>
          {error_copy.dashboard}
        </Link>
      </ErrorScreen>
    </div>
  );
}
