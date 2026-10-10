"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { decodeBack } from "@/shared/libs/session";
import { auth_data } from "../config/constants";
import { useAccount } from "../hooks/useAccount";
import { AuthField } from "./AuthField";
import { GoogleButton } from "./GoogleButton";
import { withBack } from "./AuthCard";

// The backend rejects shorter passwords before checking them.
const MIN_PASSWORD = 6;

export function LoginForm({ back }: { back?: string }) {
  const router = useRouter();
  const { login, errors } = auth_data;
  const { signInWithPassword } = useAccount();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shown, setShown] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const found: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = errors.identifier;
    if (!password) found.password = errors.password;
    else if (password.length < MIN_PASSWORD) found.password = errors.min;

    setShown(found);
    setFailure(null);
    if (Object.keys(found).length) return;

    setPending(true);
    try {
      await signInWithPassword(email, password);
      router.replace(decodeBack(back));
    } catch (problem) {
      setFailure(apiErrorMessage(problem));
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="mt-8">
      <h1 className="sr-only">{login.title}</h1>

      <div className="space-y-4">
        <AuthField
          Icon={Mail}
          label={login.identifier}
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
          error={shown.email}
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

      {failure && (
        <p role="alert" className="mt-4 rounded-control bg-critical-soft px-4 py-3 text-sm text-danger">
          {failure}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-control bg-tertiary px-6 py-3.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover disabled:opacity-60"
      >
        {pending ? login.pending : login.submit}
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
    </form>
  );
}
