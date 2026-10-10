"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useUnsubscribeMutation } from "@/redux/features/newsletter/newsletterApi";

export function Unsubscribe() {
  const [unsubscribe, { isLoading }] = useUnsubscribeMutation();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFailure(null);
    try {
      await unsubscribe(email.trim()).unwrap();
      setDone(true);
    } catch (problem) {
      setFailure(apiErrorMessage(problem));
    }
  };

  return (
    <section className="flex justify-center px-4 py-10 md:py-16">
      <div className="w-full max-w-125 rounded-banner bg-surface p-6 shadow-card md:p-10">
        <h1 className="font-sans font-bold text-ink">Unsubscribe from the newsletter</h1>

        {done ? (
          <p role="status" className="mt-4 text-ink-muted">
            {email} won&apos;t get our newsletter any more. You can sign up again from the bottom of any page.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-4">
            <p className="text-ink-muted">Enter the email you signed up with and we&apos;ll stop sending to it.</p>

            <label className="mt-6 block">
              <span className="mb-2 block font-medium text-ink">Email</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-subtle" aria-hidden />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-control border border-line-strong bg-surface py-3 pr-4 pl-11 text-ink placeholder:text-ink-subtle focus:border-tertiary focus:outline-none"
                />
              </span>
            </label>

            {failure && (
              <p role="alert" className="mt-4 rounded-control bg-critical-soft px-4 py-3 text-sm text-danger">
                {failure}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-control bg-tertiary px-6 py-3.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover disabled:opacity-60"
            >
              {isLoading ? "Unsubscribing…" : "Unsubscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
