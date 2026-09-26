import { allProducts } from "@/shared/config/products";
import { createStore, daysAgo, rng } from "./store";
import type { Cart, CartLine } from "./types";

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

    const guest = random() < 0.34;

    return {
      id: `CT-${700 + index}`,
      customerId: guest ? null : `CU-${2000 + Math.floor(random() * 46)}`,
      ...(guest ? { guestLabel: `Guest session ${700 + index}` } : {}),
      updatedAt: daysAgo(random() ** 2 * 9),
      lines,
    } satisfies Cart;
  });

  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
};

export const carts = createStore(seed);

export const useCarts = (): Cart[] => carts.use();

export const cartValue = (cart: Cart): number =>
  cart.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

export const cartUnits = (cart: Cart): number =>
  cart.lines.reduce((sum, line) => sum + line.quantity, 0);

export const hoursIdle = (cart: Cart): number =>
  (Date.now() - new Date(cart.updatedAt).getTime()) / 3_600_000;

export const isAbandoned = (cart: Cart): boolean =>
  hoursIdle(cart) >= ABANDONED_AFTER_HOURS;
