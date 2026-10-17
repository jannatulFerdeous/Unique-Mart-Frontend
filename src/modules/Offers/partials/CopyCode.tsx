"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { offers_data } from "../config/constants";

// The coupon code, with a button that puts it on the clipboard.
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard access: the code is on screen to type.
    }
  };

  return (
    <div className="flex items-stretch overflow-hidden rounded-control border border-dashed border-tertiary">
      <span className="flex items-center px-3 font-mono text-lg font-bold tracking-wider text-ink">{code}</span>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1.5 bg-tertiary-soft px-3 text-sm font-medium text-tertiary transition-colors hover:bg-tertiary hover:text-tertiary-contrast"
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        <span aria-live="polite">{copied ? offers_data.copied : offers_data.copy}</span>
        <span className="sr-only"> code {code}</span>
      </button>
    </div>
  );
}
