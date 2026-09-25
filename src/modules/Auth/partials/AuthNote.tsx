import { Info } from "lucide-react";
import { auth_data } from "../config/constants";

/** States what actually happens on submit. There is no auth backend, so the
 *  card must not imply an account was created somewhere. */
export function AuthNote() {
  return (
    <p className="mt-6 flex gap-2 rounded-control border border-line bg-surface-muted px-4 py-3 text-sm text-ink-muted">
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{auth_data.note}</span>
    </p>
  );
}
