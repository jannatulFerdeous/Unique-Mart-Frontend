"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { auth_data } from "../config/constants";
import { AuthField } from "./AuthField";
import { withBack } from "./AuthCard";

export function ForgotForm({ back }: { back?: string }) {
  const { forgot, errors } = auth_data;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(errors.email);
      setDone(false);
      return;
    }

    setError("");
    setDone(true);
  };

  return (
    <form onSubmit={submit} noValidate className="mt-8">
      <h1 className="font-sans font-bold text-ink">{forgot.title}</h1>
      <p className="mt-2 text-ink-muted">{forgot.body}</p>

      <div className="mt-6">
        <AuthField
          Icon={Mail}
          label={forgot.email}
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
          error={error}
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-control bg-tertiary px-6 py-3.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
      >
        {forgot.submit}
      </button>

      {/* Says outright that nothing was sent, rather than the usual
          "check your inbox" that would be untrue here. */}
      {done && (
        <p
          role="status"
          className="mt-4 rounded-control border border-line bg-surface-muted px-4 py-3 text-sm text-ink-muted"
        >
          {forgot.sent}
        </p>
      )}

      <p className="mt-6 text-center">
        <Link
          href={withBack("/auth/login", back)}
          className="font-bold text-tertiary transition-colors hover:underline"
        >
          {forgot.back}
        </Link>
      </p>
    </form>
  );
}
