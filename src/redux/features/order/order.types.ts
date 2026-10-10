import type { ApiMeta } from "../../api/types";

// Mirror the backend enum in `order.constant.ts`.
export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

// A copy of the product taken when the order was placed.
export type OrderItem = {
  _id: string;
  productId: string;
  name: string;
  sku: string;
  image: string | null;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
};

export type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
};

// Mirrors the backend Order document.
export type Order = {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;
  couponCode: string | null;
  shippingAddressId: string;
  shippingAddress: ShippingAddress;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type OrderListParams = { page: number; limit: number; orderStatus?: OrderStatus };

export type OrderList = { items: Order[]; meta: ApiMeta };

// Mirrors the backend `createOrderValidationSchema`. The backend accepts a
// coupon code but doesn't apply it yet, so the checkout doesn't send one.
export type CreateOrderArgs = { shippingAddressId: string };
