export type PaymentMethod = "bkash" | "nagad" | "card" | "bank" | "cod";

export type StoreSettings = {
  storeName: string;
  supportPhone: string;
  supportEmail: string;
  freeShippingFrom: number;
  shippingFlat: number;
  methods: { id: PaymentMethod; label: string; enabled: boolean }[];
  defaultReorderAt: number;
};
