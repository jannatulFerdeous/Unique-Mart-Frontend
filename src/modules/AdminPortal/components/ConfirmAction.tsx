"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

const DISARM_AFTER = 4000;

export function ConfirmAction({
  onConfirm,
  label,
  confirmLabel = "Sure?",
  cancelLabel = "No",
  size = "sm",
  describe,
}: {
  onConfirm: () => void;
  label: string;
  confirmLabel?: string;
  cancelLabel?: string;
  size?: "sm" | "md";
  describe?: string;
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!armed) return;
    timer.current = setTimeout(() => setArmed(false), DISARM_AFTER);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [armed]);

  if (!armed) {
    return (
      <Button
        variant="danger"
        size={size}
        onClick={() => setArmed(true)}
        aria-label={describe ? `${label} — ${describe}` : undefined}
      >
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <Button
        variant="danger"
        size={size}
        autoFocus
        onBlur={() => setArmed(false)}
        onClick={() => {
          setArmed(false);
          onConfirm();
        }}
      >
        {confirmLabel}
      </Button>
      <Button variant="ghost" size={size} onClick={() => setArmed(false)}>
        {cancelLabel}
      </Button>
    </span>
  );
}
