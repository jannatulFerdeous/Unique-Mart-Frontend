"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { apiErrorMessage } from "@/redux/api/errors";
import { useSubscribeMutation } from "@/redux/features/newsletter/newsletterApi";
import { site } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

export function NewsletterForm() {
  const [subscribe, { isLoading }] = useSubscribeMutation();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ tone: "good" | "danger"; text: string } | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setResult(null);
    try {
      await subscribe(email.trim()).unwrap();
      setEmail("");
      setResult({ tone: "good", text: "You're subscribed. Thanks for signing up!" });
    } catch (problem) {
      setResult({ tone: "danger", text: apiErrorMessage(problem) });
    }
  };

  return (
    <>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className="h-10 w-full min-w-0 flex-1 bg-surface px-3 py-1 text-base text-ink placeholder:text-ink-subtle focus-visible:outline-ink-inverse"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="h-10 shrink-0 bg-tertiary px-4 py-2.5 text-sm font-medium text-tertiary-contrast transition-colors hover:bg-tertiary-hover focus-visible:outline-ink-inverse disabled:opacity-60"
        >
          {isLoading ? "Subscribing…" : "Subscribe"}
        </button>
      </form>

      <p
        role={result?.tone === "danger" ? "alert" : "status"}
        className={cn("mt-2 text-sm", result?.tone === "danger" ? "text-ink-inverse" : "text-ink-inverse-muted")}
      >
        {result?.text}
      </p>

      <p className="mt-1 mb-6 text-xs text-ink-inverse-muted">
        Changed your mind?{" "}
        <Link href={site.newsletterPath} className="underline hover:text-ink-inverse">
          Unsubscribe
        </Link>
      </p>
    </>
  );
}
