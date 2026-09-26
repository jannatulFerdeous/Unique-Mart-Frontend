import { Footer } from "@/common/widgets/Footer";
import { Header } from "@/common/widgets/Header";

export default function StorefrontLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
