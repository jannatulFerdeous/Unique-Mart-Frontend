import type { Product, ProductVariant } from "../product/product.types";

// What GET /cart populates on each line's product. `null` once the product
// has been deleted from the catalogue.
export type CartProduct = Pick<Product, "_id" | "name" | "slug" | "price" | "discount" | "images" | "hasVariants"> & {
  variants: ProductVariant[];
};

// Mirrors the backend cart item. `price` is the list price when the line was
// last touched (before any discount).
export type CartItem = {
  _id: string;
  productId: CartProduct | null;
  variantId?: string | null;
  quantity: number;
  price: number;
};

export type Cart = {
  _id?: string;
  items: CartItem[];
};

// Mirrors the backend `addToCartValidationSchema`.
export type AddToCartArgs = {
  productId: string;
  variantId?: string;
  quantity: number;
};

export type UpdateCartItemArgs = { itemId: string; quantity: number };
