import type { Metadata } from "next";
import { NotFoundScreen } from "@/common/components/NotFoundScreen";
import { Footer } from "@/common/widgets/Footer";
import { Header } from "@/common/widgets/Header";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

// URLs that match no page at all. This renders in the root layout, outside the
// shop's, so it adds the shop header and footer itself.
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <NotFoundScreen />
      </main>
      <Footer />
    </>
  );
}
