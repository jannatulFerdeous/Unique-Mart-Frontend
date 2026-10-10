// Main categories, brands, categories and sub-categories share one shape in
// the backend: name, auto slug, optional description, active/inactive status.
// Only main categories and brands carry a logo; categories hang off a main
// category and sub-categories off a category.

export type CatalogStatus = "active" | "inactive";

export type CatalogImage = { url: string | null; publicId: string | null } | null;

export type Ref = { _id: string; name: string; slug: string };

type CatalogBase = {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type MainCategory = CatalogBase & {
  logo: CatalogImage;
  isFeatured: boolean;
  isShowNavbar: boolean;
};

export type Brand = CatalogBase & { logo: CatalogImage };

// `mainCategoryId` / `categoryId` come back populated on lists, as a plain id elsewhere.
export type Category = CatalogBase & { mainCategoryId: Ref | string };

export type SubCategory = CatalogBase & { categoryId: Ref | string };

export type CatalogItem = MainCategory | Brand | Category | SubCategory;

export type CatalogKind = "mainCategory" | "brand" | "category" | "subCategory";

export type CatalogListParams = { status: CatalogStatus };

export type CatalogFields = {
  name?: string;
  description?: string;
  status?: CatalogStatus;
  mainCategoryId?: string;
  categoryId?: string;
};

export type SaveCatalogArgs = {
  id?: string;
  fields: CatalogFields;
  logo?: File;
};

export const refId = (ref: Ref | string | null | undefined): string =>
  !ref ? "" : typeof ref === "string" ? ref : ref._id;

export const refName = (ref: Ref | string | null | undefined): string | null =>
  !ref || typeof ref === "string" ? null : ref.name;

export const catalogLogo = (item: CatalogItem): string | null =>
  "logo" in item ? (item.logo?.url ?? null) : null;

// The id of the level above: main category for a category, category for a sub-category.
export const parentId = (item: CatalogItem): string =>
  "mainCategoryId" in item ? refId(item.mainCategoryId) : "categoryId" in item ? refId(item.categoryId) : "";
