import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";

// A set of checkboxes drawn as chips, for "pick any of these" fields.
export function ChoiceChips({
  legend,
  options,
  value,
  onChange,
  hint,
  error,
  empty = "Nothing to choose from yet.",
  className,
}: {
  legend: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  hint?: string;
  error?: string;
  empty?: string;
  className?: string;
}) {
  const toggle = (option: string) =>
    onChange(value.includes(option) ? value.filter((each) => each !== option) : [...value, option]);

  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="mb-1.5 block text-sm font-medium text-ink">{legend}</legend>
      {options.length === 0 ? (
        <p className="text-sm text-ink-subtle">{empty}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {options.map((option) => {
            const on = value.includes(option.value);
            return (
              <label
                key={option.value}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-control border px-2.5 py-1.5 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-tertiary",
                  on
                    ? "border-tertiary bg-tertiary-soft text-ink"
                    : "border-line-strong bg-surface text-ink-muted hover:bg-surface-muted hover:text-ink",
                )}
              >
                <input type="checkbox" checked={on} onChange={() => toggle(option.value)} className="sr-only" />
                <Check className={cn("size-3.5", on ? "text-tertiary" : "hidden")} aria-hidden />
                {option.label}
              </label>
            );
          })}
        </div>
      )}
      {error ? (
        <p className="mt-1 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-subtle">{hint}</p>
      ) : null}
    </fieldset>
  );
}
