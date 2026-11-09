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

// The rates in a sentence, for policy and help copy: "Tk 60 inside Dhaka and
// Tk 120 everywhere else". Built from the table so the words follow the rates.
const districtRates = Object.entries(DISTRICT_DELIVERY_CHARGES).map(
  ([district, charge]) => `Tk ${charge} inside ${district}`,
);
const otherRate = `Tk ${DEFAULT_DELIVERY_CHARGE} everywhere else`;
export const deliveryChargeSummary = districtRates.length
  ? `${districtRates.join(", ")} and ${otherRate}`
  : `Tk ${DEFAULT_DELIVERY_CHARGE} anywhere in the country`;

// Bangladesh addresses store their district as the city.
export const deliveryChargeFor = (address: { country: string; city: string }): number =>
  (address.country === BANGLADESH ? DISTRICT_DELIVERY_CHARGES[address.city] : undefined) ?? DEFAULT_DELIVERY_CHARGE;
