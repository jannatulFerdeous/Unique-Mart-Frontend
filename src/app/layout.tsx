import type { Metadata } from "next";
import { StoreProvider } from "@/redux/StoreProvider";
import { site } from "@/shared/config/site";
import { fontVariables } from "@/shared/libs/fonts";
import "@/shared/styles/globals.css";

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
    <html lang={site.locale} className={`${fontVariables} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
