export const SHIPPING_FLAT = 120;

export const FREE_SHIPPING_FROM = 50_000;

export const shippingFor = (subtotal: number): number =>
  subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
