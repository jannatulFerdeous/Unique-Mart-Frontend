import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { PAYMENT_RESULTS } from "@/redux/features/payment/payment.types";

// The backend's PAYMENT_RESULT_URL: after SSLCommerz it sends the shopper here
// with ?payment_status=success|failed|cancelled&order_id=…, and we show them
// the order with how the payment went.
export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const orderId = query.get("order_id") ?? "";
  const result = PAYMENT_RESULTS.find((each) => each === query.get("payment_status"));

  if (!/^[a-f\d]{24}$/i.test(orderId)) redirect("/account/orders");
  redirect(`/account/orders/${orderId}${result ? `?payment=${result}` : ""}`);
}
