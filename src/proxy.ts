import { NextResponse } from "next/server";

// Renamed from `middleware.ts` — that convention is deprecated in Next.js 16.
// Placeholder: guards run here once auth lands.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*"],
};
