"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { encodeBack, initials, useSession } from "@/shared/libs/session";

/** The header's account control. Signed out it goes to the sign-in screen
 *  carrying where you were, so you come back here afterwards; signed in it
 *  shows your initials and opens the same screen, which becomes the
 *  "signed in as… / sign out" panel. */
export function AccountLink({ className }: { className: string }) {
  const { user } = useSession();
  const pathname = usePathname();

  // Pathname only, deliberately: `useSearchParams()` in the header would force
  // every page in the site out of static rendering, and nothing on this site
  // keeps state in the query string, so there is nothing to preserve.
  // Never send someone back to the auth screens themselves.
  const here = pathname.startsWith("/auth/") ? "/" : pathname;

  const href = `/auth/login?back=${encodeURIComponent(encodeBack(here))}`;
  const mark = user ? initials(user.name) : "";

  return (
    <Link
      href={href}
      aria-label={user ? `Account — signed in as ${user.name}` : "Log in"}
      className={className}
    >
      {mark ? (
        <span aria-hidden className="text-sm font-bold">
          {mark}
        </span>
      ) : (
        <User className="size-4.5" aria-hidden />
      )}
    </Link>
  );
}
