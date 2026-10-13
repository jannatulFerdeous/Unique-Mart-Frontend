import type { NextRequest } from "next/server";
import { PAYMENT_MESSAGE, PAYMENT_RESULTS, type PaymentMessage } from "@/redux/features/payment/payment.types";

// The backend's PAYMENT_RESULT_URL: after SSLCommerz it sends the shopper here
// with ?payment_status=success|failed|cancelled&order_id=…. Checkout opens
// SSLCommerz in a pop-up, so this hands the result to the page that opened it
// and closes. Without one (the pop-up was blocked and the whole tab went), or
// if SSLCommerz cut the pop-up off from it, it shows the order with the result.
export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const orderId = query.get("order_id") ?? "";
  const result = PAYMENT_RESULTS.find((each) => each === query.get("payment_status")) ?? null;
  const valid = /^[a-f\d]{24}$/i.test(orderId);

  const target = valid ? `/account/orders/${orderId}${result ? `?payment=${result}` : ""}` : "/account/orders";
  const message: PaymentMessage | null = valid ? { type: PAYMENT_MESSAGE, orderId, result } : null;

  // Both values are checked above, so they're safe to inline.
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Payment</title></head>
<body style="font:16px system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0">
<p>Taking you back to Unique Mart…</p>
<script>
(function () {
  var message = ${JSON.stringify(message)};
  var target = ${JSON.stringify(target)};
  try {
    var opener = window.opener;
    if (message && opener && !opener.closed && opener.location.origin === location.origin) {
      opener.postMessage(message, location.origin);
      window.close();
    }
  } catch (error) {}
  setTimeout(function () { location.replace(target); }, 300);
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
