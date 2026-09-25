/* Store settings the portal can change.
 *
 * Deliberately small. Every field here is one the shop's own copy would read
 * from a settings API if it had one — the support phone number is in
 * `shared/config/site` and `footer`, the shipping threshold would be read at
 * checkout. Nothing on the storefront reads this store yet, and the settings
 * screen says so, but the fields are the real ones rather than invented knobs. */

import { createStore } from "./store";
import type { PaymentMethod, StoreSettings } from "./types";

const KEY = "unique-mart.admin.settings.v1";

/** The methods a Bangladeshi electronics shop actually takes. Order is the
 *  order checkout would offer them in. */
export const METHOD_LABELS: Record<PaymentMethod, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  card: "Card (Visa / Mastercard)",
  bank: "Bank transfer",
  cod: "Cash on delivery",
};

const seed = (): StoreSettings => ({
  storeName: "Unique Mart",
  supportPhone: "+880 1700-000000",
  supportEmail: "support@uniquemart.example",
  freeShippingFrom: 50_000,
  shippingFlat: 120,
  methods: [
    { id: "bkash", label: METHOD_LABELS.bkash, enabled: true },
    { id: "nagad", label: METHOD_LABELS.nagad, enabled: true },
    { id: "card", label: METHOD_LABELS.card, enabled: true },
    { id: "bank", label: METHOD_LABELS.bank, enabled: false },
    { id: "cod", label: METHOD_LABELS.cod, enabled: true },
  ],
  defaultReorderAt: 8,
});

const revive = (value: unknown): StoreSettings | null => {
  if (typeof value !== "object" || value === null) return null;
  const each = value as Record<string, unknown>;
  if (typeof each.storeName !== "string" || !Array.isArray(each.methods)) return null;
  // Missing fields fall back to the seed rather than rejecting the whole payload:
  // a settings object is one row, and losing all of it over one bad key is worse.
  return { ...seed(), ...(each as unknown as StoreSettings) };
};

export const settings = createStore(KEY, seed, revive);

export const useSettings = (): StoreSettings => settings.use();

export const saveSettings = (patch: Partial<StoreSettings>) => {
  settings.update((current) => ({ ...current, ...patch }));
};

export const toggleMethod = (id: PaymentMethod, enabled: boolean) => {
  settings.update((current) => ({
    ...current,
    methods: current.methods.map((method) =>
      method.id === id ? { ...method, enabled } : method,
    ),
  }));
};

export const resetSettings = () => settings.reset();
