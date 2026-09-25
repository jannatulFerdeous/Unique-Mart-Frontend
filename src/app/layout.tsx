import type { Metadata } from "next";
import { site } from "@/shared/config/site";
import { fontVariables } from "@/shared/libs/fonts";
import "@/shared/styles/globals.css";

/* The document, and nothing else.
 *
 * The storefront chrome used to live here. It moved to `(storefront)/layout`
 * when the admin portal landed: the two sections share fonts, tokens and the
 * `<html>` element, and share nothing else — an order table has no business
 * rendering under the shop header, and the portal's own sidebar would fight it.
 * Route groups are how App Router expresses that, and neither group name
 * reaches the URL. */

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.locale} className={`${fontVariables} h-full antialiased`}>
      {/* `suppressHydrationWarning` is here for browser extensions, not for our
          own markup.

          Grammarly, password managers and reading-mode tools all stamp
          attributes onto <body> (`data-gr-ext-installed`, and friends) before
          React hydrates. React then compares the server HTML with a DOM someone
          else has already edited, and reports a mismatch the site cannot cause
          and cannot fix — which trains everyone to ignore the one warning that
          would catch a real bug.

          What this does NOT hide: the flag covers attribute differences on this
          one element and does not reach its children, so a genuine mismatch
          anywhere inside the app is still reported. It is safe here because
          <body>'s own className is a fixed string — if that ever becomes
          computed, this flag stops being free and should come off. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
