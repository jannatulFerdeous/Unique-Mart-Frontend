"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, TriangleAlert } from "lucide-react";
import { admin_data } from "../config/constants";
import { Button } from "../components/Button";
import { Field, Input } from "../components/Field";

export type AdminIdentity = {
  name: string;
  role: "owner";
};

export function AdminGate({ onSignIn }: { onSignIn: (admin: AdminIdentity) => void }) {
  const { gate } = admin_data;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-center bg-canvas px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-card border border-line bg-surface p-6 shadow-card md:p-7">
          <span className="inline-flex size-10 items-center justify-center rounded-control bg-tertiary-soft text-tertiary">
            <Lock className="size-5" aria-hidden />
          </span>

          <p className="mt-4 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
            {gate.eyebrow}
          </p>
          <h1 className="mt-1 font-sans text-h3 font-bold">{gate.title}</h1>
          <p className="mt-1.5 text-ink-muted">{gate.body}</p>

          <p className="mt-5 flex gap-2.5 rounded-control border border-warning bg-warning-soft px-3 py-2.5 text-xs text-ink">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{gate.warning}</span>
          </p>

          <p className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
            <span>{gate.hint}</span>
            <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-xs text-ink">
              {gate.passcode}
            </code>
          </p>

          <form
            className="mt-5 flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (code.trim() !== gate.passcode) {
                setWrong(true);
                return;
              }
              onSignIn({ name: name.trim().slice(0, 60) || "Store owner", role: "owner" });
            }}
          >
            <Field label={gate.nameLabel}>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={gate.namePlaceholder}
                autoComplete="name"
                maxLength={60}
              />
            </Field>

            <Field label={gate.codeLabel} error={wrong ? gate.wrong : undefined}>
              <Input
                type="password"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setWrong(false);
                }}
                placeholder={gate.codePlaceholder}
                autoComplete="new-password"
                required
              />
            </Field>

            <Button type="submit" variant="primary" className="w-full">
              {gate.submit}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-tertiary hover:underline">
            {gate.back}
          </Link>
        </p>
      </div>
    </div>
  );
}
