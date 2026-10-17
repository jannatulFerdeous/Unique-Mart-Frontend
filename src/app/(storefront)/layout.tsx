import { Toaster } from "@/common/components/Toaster";
import { BottomNav } from "@/common/widgets/BottomNav";
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
      <BottomNav />
      <Toaster />
    </>
  );
}
