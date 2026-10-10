import type { AttributeType } from "@/redux/features/attribute/attribute.types";
import type { CatalogKind, CatalogStatus } from "@/redux/features/catalog/catalog.types";
import type { Tone } from "./types";

export const PRODUCTS_HREF = "/admin/products";
export const PRODUCTS_PAGE_SIZE = 10;

// Below this many in stock, a product is flagged as running low.
export const LOW_STOCK = 5;

export const CATALOG_STATUS_META: Record<CatalogStatus, { label: string; tone: Tone }> = {
  active: { label: "Active", tone: "good" },
  inactive: { label: "Inactive", tone: "neutral" },
};

// Copy per catalog kind. `hasLogo` and `parent` follow what each backend
// validator accepts: only main categories and brands take an upload.
export const CATALOG_COPY: Record<
  CatalogKind,
  {
    title: string;
    singular: string;
    href: string;
    blurb: string;
    hasLogo: boolean;
    parent?: { kind: CatalogKind; label: string; href: string };
  }
> = {
  mainCategory: {
    title: "Main categories",
    singular: "main category",
    href: "/admin/main-categories",
    blurb: "The top level of the shop, like Electronics or Fashion. Specs are set per main category.",
    hasLogo: true,
  },
  brand: {
    title: "Brands",
    singular: "brand",
    href: "/admin/brands",
    blurb: "Who makes what you sell.",
    hasLogo: true,
  },
  category: {
    title: "Categories",
    singular: "category",
    href: "/admin/categories",
    blurb: "Aisles inside a main category, like Phones or Watches inside Electronics.",
    hasLogo: false,
    parent: { kind: "mainCategory", label: "Main category", href: "/admin/main-categories" },
  },
  subCategory: {
    title: "Sub-categories",
    singular: "sub-category",
    href: "/admin/sub-categories",
    blurb: "Shelves inside a category, like iPhone inside Phones. Every product sits on one.",
    hasLogo: false,
    parent: { kind: "category", label: "Category", href: "/admin/categories" },
  },
};

// Same limits the backend validators enforce.
export const NAME_MIN = 2;
export const NAME_MAX = 100;
export const DESCRIPTION_MAX = 500;
// Multer's `upload.array("images", 5)` on the product routes.
export const PRODUCT_IMAGES_MAX = 5;
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/avif";

export const ATTRIBUTE_GROUPS_HREF = "/admin/attribute-groups";
export const ATTRIBUTES_HREF = "/admin/attributes";
export const MAIN_CATEGORIES_HREF = "/admin/main-categories";

export const ATTRIBUTE_TYPE_META: Record<AttributeType, { label: string; hint: string }> = {
  text: { label: "Text", hint: "Free text, like a model number." },
  number: { label: "Number", hint: "A figure, like battery size in mAh." },
  select: { label: "Pick one", hint: "One choice from a list, like Colour." },
  multi_select: { label: "Pick many", hint: "Several choices from a list, like Connectivity." },
  boolean: { label: "Yes / no", hint: "Either true or false, like Water resistant." },
};

export const ATTRIBUTE_TYPES = Object.keys(ATTRIBUTE_TYPE_META) as AttributeType[];

// Option values are stored lowercase by the backend.
export const optionValue = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const checkImageFile =(file: File): string | null => {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) return `${file.name}: choose a PNG, JPG, WebP or AVIF image.`;
  if (file.size > IMAGE_MAX_BYTES) return `${file.name} is over 5 MB. Choose a smaller one.`;
  return null;
};
