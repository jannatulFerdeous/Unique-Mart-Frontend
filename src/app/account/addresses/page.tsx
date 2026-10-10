import type { Metadata } from "next";
import { AddressesScreen } from "@/modules/AdminPortal";

export const metadata: Metadata = { title: "Manage Address" };

export default function AccountAddressesPage() {
  return <AddressesScreen />;
}
