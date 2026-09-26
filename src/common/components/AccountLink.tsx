"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { encodeBack, initials, useSession } from "@/shared/libs/session";

export function AccountLink({ className }: { className: string }) {
  const { user } = useSession();
  const pathname = usePathname();

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
