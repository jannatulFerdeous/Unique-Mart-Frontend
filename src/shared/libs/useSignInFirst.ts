"use client";

import { usePathname, useRouter } from "next/navigation";
import { encodeBack, useSession } from "./session";

// The cart, wishlist and reviews live on the shopper's account, so guests are
// sent to sign in first and brought back to the page they were on.
export function useSignInFirst() {
  const { user } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const signedIn = Boolean(user?.id);
  const goSignIn = () => router.push(`/auth/login?back=${encodeURIComponent(encodeBack(pathname))}`);

  return { signedIn, goSignIn };
}
