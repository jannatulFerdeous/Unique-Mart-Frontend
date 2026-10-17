"use client";

import Image from "next/image";
import { useEffect } from "react";
import { UnpluggedArt } from "@/common/components/ErrorArt";
import { ErrorScreen, error_copy, primaryButton, secondaryButton } from "@/common/components/ErrorScreen";
import logo from "@/images/brand/logo.png";
import { fontVariables } from "@/shared/libs/fonts";
import "@/shared/styles/globals.css";

// When even the root layout fails. It replaces the whole document, so it
// brings its own <html>, styles and fonts, and plain links (no app router).
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas">
        <title>Something went wrong | Unique Mart</title>
        <main className="flex flex-1 flex-col items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="mt-12">
            <Image src={logo} alt="Unique Mart" className="h-12 w-auto" priority />
          </a>
          <ErrorScreen {...error_copy.failed} art={<UnpluggedArt />} reference={error.digest}>
            <button type="button" onClick={() => retry()} className={primaryButton}>
              {error_copy.retry}
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className={secondaryButton}>
              {error_copy.home}
            </a>
          </ErrorScreen>
        </main>
      </body>
    </html>
  );
}
