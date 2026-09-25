/* Open baskets — what people are carrying and have not bought.
 *
 * Two sources, and the screen keeps them apart:
 *
 *  - The basket really filled on this browser, read live out of
 *    `shared/libs/cart`. Add something to the cart on the shop and it appears
 *    here; change the quantity there and it changes here. This is the same seam
 *    review moderation uses, and it is the one row on the screen that is real.
 *  - Seeded demo baskets, so the screen has something to show before the shop
 *    has any traffic.
 *
 * Abandonment is the whole point of the screen: a basket that has sat untouched
 * for a day is a phone call worth making, and the portal can turn one into a
 * pending order. */

import { useMemo } from "react";
import { allProducts } from "@/shared/config/products";
import { clear as clearLiveCart, useCart } from "@/shared/libs/cart";
import { useSession } from "@/shared/libs/session";
import { SESSION_CUSTOMER_ID } from "./customers";
import { createStore, daysAgo, rng } from "./store";
import type { Cart, CartLine } from "./types";

const KEY = "unique-mart.admin.carts.v1";

/** Untouched for longer than this and a basket counts as abandoned. */
export const ABANDONED_AFTER_HOURS = 24;

const COUNT = 22;

const seed = (): Cart[] => {
  const random = rng(165_233);
  const pool = allProducts;

  const rows = Array.from({ length: COUNT }, (_, index) => {
    const lines: CartLine[] = [];
    const count = 1 + Math.floor(random() * 3);

    for (let line = 0; line < count; line += 1) {
      const product = pool[Math.floor(random() * pool.length)];
      if (lines.some((each) => each.slug === product.slug)) continue;
      lines.push({
        slug: product.slug,
        name: product.name,
        unitPrice: product.price,
        quantity: product.price < 10_000 && random() < 0.45 ? 2 : 1,
      });
    }

    /* A third are guests. That ratio is the reason the screen exists: a guest
       basket has no account to email, only a basket to recover. */
    const guest = random() < 0.34;

    return {
      id: `CT-${700 + index}`,
      customerId: guest ? null : `CU-${2000 + Math.floor(random() * 46)}`,
      ...(guest ? { guestLabel: `Guest session ${700 + index}` } : {}),
      /* Hours, not days: half of these are still live baskets, which is what
         makes the abandoned count mean something. */
      updatedAt: daysAgo(random() ** 2 * 9),
      lines,
    } satisfies Cart;
  });

  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
};

const isCart = (value: unknown): value is Cart => {
  if (typeof value !== "object" || value === null) return false;
  const each = value as Record<string, unknown>;
  return (
    typeof each.id === "string" &&
    each.id.length > 0 &&
    Array.isArray(each.lines) &&
    typeof each.updatedAt === "string"
  );
};

const revive = (value: unknown): Cart[] | null => {
  if (!Array.isArray(value)) return null;
  const rows = value.filter(isCart);
  return rows.length ? rows : null;
};

export const carts = createStore(KEY, seed, revive);

/** The id the live basket is filed under. Fixed, so acting on it twice acts on
 *  the same row. */
export const LIVE_CART_ID = "CT-live";

/** Demo baskets, plus the one really open on this browser — that one first.
 *
 *  A hook rather than a plain read because the real basket changes underneath
 *  it: add something on a product page in another tab and this list has to grow
 *  a row without a reload. */
export const useCarts = (): Cart[] => {
  const seeded = carts.use();
  const { lines } = useCart();
  const { user } = useSession();

  return useMemo(() => {
    if (!lines.length) return seeded;

    const live: Cart = {
      id: LIVE_CART_ID,
      /* Attributed to the signed-in visitor when there is one, and to a guest
         otherwise — which is what an unauthenticated basket actually is. */
      customerId: user ? SESSION_CUSTOMER_ID : null,
      ...(user ? {} : { guestLabel: "Guest on this browser" }),
      /* The most recent touch, so the abandonment clock measures the last thing
         the shopper did rather than the first. */
      updatedAt: lines.reduce(
        (latest, line) => (line.addedAt > latest ? line.addedAt : latest),
        lines[0].addedAt,
      ),
      lines: lines.map((line) => ({
        slug: line.slug,
        /* The colour is part of what was chosen, so it belongs in the name the
           shopkeeper reads down the phone. */
        name: line.color ? `${line.name} (${line.color})` : line.name,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
      })),
    };

    return [live, ...seeded.filter((cart) => cart.id !== LIVE_CART_ID)];
  }, [seeded, lines, user]);
};

export const findCart = (id: string): Cart | undefined =>
  carts.read().find((cart) => cart.id === id);

/** Removes a basket at its source.
 *
 *  The live basket is not in this store — it is the shopper's own, read through
 *  `shared/libs/cart` — so filtering this list would drop the row for a render
 *  and then hand it straight back. It has to be emptied where it actually
 *  lives, which really does empty the basket on the shop. */
export const deleteCart = (id: string) => {
  if (id === LIVE_CART_ID) {
    clearLiveCart();
    return;
  }

  carts.update((current) => current.filter((cart) => cart.id !== id));
};

/** Clears the seeded abandoned baskets.
 *
 *  Deliberately leaves the live one alone even when it qualifies: "clear the
 *  abandoned demo rows" and "throw away a real shopper's basket" are different
 *  actions, and only the first is what this button offers. The live row can
 *  still be removed on its own. */
export const clearAbandoned = () => {
  carts.update((current) => current.filter((cart) => !isAbandoned(cart)));
};

export const resetCarts = () => carts.reset();

/* ------------------------------------------------------------- read models */

export const cartValue = (cart: Cart): number =>
  cart.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

export const cartUnits = (cart: Cart): number =>
  cart.lines.reduce((sum, line) => sum + line.quantity, 0);

export const hoursIdle = (cart: Cart): number =>
  (Date.now() - new Date(cart.updatedAt).getTime()) / 3_600_000;

export const isAbandoned = (cart: Cart): boolean =>
  hoursIdle(cart) >= ABANDONED_AFTER_HOURS;
