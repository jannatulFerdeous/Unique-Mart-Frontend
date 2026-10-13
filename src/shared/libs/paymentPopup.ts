"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { TAG } from "@/redux/api/baseApi";
import { paymentApi } from "@/redux/features/payment/paymentApi";
import {
  PAYMENT_MESSAGE,
  type PaymentMessage,
  type PaymentResult,
  type PaymentStatus,
} from "@/redux/features/payment/payment.types";
import { useAppDispatch } from "@/redux/hooks";

const WIDTH = 480;
const HEIGHT = 720;

// The page behind the pop-up is out of focus while the shopper pays, so it
// asks regardless, and more often than an order page does.
const POLL_MS = 3_000;

const RESULT_OF: Partial<Record<PaymentStatus, PaymentResult>> = {
  paid: "success",
  failed: "failed",
  cancelled: "cancelled",
};

// Opens an empty pop-up for SSLCommerz. Call it in the click handler before
// anything is awaited, or the browser blocks it. Null when it was blocked.
export function openPaymentWindow(): Window | null {
  const left = Math.round(window.screenX + Math.max(0, (window.outerWidth - WIDTH) / 2));
  const top = Math.round(window.screenY + Math.max(0, (window.outerHeight - HEIGHT) / 2));
  const popup = window.open("about:blank", "sslcommerz", `popup,width=${WIDTH},height=${HEIGHT},left=${left},top=${top}`);
  try {
    if (popup) {
      popup.document.title = "Opening SSLCommerz…";
      popup.document.body.style.cssText = "font:16px system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0";
      popup.document.body.textContent = "Opening SSLCommerz…";
    }
  } catch {
    // A pop-up already on SSLCommerz is another origin; it navigates anyway.
  }
  return popup;
}

// Sends the pop-up to SSLCommerz, or the whole tab when the pop-up was blocked.
export function goToPayment(popup: Window | null, checkoutUrl: string) {
  if (popup && !popup.closed) popup.location.replace(checkoutUrl);
  else window.location.assign(checkoutUrl);
}

// Watches a payment made in the pop-up until it settles. /payment/result posts
// the outcome back, and the backend is polled in case it can't (SSLCommerz may
// cut the pop-up off from this window). `closed` is set if the shopper shuts
// the pop-up before it settles.
export function usePaymentPopup(onSettled: (orderId: string, result: PaymentResult) => void) {
  const dispatch = useAppDispatch();
  const [session, setSession] = useState<{ orderId: string; popup: Window } | null>(null);
  const [closed, setClosed] = useState(false);

  const settle = useEffectEvent((result: PaymentResult) => {
    if (!session) return;
    try {
      session.popup.close();
    } catch {
      // Already gone.
    }
    dispatch(paymentApi.util.invalidateTags([{ type: TAG.payment, id: session.orderId }]));
    setSession(null);
    setClosed(false);
    onSettled(session.orderId, result);
  });

  useEffect(() => {
    if (!session) return;
    const onMessage = (event: MessageEvent<PaymentMessage>) => {
      if (event.origin !== window.location.origin || event.data?.type !== PAYMENT_MESSAGE) return;
      if (event.data.orderId !== session.orderId || !event.data.result) return;
      settle(event.data.result);
    };
    // Keeps asking even once the pop-up looks closed: SSLCommerz can make it
    // look closed to this window while the shopper is still paying.
    const timer = window.setInterval(async () => {
      if (session.popup.closed) setClosed(true);
      try {
        const payment = await dispatch(
          paymentApi.endpoints.getOrderPayment.initiate(session.orderId, { forceRefetch: true, subscribe: false }),
        ).unwrap();
        const result = payment && RESULT_OF[payment.paymentStatus];
        if (result) settle(result);
      } catch {
        // Ask again next time.
      }
    }, POLL_MS);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(timer);
    };
  }, [session, dispatch]);

  return {
    // The order being paid for, while the pop-up is open.
    orderId: session?.orderId ?? null,
    closed,
    start: (orderId: string, popup: Window) => {
      setClosed(false);
      setSession({ orderId, popup });
    },
    focus: () => session?.popup.focus(),
  };
}
