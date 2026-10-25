"use client";

import type { StaticImageData } from "next/image";
import { useGetAttributesQuery } from "@/redux/features/attribute/attributeApi";
import type { Attribute } from "@/redux/features/attribute/attribute.types";
import { useGetCartQuery } from "@/redux/features/cart/cartApi";
import type { CartItem } from "@/redux/features/cart/cart.types";
import { attributeLabel, productImage, valueLabels } from "./storefront/catalog";
import { useSignInFirst } from "./useSignInFirst";

// The backend checks stock on every change; this only stops the + button early.
export const MAX_QUANTITY = 99;

// One cart line as the basket and checkout draw it.
export type CartLine = {
  // The cart item's _id, which quantity changes and removal refer to.
  id: string;
  // The product's _id; null once it has been deleted.
  productId: string | null;
  slug: string | null;
  name: string;
  image: StaticImageData | null;
  // Variant choices, e.g. { Colour: "Black" }.
  options: Record<string, string>;
  // What one costs now, after the product's discount.
  unitPrice: number;
  compareAt?: number;
  quantity: number;
  stock: number;
  // The product or the chosen variant has been removed from the catalogue.
  missing: boolean;
};

const toLine = (item: CartItem, attributeById: Map<string, Attribute>): CartLine => {
  const product = item.productId;
  const variant = product?.hasVariants ? product.variants.find((each) => each._id === item.variantId) : undefined;
  const priced = variant ?? product;
  const missing = !product || (product.hasVariants && !variant);

  const options: Record<string, string> = {};
  for (const each of variant?.attributes ?? []) {
    const id = typeof each.attributeId === "string" ? each.attributeId : each.attributeId._id;
    const attribute = attributeById.get(id);
    if (!attribute) continue;
    options[attributeLabel(attribute.name)] = valueLabels(attribute, each.value).join(", ");
  }

  const discount = priced?.discount ?? 0;
  const listPrice = priced?.price ?? item.price;

  return {
    id: item._id,
    productId: product?._id ?? null,
    slug: product?.slug ?? null,
    name: product?.name ?? "A product that is no longer sold",
    image: product?.images[0]?.url ? productImage(product.images[0].url) : null,
    options,
    unitPrice: Math.max(0, listPrice - discount),
    compareAt: discount > 0 ? listPrice : undefined,
    quantity: item.quantity,
    // The cart route doesn't send a simple product's stock; the backend says when it runs out.
    stock: variant?.stock ?? MAX_QUANTITY,
    missing,
  };
};

export const lineTotal = (line: CartLine): number => line.unitPrice * line.quantity;

const EMPTY: CartLine[] = [];

// The signed-in shopper's cart on the backend. Guests have none.
export const useCart = () => {
  const { signedIn } = useSignInFirst();
  const query = useGetCartQuery(undefined, { skip: !signedIn });
  const items = signedIn ? (query.data?.items ?? []) : [];
  const hasVariants = items.some((item) => item.variantId);
  const attributes = useGetAttributesQuery(undefined, { skip: !hasVariants });

  const attributeById = new Map((attributes.data?.items ?? []).map((each) => [each._id, each]));
  const lines = items.length ? items.map((item) => toLine(item, attributeById)) : EMPTY;

  return {
    ...query,
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: lines.reduce((sum, line) => sum + lineTotal(line), 0),
  };
};

// For the header badge: no attribute lookup needed.
export const useCartCount = (): number => {
  const { signedIn } = useSignInFirst();
  const { data } = useGetCartQuery(undefined, { skip: !signedIn });
  return signedIn ? (data?.items ?? []).reduce((sum, item) => sum + item.quantity, 0) : 0;
};
