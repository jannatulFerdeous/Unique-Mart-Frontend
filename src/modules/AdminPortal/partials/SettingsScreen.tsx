"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { Button } from "../components/Button";
import { Field, Input } from "../components/Field";
import { Panel, ScreenHeader } from "../components/Panel";
import { PASSWORD_MAX, checkPassword } from "../config/users";
import { blurbFor } from "./AdminSidebar";

type Errors = Partial<Record<"next" | "confirm" | "submit", string>>;

export function SettingsScreen() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);
  const [changePassword, { isLoading: saving }] = useChangePasswordMutation();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);
    const found: Errors = {
      next: checkPassword(next) ?? (current && next === current ? "Choose a password you haven't been using." : undefined),
      confirm: confirm !== next ? "The two new passwords don't match." : undefined,
    };
    setErrors(found);
    if (found.next || found.confirm) return;

    try {
      await changePassword({ ...(current && { currentPassword: current }), newPassword: next }).unwrap();
      setCurrent("");
      setNext("");
      setConfirm("");
      setSaved(true);
    } catch (problem) {
      setErrors({ submit: apiErrorMessage(problem, "Couldn't change your password. Please try again.") });
    }
  };

  return (
    <>
      <ScreenHeader title="Settings" blurb={blurbFor("/admin/settings")} />

      <Panel title="Change password" description="The password you sign in with, together with your email." className="max-w-xl">
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <fieldset disabled={saving} className="flex flex-col gap-4">
            <legend className="sr-only">Change password</legend>
            <Field label="Current password" hint="Leave blank if you've only ever signed in with Google.">
              <PasswordInput value={current} onChange={setCurrent} autoComplete="current-password" />
            </Field>
            <Field label="New password" hint="At least 6 characters." error={errors.next}>
              <PasswordInput value={next} onChange={setNext} autoComplete="new-password" />
            </Field>
            <Field label="Confirm new password" error={errors.confirm}>
              <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" />
            </Field>
          </fieldset>

          {errors.submit && (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors.submit}
            </p>
          )}
          {saved && (
            <p role="status" className="text-sm font-medium text-good">
              Password changed. Use the new one next time you sign in.
            </p>
          )}

          <div>
            <Button type="submit" variant="primary" disabled={saving || !next || !confirm}>
              {saving ? "Changing…" : "Change password"}
            </Button>
          </div>
        </form>
      </Panel>
    </>
  );
}

function PasswordInput({
  value,
  onChange,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
}) {
  const [shown, setShown] = useState(false);

  return (
    <span className="relative block">
      <Input
        type={shown ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        maxLength={PASSWORD_MAX}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShown(!shown)}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        className="absolute inset-y-0 right-0 grid w-10 place-items-center text-ink-subtle hover:text-ink"
      >
        {shown ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </span>
  );
}
