"use client";

import { ShopError } from "@/common/components/ShopError";

export default function StorefrontError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <ShopError {...props} />;
}
