"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Phone, User } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { decodeBack } from "@/shared/libs/session";
import { auth_data } from "../config/constants";
import { useAccount } from "../hooks/useAccount";
import { AuthField } from "./AuthField";
import { GoogleButton } from "./GoogleButton";
import { withBack } from "./AuthCard";

const MIN_PASSWORD = 8;

export function RegisterForm({ back }: { back?: string }) {
  const router = useRouter();
  const { register, errors } = auth_data;
  const account = useAccount();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [shown, setShown] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const found: Record<string, string> = {};
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 50) found.name = errors.name;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = errors.email;
    if (!phone.trim()) found.phone = errors.phone;
    if (!password) found.password = errors.password;
    else if (password.length < MIN_PASSWORD) found.password = errors.short;
    if (confirm !== password) found.confirm = errors.mismatch;

    setShown(found);
    setFailure(null);
    if (Object.keys(found).length) return;

    setPending(true);
    try {
      await account.register({ name, email, phone, password });
      router.replace(decodeBack(back));
    } catch (problem) {
      setFailure(apiErrorMessage(problem));
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="mt-8">
      <h1 className="sr-only">{register.title}</h1>

      <div className="space-y-4">
        <AuthField
          Icon={User}
          label={register.name}
          value={name}
          onChange={setName}
          autoComplete="name"
          error={shown.name}
        />
        <AuthField
          Icon={Mail}
          label={register.email}
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
          error={shown.email}
        />
        <AuthField
          Icon={Phone}
          label={register.phone}
          value={phone}
          onChange={setPhone}
          type="tel"
          autoComplete="tel"
          error={shown.phone}
        />
        <AuthField
          Icon={Lock}
          label={register.password}
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="new-password"
          error={shown.password}
        />
        <AuthField
          Icon={Lock}
          label={register.confirm}
          value={confirm}
          onChange={setConfirm}
          type="password"
          autoComplete="new-password"
          error={shown.confirm}
        />
      </div>

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
        {pending ? register.pending : register.submit}
      </button>

      <GoogleButton view="register" back={back} />

      <p className="mt-6 text-center font-bold text-ink">
        {register.footer}{" "}
        <Link
          href={withBack("/auth/login", back)}
          className="font-bold text-tertiary transition-colors hover:underline"
        >
          {register.footerLink}
        </Link>
      </p>
    </form>
  );
}
