import type { StaticImageData } from "next/image";
import { findProduct } from "@/shared/config/products";
import { findProductDetail } from "@/shared/config/product-details";
import type { CartLine } from "@/shared/libs/cart";

/** The picture for a basket line: the chosen colour's shot where the catalogue
 *  has one, the product's default shot otherwise.
 *
 *  Shared by the list and the order summary so the two cannot disagree. They
 *  did, briefly — the summary showed the default shot beside a line the list
 *  pictured in blue, which is the same defect the reference site ships. */
export const lineImage = (line: CartLine): StaticImageData | null =>
  (line.color
    ? findProductDetail(line.slug)?.colors?.find((option) => option.name === line.color)?.image
    : undefined) ??
  findProduct(line.slug)?.image ??
  null;

/** "iPhone 17 · Mist Blue" — what a line is, in one string, for places too
 *  tight for the full variant list. */
export const lineLabel = (line: CartLine): string =>
  [line.name, line.color, ...Object.values(line.options ?? {})].filter(Boolean).join(" · ");
