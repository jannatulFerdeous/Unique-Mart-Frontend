import { createStore } from "./store";
import type { PaymentMethod, StoreSettings } from "./types";


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


export const settings = createStore(seed);

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

