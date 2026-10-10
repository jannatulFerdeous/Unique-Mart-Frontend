import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

const control =
  "w-full rounded-control border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-tertiary focus:outline-none";

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-ink-subtle">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-24 resize-y", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "pr-8", className)} {...rest}>
      {children}
    </select>
  );
}

export function FilterSelect({
  label,
  className,
  children,
  ...rest
}: ComponentProps<"select"> & { label: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-ink-muted">
      <span className="whitespace-nowrap">{label}</span>
      <select
        className={cn(
          "rounded-control border border-line-strong bg-surface px-2.5 py-1.5 text-sm text-ink focus:border-tertiary focus:outline-none",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}
