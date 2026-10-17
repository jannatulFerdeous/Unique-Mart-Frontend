"use client";

import Image from "next/image";
import Link from "next/link";
import { ShopError } from "@/common/components/ShopError";
import logo from "@/images/brand/logo.png";

// Errors no deeper page caught, such as the shop header itself failing, so it
// can't lean on the shop layout.
export default function RootError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main id="main" className="flex flex-1 flex-col items-center justify-center bg-canvas">
      <Link href="/" className="mt-12">
        <Image src={logo} alt="Unique Mart" className="h-12 w-auto" priority />
      </Link>
      <ShopError {...props} />
    </main>
  );
}
