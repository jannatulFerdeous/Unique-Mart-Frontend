"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";
import { legalPaths } from "@/shared/config/legal";
import { agreement, checkout_data as copy } from "../config/constants";

export type AgreementDialogHandle = { open: () => void };

type Props = {
  // Runs inside the confirm click, so a payment pop-up opened there isn't blocked.
  onConfirm: () => void;
  confirmLabel: string;
};

// Opens when the shopper presses Place order: short policies, an unticked box
// they must tick themselves (SSLCommerz rule), then the order goes in.
export const AgreementDialog = forwardRef<AgreementDialogHandle, Props>(function AgreementDialog(
  { onConfirm, confirmLabel },
  ref,
) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [agreed, setAgreed] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setAgreed(false);
      dialog.current?.showModal();
    },
  }));

  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      aria-labelledby="agreement-title"
      className="m-auto w-[min(40rem,calc(100vw-2rem))] rounded-card bg-surface p-0 text-ink shadow-2xl backdrop:bg-inverse-deep/50 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <h2 id="agreement-title" className="flex items-center gap-2 font-sans text-base font-bold text-ink">
          <ShieldCheck className="size-5 text-tertiary" aria-hidden />
          {agreement.title}
        </h2>
        <button
          type="button"
          onClick={close}
          aria-label={agreement.close}
          className="grid size-8 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
        <p className="text-sm text-ink-muted">{agreement.intro}</p>

        {agreement.sections.map((section) => (
          <section key={section.heading} className="mt-4">
            <h3 className="font-sans text-sm font-bold text-ink">{section.heading}</h3>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-ink-muted marker:text-line-strong">
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {"href" in section && (
              <PolicyLink href={section.href} className="mt-1.5 inline-block text-sm">
                {section.link}
              </PolicyLink>
            )}
          </section>
        ))}

        <p className="mt-4 text-sm text-ink-muted">{agreement.contact}</p>
      </div>

      <div className="border-t border-line px-5 py-4">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-tertiary"
          />
          <span>
            {copy.agreeBefore}
            <PolicyLink href={legalPaths.terms}>{copy.agreeTerms}</PolicyLink>,{" "}
            <PolicyLink href={legalPaths.privacy}>{copy.agreePrivacy}</PolicyLink> and{" "}
            <PolicyLink href={legalPaths.refund}>{copy.agreeRefund}</PolicyLink>.
          </span>
        </label>

        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            className="rounded-control border border-line px-5 py-2.5 font-medium text-ink transition-colors hover:border-line-strong"
          >
            {agreement.cancel}
          </button>
          <button
            type="button"
            disabled={!agreed}
            onClick={() => {
              close();
              onConfirm();
            }}
            className="rounded-control bg-tertiary px-5 py-2.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover disabled:pointer-events-none disabled:opacity-50"
          >
            {agreement.confirm}
            <span className="sr-only"> — {confirmLabel}</span>
          </button>
        </div>
        {!agreed && <p className="mt-2 text-right text-xs text-ink-muted">{agreement.tickFirst}</p>}
      </div>
    </dialog>
  );
});

// Opens in a new tab so the checkout (address, coupon) isn't lost.
function PolicyLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-medium text-tertiary underline ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
