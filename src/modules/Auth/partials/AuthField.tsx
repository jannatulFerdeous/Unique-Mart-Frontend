"use client";

import { useId, useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { auth_data } from "../config/constants";

type Props = {
  Icon: LucideIcon;
  label: string;
  value: string;
  onChange: (next: string) => void;
  type?: "text" | "email" | "tel" | "password";
  autoComplete?: string;
  error?: string;
};

export function AuthField({
  Icon,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  error,
}: Props) {
  const id = useId();
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <div
        className={cn(
          "flex items-center gap-3 rounded-control border bg-surface px-4 transition-colors",
          "focus-within:border-tertiary",
          error ? "border-danger" : "border-line",
        )}
      >
        <Icon aria-hidden className="size-5 shrink-0 text-ink-subtle" />

        <input
          id={id}
          type={isPassword && revealed ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={label}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent py-3.5 text-base text-ink outline-none placeholder:text-ink-subtle"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((prev) => !prev)}
            aria-label={revealed ? auth_data.hidePassword : auth_data.showPassword}
            aria-pressed={revealed}
            className="shrink-0 rounded-control p-1 text-ink-subtle transition-colors hover:text-ink"
          >
            {revealed ? (
              <EyeOff aria-hidden className="size-5" />
            ) : (
              <Eye aria-hidden className="size-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
