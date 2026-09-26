export type ProductStatus = "live" | "draft" | "archived";

export type AdminProduct = {
  slug: string;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  compareAt?: number;
  rating?: number;
  badge?: string;
  stock: number;
  reorderAt: number;
  sku: string;
  status: ProductStatus;
  createdAt: string;
  imageUrl?: string;
  description?: string;
  fromCatalogue: boolean;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "bkash" | "nagad" | "card" | "bank" | "cod";

export type OrderItem = {
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type OrderPayment = {
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  paidAt?: string;
  refundedAt?: string;
};

export type Order = {
  id: string;
  customerId: string;
  placedAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment: OrderPayment;
  address: {
    line: string;
    city: string;
    district: string;
    phone: string;
  };
  note?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedAt: string;
  blocked: boolean;
};

export type CartLine = {
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type Cart = {
  id: string;
  customerId: string | null;
  guestLabel?: string;
  updatedAt: string;
  lines: CartLine[];
};

export type StoreSettings = {
  storeName: string;
  supportPhone: string;
  supportEmail: string;
  freeShippingFrom: number;
  shippingFlat: number;
  methods: { id: PaymentMethod; label: string; enabled: boolean }[];
  defaultReorderAt: number;
};
