"use client";

import Link from "next/link";
import { decodeBack, initials, useSession } from "@/shared/libs/session";
import { auth_data } from "../config/constants";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type Props = {
  view: "login" | "register";
  back?: string;
};

export function AuthBody({ view, back }: Props) {
  const { user, signOut } = useSession();

  if (user) {
    const mark = initials(user.name);

    return (
      <div className="mt-8 text-center">
        <span
          aria-hidden
          className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-tertiary bg-tertiary-soft font-bold text-tertiary"
        >
          {mark || user.name.slice(0, 1).toUpperCase()}
        </span>

        <p className="mt-4 text-ink-muted">{auth_data.signedInAs}</p>
        <p className="font-sans font-bold text-ink">{user.name}</p>

        <Link
          href={decodeBack(back)}
          className="mt-6 block w-full rounded-control bg-tertiary px-6 py-3.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
        >
          Continue
        </Link>

        <button
          type="button"
          onClick={signOut}
          className="mt-3 w-full rounded-control border border-line px-6 py-3.5 font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          {auth_data.signOut}
        </button>
      </div>
    );
  }

  return view === "login" ? <LoginForm back={back} /> : <RegisterForm back={back} />;
}
