"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, TriangleAlert } from "lucide-react";
import { useAdmin } from "@/shared/libs/admin/gate";
import { admin_data } from "../config/constants";
import { Button } from "../components/Button";
import { Field, Input } from "../components/Field";

/** The way in. Not a lock — see the warning it renders, and the long comment at
 *  the top of `shared/libs/admin/gate`. */
export function AdminGate() {
  const { gate } = admin_data;
  const { signIn } = useAdmin();

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

          {/* The warning is above the form, not below it. Anyone who is about to
              type a passcode should have read what it is worth first. */}
          <p className="mt-5 flex gap-2.5 rounded-control border border-warning bg-warning-soft px-3 py-2.5 text-xs text-ink">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{gate.warning}</span>
          </p>

          {/* The passcode, in the open and always on screen. It is compiled into
              this page anyway, so hiding it buys nothing and costs the person in
              front of it. Kept out of the field's hint slot on purpose: an error
              replaces a hint, which took this away at the one moment it was
              needed. */}
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
              /* `signIn` is the only thing that knows the passcode. It returns
                 false rather than throwing, so a wrong code is a message on the
                 field and not a console error. */
              if (!signIn(code, name)) setWrong(true);
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
                /* `new-password` rather than `current-password`: there is no real
                   account here, and offering to save this into a password manager
                   would dignify a demo code as a credential. */
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
