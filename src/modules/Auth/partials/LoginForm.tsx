"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User } from "lucide-react";
import { decodeBack, signIn } from "@/shared/libs/session";
import { auth_data } from "../config/constants";
import { AuthField } from "./AuthField";
import { GoogleButton } from "./GoogleButton";
import { AuthNote } from "./AuthNote";
import { withBack } from "./AuthCard";

export function LoginForm({ back }: { back?: string }) {
  const router = useRouter();
  const { login, errors } = auth_data;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [shown, setShown] = useState<Record<string, string>>({});

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const found: Record<string, string> = {};
    if (!identifier.trim()) found.identifier = errors.identifier;
    if (!password) found.password = errors.password;

    setShown(found);
    if (Object.keys(found).length) return;

    const typed = identifier.trim();
    signIn({
      name: typed,
      ...(typed.includes("@") ? { email: typed } : { phone: typed }),
    });

    router.replace(decodeBack(back));
  };

  return (
    <form onSubmit={submit} noValidate className="mt-8">
      <h1 className="sr-only">{login.title}</h1>

      <div className="space-y-4">
        <AuthField
          Icon={User}
          label={login.identifier}
          value={identifier}
          onChange={setIdentifier}
          autoComplete="username"
          error={shown.identifier}
        />

        <AuthField
          Icon={Lock}
          label={login.password}
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="current-password"
          error={shown.password}
        />
      </div>

      <p className="mt-3 text-right">
        <Link
          href="/auth/forgot-password"
          className="font-medium text-tertiary underline decoration-tertiary/40 underline-offset-4 transition-colors hover:decoration-tertiary"
        >
          {login.forgot}
        </Link>
      </p>

      <button
        type="submit"
        className="mt-6 w-full rounded-control bg-tertiary px-6 py-3.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
      >
        {login.submit}
      </button>

      <GoogleButton view="login" back={back} />

      <p className="mt-6 text-center font-bold text-ink">
        {login.footer}{" "}
        <Link
          href={withBack("/auth/register", back)}
          className="font-bold text-tertiary transition-colors hover:underline"
        >
          {login.footerLink}
        </Link>
      </p>

      <AuthNote />
    </form>
  );
}
