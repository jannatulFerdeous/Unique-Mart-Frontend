import { NextResponse } from "next/server";

// Renamed from `middleware.ts` — that convention is deprecated in Next.js 16.
// Placeholder: guards run here once auth lands.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  /* `/admin` is listed even though nothing is enforced yet, so the route is
     already in the one place a real guard belongs. When a backend lands, the
     admin check goes here AND in every admin screen: this proxy can only decide
     whether a page is served, and the data on an admin screen needs checking
     where it is read. A client-side gate — which is all the portal has today —
     hides a page without protecting anything behind it. See the header comment
     in `shared/libs/admin/gate`. */
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
