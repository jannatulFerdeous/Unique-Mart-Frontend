import { Footer } from "@/common/widgets/Footer";
import { Header } from "@/common/widgets/Header";

/* Everything a customer sees. The admin portal is the sibling group and gets
   its own chrome, so this header and footer stop at the shop's edge. */
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
