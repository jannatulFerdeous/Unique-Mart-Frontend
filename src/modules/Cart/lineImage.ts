import type { StaticImageData } from "next/image";
import { findProduct } from "@/shared/config/products";
import { findProductDetail } from "@/shared/config/product-details";
import type { CartLine } from "@/shared/libs/cart";

export const lineImage = (line: CartLine): StaticImageData | null =>
  (line.color
    ? findProductDetail(line.slug)?.colors?.find((option) => option.name === line.color)?.image
    : undefined) ??
  findProduct(line.slug)?.image ??
  null;

export const lineLabel = (line: CartLine): string =>
  [line.name, line.color, ...Object.values(line.options ?? {})].filter(Boolean).join(" · ");
