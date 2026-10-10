import type { CatalogStatus, Ref } from "../catalog/catalog.types";

// Mirrors the backend attribute-group and attribute modules. Both are tied to
// one or more main categories; `mainCategoryIds` comes back populated.

export type AttributeGroup = {
  _id: string;
  name: string;
  slug: string;
  mainCategoryIds: (Ref | string)[];
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type AttributeType = "text" | "number" | "select" | "multi_select" | "boolean";

export type AttributeOption = { label: string; value: string };

export type Attribute = {
  _id: string;
  name: string;
  slug: string;
  type: AttributeType;
  groupId: string;
  mainCategoryIds: (Ref | string)[];
  options?: AttributeOption[];
  isFilterable: boolean;
  isRequired: boolean;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

// Every filter is optional: these lists use the backend's plain exact-match filter.
export type AttributeListParams = {
  status?: CatalogStatus;
  mainCategoryIds?: string;
  groupId?: string;
  type?: AttributeType;
};

export type AttributeGroupFields = {
  name?: string;
  mainCategoryIds?: string[];
  status?: CatalogStatus;
};

export type AttributeFields = {
  name?: string;
  type?: AttributeType;
  groupId?: string;
  mainCategoryIds?: string[];
  options?: AttributeOption[];
  isFilterable?: boolean;
  isRequired?: boolean;
  status?: CatalogStatus;
};

export type SaveArgs<Fields> = { id?: string; fields: Fields };

export const hasOptions = (type: AttributeType) => type === "select" || type === "multi_select";
