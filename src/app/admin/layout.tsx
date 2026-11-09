import type { Metadata } from "next";
import { AdminShell } from "@/modules/AdminPortal";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s · Admin | Unique & Smart",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
