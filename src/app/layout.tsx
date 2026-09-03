import type { Metadata } from "next";
import { Footer } from "@/common/widgets/Footer";
import { Header } from "@/common/widgets/Header";
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
    <html lang={site.locale} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
