import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { Dropdown } from "./Dropdown";

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

// A dropdown in the dashboard's own style (see Dropdown), used like <select>.
export function Select({
  className,
  children,
  value,
  defaultValue,
  onChange,
  disabled,
  name,
  id,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: ComponentProps<"select">) {
  return (
    <Dropdown
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      disabled={disabled}
      name={name}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      className={className}
    >
      {children}
    </Dropdown>
  );
}

// A list filter: its label beside a compact dropdown.
export function FilterSelect({
  label,
  className,
  children,
  value,
  defaultValue,
  onChange,
  disabled,
  name,
  id,
}: ComponentProps<"select"> & { label: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-ink-muted">
      <span className="whitespace-nowrap">{label}</span>
      <Dropdown
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        name={name}
        id={id}
        className={cn("w-auto min-w-36 py-1.5 pr-2.5 pl-3", className)}
      >
        {children}
      </Dropdown>
    </label>
  );
}
