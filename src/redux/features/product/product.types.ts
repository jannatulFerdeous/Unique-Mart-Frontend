import type { Attribute } from "../attribute/attribute.types";
import type { CatalogStatus, Ref } from "../catalog/catalog.types";

export type AttributeValue = string | number | boolean | string[];

export type ProductAttribute = { attributeId: string; value: AttributeValue };

// On the single-product route variant attributes come back populated.
export type ProductVariant = {
  _id?: string;
  sku: string;
  attributes: { attributeId: Pick<Attribute, "_id" | "name" | "slug" | "type" | "options"> | string; value: AttributeValue }[];
  price: number;
  discount: number;
  stock: number;
};

// The single-product route swaps `attributes` for these, grouped by attribute group.
export type ProductSpecification = {
  group: Ref;
  attributes: { attribute: Pick<Attribute, "_id" | "name" | "slug" | "type">; value: AttributeValue }[];
};

// Mirrors the backend Product document. References come back populated
// on list and single-product routes.
export type Product = {
  _id: string;
  name: string;
  slug: string;
  // Simple products only; a product with variants has one SKU per variant.
  sku?: string;
  description: string | null;
  // Returned by the backend (populated on the single-product route); the admin
  // form never sends it, since the product validator doesn't accept it.
  brandId?: Ref | string;
  mainCategoryId: Ref | string;
  categoryId: Ref | string;
  subCategoryId: Ref | string | null;
  attributes?: ProductAttribute[];
  specifications?: ProductSpecification[];
  hasVariants: boolean;
  variants: ProductVariant[];
  images: { url: string; publicId: string | null }[];
  price: number;
  // An amount off the price (not a percentage), never more than the price.
  discount: number;
  stock: number;
  salesCount: number;
  isFeatured: boolean;
  isExclusive: boolean;
  isUpcoming: boolean;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductListParams = {
  page: number;
  limit: number;
  searchTerm?: string;
  // Slugs, not ids: that's what the backend's list filters take.
  mainCategory?: string;
  category?: string;
  featured?: "true";
};

export type VariantFields = {
  // Optional: left out, the backend makes one.
  sku?: string;
  attributes: ProductAttribute[];
  price: number;
  discount: number;
  stock: number;
};

// Exactly what the backend's product validator accepts (product.validation.ts).
export type ProductFields = {
  name: string;
  description: string;
  mainCategoryId: string;
  categoryId: string;
  // Optional: a product can sit directly in a category.
  subCategoryId?: string;
  sku?: string;
  brandId: string;
  attributes: ProductAttribute[];
  hasVariants: boolean;
  variants: VariantFields[];
  price: number;
  discount: number;
  stock: number;
  isFeatured: boolean;
  isExclusive: boolean;
  isUpcoming: boolean;
  status: CatalogStatus;
};

export type UpdateProductArgs = { id: string; changes: Partial<ProductFields> };

// Any new photos replace all current ones (backend behaviour).
// `keep`: the current photos that stay, in order, by publicId (or url). Without
// it the new photos replace them all.
export type UploadProductImagesArgs = { id: string; images: File[]; keep?: string[] };

export const salePrice = (item: Pick<Product, "price" | "discount">) => Math.max(0, item.price - item.discount);

// The product's own attribute values, whichever shape the route returned.
export const productAttributes = (product: Product): ProductAttribute[] =>
  product.attributes ??
  (product.specifications ?? []).flatMap((group) =>
    group.attributes.map(({ attribute, value }) => ({ attributeId: attribute._id, value })),
  );
