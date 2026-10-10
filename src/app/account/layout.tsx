import type { Metadata } from "next";
import { AdminShell } from "@/modules/AdminPortal";

// Same dashboard as /admin; the sidebar shows what the signed-in role can use.
export const metadata: Metadata = {
  title: {
    default: "My account",
    template: "%s · My account | Unique Mart",
  },
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return <AdminShell>{children}</AdminShell>;
}
