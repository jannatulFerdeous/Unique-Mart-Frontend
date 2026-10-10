import { Search } from "lucide-react";
import type { CatalogStatus } from "@/redux/features/catalog/catalog.types";
import type { Notice } from "@/redux/features/notice/noticeSlice";
import { cn } from "@/shared/utils/cn";
import { Input } from "./Field";

const STATUS_TABS: { value: CatalogStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function StatusTabs({ value, onChange }: { value: CatalogStatus; onChange: (next: CatalogStatus) => void }) {
  return (
    <div
      role="group"
      aria-label="Filter by status"
      className="inline-flex gap-1 rounded-control border border-line bg-surface p-1"
    >
      {STATUS_TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          aria-pressed={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-control px-3 py-1.5 text-sm font-medium transition-colors",
            value === tab.value ? "bg-inverse text-ink-inverse" : "text-ink-muted hover:bg-surface-muted hover:text-ink",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function SearchBox({
  value,
  onChange,
  label,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
  className?: string;
}) {
  return (
    <label className={cn("relative w-full sm:w-72", className)}>
      <span className="sr-only">{label}</span>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className="pl-9"
      />
    </label>
  );
}

export function NoticeLine({ notice }: { notice: Notice | null }) {
  if (!notice) return null;
  return (
    <p
      role={notice.tone === "danger" ? "alert" : "status"}
      className={cn("text-sm font-medium", notice.tone === "good" ? "text-good" : "text-danger")}
    >
      {notice.text}
    </p>
  );
}
