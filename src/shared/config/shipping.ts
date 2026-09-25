/* What delivery costs.
 *
 * One file, because two screens quote it: the basket, which tells a shopper
 * what they will pay, and the admin portal's settings, which is where a
 * shopkeeper would change it. A number copied into both is a number that will
 * eventually disagree with itself, and the version the customer sees is the one
 * that becomes a complaint. */

/** Taka, on every order below the threshold. */
export const SHIPPING_FLAT = 120;

/** At or above this, delivery is free. */
export const FREE_SHIPPING_FROM = 50_000;

export const shippingFor = (subtotal: number): number =>
  subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
