import { cn } from "@/shared/utils/cn";

export function StatusSwitch({
  label,
  on,
  disabled,
  onToggle,
  onText = "Active",
  offText = "Inactive",
}: {
  label: string;
  on: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onText?: string;
  offText?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`${label} is ${on ? onText.toLowerCase() : offText.toLowerCase()}`}
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          on ? "bg-tertiary" : "bg-line-strong",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "size-4 rounded-full bg-surface shadow-card transition-transform",
            on ? "translate-x-4.5" : "translate-x-0.5",
          )}
        />
      </button>
      <span className={cn("text-sm", on ? "text-good" : "text-ink-subtle")}>{on ? onText : offText}</span>
    </div>
  );
}
