import type { Metadata } from "next";
import { AdminShell } from "@/modules/AdminPortal";

export const metadata: Metadata = {
  title: {
    default: "Admin portal",
    template: "%s · Admin | Unique Mart",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
