// Mirror the backend enums in `userAddress.constant.ts`.
export const ADDRESS_LABELS = ["home", "office", "other"] as const;

export type AddressLabel = (typeof ADDRESS_LABELS)[number];

// Mirrors the backend UserAddress document.
export type Address = {
  _id: string;
  label: AddressLabel;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

// Mirrors the backend `createUserAddressValidationSchema`.
export type AddressFields = Pick<
  Address,
  "label" | "fullName" | "phone" | "address" | "city" | "country" | "postalCode" | "isDefault"
>;

export type SaveAddressArgs = { id?: string; fields: Partial<AddressFields> };

// The validator's length limits, so the form catches them first.
export const ADDRESS_LIMITS = {
  fullName: { min: 2, max: 100 },
  phone: { min: 7, max: 20 },
  address: { min: 5, max: 300 },
  city: { min: 2, max: 100 },
  country: { min: 2, max: 100 },
  postalCode: { min: 2, max: 20 },
} as const;
