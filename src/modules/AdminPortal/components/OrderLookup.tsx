"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { clearNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch } from "@/redux/hooks";
import { findOrderId } from "../config/orders";
import { Button } from "./Button";
import { Field, Input } from "./Field";
import { Panel } from "./Panel";

// Opens a customer's order by its id, e.g. one pasted from SSLCommerz. The id
// found goes into the address (?order=…) so the page can be shared.
export function OrderLookup({
  title,
  href,
  initial,
  onFound,
}: {
  title: string;
  href: string;
  initial?: string;
  onFound: (orderId: string) => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState(initial ?? "");
  const [invalid, setInvalid] = useState(false);

  const open = (event: FormEvent) => {
    event.preventDefault();
    const id = findOrderId(draft);
    setInvalid(!id);
    if (!id) return;
    dispatch(clearNotice());
    setDraft(id);
    onFound(id);
    router.replace(`${href}?order=${id}`, { scroll: false });
  };

  return (
    <Panel title={title}>
      <form onSubmit={open} className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Field
          label="Order ID"
          hint="The 24-character ID from the customer's order page link, or value_a in the SSLCommerz merchant panel."
          error={invalid ? "That doesn't contain an order ID. It's 24 letters and numbers." : undefined}
          className="flex-1"
        >
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="e.g. 6650c3b0f1a2b3c4d5e6f789"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={invalid || undefined}
          />
        </Field>
        <Button type="submit" variant="primary" className="border border-transparent sm:mt-6.5">
          Look up
        </Button>
      </form>
    </Panel>
  );
}
