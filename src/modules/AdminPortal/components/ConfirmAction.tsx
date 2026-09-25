"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

/* Deleting is one click away and one click is how a product disappears at 9am
   on a Saturday. So the button asks first, in place: press once and it becomes
   "Sure?" beside a way out, and it goes back on its own after a few seconds or
   as soon as focus leaves.

   A two-state button rather than a modal dialog on purpose — a confirm dialog in
   a table row moves the reader's eyes off the row they were pointing at, which is
   the one piece of context they need to answer the question. */

/** How long the armed state waits before disarming itself. Long enough to read
 *  the word, short enough that a forgotten row is not left primed. */
const DISARM_AFTER = 4000;

export function ConfirmAction({
  onConfirm,
  label,
  confirmLabel = "Sure?",
  cancelLabel = "No",
  size = "sm",
  /** What the row is about, so the button says which thing it will delete. */
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
