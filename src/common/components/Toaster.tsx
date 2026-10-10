"use client";

import { X } from "lucide-react";
import { dismissToast, useToast } from "@/shared/libs/toast";
import { cn } from "@/shared/utils/cn";

export function Toaster() {
  const shown = useToast();

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      {shown && (
        <p
          key={shown.id}
          role={shown.tone === "danger" ? "alert" : "status"}
          className={cn(
            "pointer-events-auto flex max-w-md items-start gap-3 rounded-control px-4 py-3 text-sm font-medium shadow-card",
            shown.tone === "danger" ? "bg-critical-soft text-danger" : "bg-inverse text-ink-inverse",
          )}
        >
          <span className="flex-1">{shown.text}</span>
          <button type="button" onClick={dismissToast} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100">
            <X className="size-4" aria-hidden />
          </button>
        </p>
      )}
    </div>
  );
}
