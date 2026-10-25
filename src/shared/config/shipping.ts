import { BANGLADESH } from "./locations";

// Delivery charges, hardcoded. The backend charges the same rates
// (order.constant.ts in Unique-Mart-Backend); change both together. Every
// address pays the default unless its district is listed below.
export const DEFAULT_DELIVERY_CHARGE = 120;

// District (zila) → charge, only for districts that differ from the default.
// Names must match BD_DIVISIONS in locations.ts exactly.
export const DISTRICT_DELIVERY_CHARGES: Record<string, number> = {
  Dhaka: 60,
};

// Bangladesh addresses store their district as the city.
export const deliveryChargeFor = (address: { country: string; city: string }): number =>
  (address.country === BANGLADESH ? DISTRICT_DELIVERY_CHARGES[address.city] : undefined) ?? DEFAULT_DELIVERY_CHARGE;
