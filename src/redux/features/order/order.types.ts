import type { ApiMeta } from "../../api/types";
import type { PaymentMethod } from "../payment/payment.types";

// Mirror the backend enum in `order.constant.ts`.
export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

// A copy of the product taken when the order was placed.
export type OrderItem = {
  _id: string;
  productId: string;
  variantId?: string;
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
  couponId: string | null;
  couponCode: string | null;
  shippingAddressId: string;
  shippingAddress: ShippingAddress;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type OrderListParams = { page: number; limit: number; orderStatus?: OrderStatus };

export type OrderList = { items: Order[]; meta: ApiMeta };

// Who placed an order, as the staff routes return it. Null if the account is gone.
export type OrderCustomer = { _id: string; name: string; email?: string; phone?: string };

// An order from the staff routes (GET /order/admin, /order/admin/:id).
export type StaffOrder = Order & { userId: OrderCustomer | string | null };

export type StaffOrderList = { items: StaffOrder[]; meta: ApiMeta };

// Mirrors the backend `createOrderValidationSchema`. The backend accepts a
// coupon code but doesn't apply it yet, so the checkout doesn't send one.
// `cod` also records a pending cash-on-delivery payment; no method means online.
export type CreateOrderArgs = { shippingAddressId: string; couponCode?: string; paymentMethod?: PaymentMethod };

// Mirrors the backend `updateOrderStatusValidationSchema` (staff only).
export type UpdateOrderStatusArgs = { id: string; orderStatus: OrderStatus };
