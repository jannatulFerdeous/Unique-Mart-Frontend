"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Field, Input } from "./Field";
import { Panel } from "./Panel";

/** Asks for the server's admin passcode after a write was refused. Shown only
 *  on the screens that write to the server — see `shared/libs/admin/api`.
 *
 *  Not a `<form>`: it can open inside the product editor's form, and forms do
 *  not nest. Enter is handled by hand instead, and kept from submitting
 *  whatever form it sits in. */
export function PasscodePanel({ onSave }: { onSave: (code: string) => void }) {
  const [code, setCode] = useState("");
  const submit = () => {
    if (code) onSave(code);
  };

  return (
    <Panel
      title="Admin passcode needed"
      description="This server only accepts changes to the live shop with the passcode set in its ADMIN_PASSCODE setting."
    >
      <div role="group" aria-label="Admin passcode" className="flex flex-wrap items-end gap-2">
        <Field label="Passcode" className="min-w-0 flex-1 sm:max-w-xs">
          <Input
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              submit();
            }}
            autoComplete="off"
          />
        </Field>
        <Button variant="primary" onClick={submit}>
          Use passcode
        </Button>
      </div>
    </Panel>
  );
}
