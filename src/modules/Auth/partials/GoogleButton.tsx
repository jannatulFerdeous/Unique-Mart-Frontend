"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { apiErrorMessage } from "@/redux/api/errors";
import { decodeBack } from "@/shared/libs/session";
import { auth_data } from "../config/constants";
import { useAccount } from "../hooks/useAccount";

// The parts of Google Identity Services this button uses.
type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
      renderButton: (
        parent: HTMLElement,
        options: { theme: string; size: string; text: string; shape: string; width: number; logo_alignment: string },
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Google draws its own button between 200 and 400px wide.
const BUTTON_WIDTH = { min: 200, max: 400 };

export function GoogleButton({ view, back }: { view: "login" | "register"; back?: string }) {
  const { google } = auth_data;
  const router = useRouter();
  const { signInWithGoogle } = useAccount();
  const slot = useRef<HTMLDivElement>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const finish = async (credential?: string) => {
    if (!credential) return;
    setFailure(null);
    setPending(true);
    try {
      await signInWithGoogle(credential);
      router.replace(decodeBack(back));
    } catch (problem) {
      setFailure(apiErrorMessage(problem));
      setPending(false);
    }
  };

  // Runs once the script loads and again whenever this form mounts.
  const draw = () => {
    const identity = window.google?.accounts.id;
    if (!identity || !slot.current || !CLIENT_ID) return;
    identity.initialize({ client_id: CLIENT_ID, callback: ({ credential }) => finish(credential) });
    slot.current.replaceChildren();
    identity.renderButton(slot.current, {
      theme: "outline",
      size: "large",
      shape: "rectangular",
      logo_alignment: "center",
      text: view === "login" ? "signin_with" : "signup_with",
      width: Math.min(BUTTON_WIDTH.max, Math.max(BUTTON_WIDTH.min, slot.current.offsetWidth)),
    });
  };

  return (
    <div>
      <div className="my-6 flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        <span className="text-sm text-ink-subtle">{google.divider}</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {CLIENT_ID ? (
        <>
          <Script src="https://accounts.google.com/gsi/client" onReady={draw} />
          <div ref={slot} aria-busy={pending} className="flex min-h-11 justify-center" />
          {pending && (
            <p role="status" className="mt-2 text-center text-sm text-ink-muted">
              {google.pending}
            </p>
          )}
          {failure && (
            <p role="alert" className="mt-3 rounded-control bg-critical-soft px-4 py-3 text-sm text-danger">
              {failure}
            </p>
          )}
        </>
      ) : (
        <p className="text-center text-sm text-ink-subtle">{google.unavailable}</p>
      )}
    </div>
  );
}
