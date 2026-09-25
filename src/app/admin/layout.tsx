import type { Metadata } from "next";
import { AdminShell } from "@/modules/AdminPortal";

/* The portal sits outside the `(storefront)` group, so it never renders the shop
   header and footer — the root layout is now just the document. */

export const metadata: Metadata = {
  title: {
    default: "Admin portal",
    template: "%s · Admin | Unique Mart",
  },
  /* Never indexed. A crawler that finds an admin URL puts it in front of people
     who have no business there, and search results outlive the page. */
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
