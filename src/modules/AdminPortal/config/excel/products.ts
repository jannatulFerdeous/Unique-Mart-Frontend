import type { AppDispatch } from "@/redux/store";
import { attributeApi } from "@/redux/features/attribute/attributeApi";
import type { Attribute } from "@/redux/features/attribute/attribute.types";
import { catalogApi } from "@/redux/features/catalog/catalogApi";
import { refId, refName, type CatalogStatus } from "@/redux/features/catalog/catalog.types";
import { productApi } from "@/redux/features/product/productApi";
import type {
  AttributeValue,
  Product,
  ProductAttribute,
  ProductFields,
  ProductListParams,
  VariantFields,
} from "@/redux/features/product/product.types";
import { downloadSheet, fetchAllPages, fileDate, isYes, yesNo, type SheetColumn, type SheetRow } from "@/shared/libs/admin/excel";
import type { Importer, PlannedRow } from "../../components/ExcelActions";

// One sheet for single and variant products. A single product is one row; a
// product with variants is one row per variant, sharing its Name, with
// "Product type" = Variants and the variant's choices in "Variant options"
// ("Colour: Black; Storage: 128GB"). Brands and categories go by name.

const PAGE = 100;
const SINGLE = "Single";
const VARIANTS = "Variants";

const H = {
  name: "Name",
  type: "Product type",
  sku: "SKU",
  options: "Variant options",
  price: "Price (Tk)",
  discount: "Discount (Tk)",
  stock: "Stock",
  brand: "Brand",
  main: "Main category",
  category: "Category",
  sub: "Sub-category",
  status: "Status",
  featured: "Featured",
  exclusive: "Exclusive",
  upcoming: "Coming soon",
  description: "Description",
  slug: "Slug",
} as const;

type Refs = {
  brands: { _id: string; name: string }[];
  mains: { _id: string; name: string }[];
  categories: { _id: string; name: string; mainCategoryId: unknown }[];
  subs: { _id: string; name: string; categoryId: unknown }[];
  attributes: Attribute[];
};

const fetchRefs = async (dispatch: AppDispatch): Promise<Refs> => {
  const get = <T>(thunk: { unwrap: () => Promise<T> }) => thunk.unwrap();
  const options = { subscribe: false, forceRefetch: true } as const;
  const [brands, mains, categories, subs, attributes] = await Promise.all([
    get(dispatch(catalogApi.endpoints.getBrands.initiate({ status: "active" }, options))),
    get(dispatch(catalogApi.endpoints.getMainCategories.initiate({ status: "active" }, options))),
    get(dispatch(catalogApi.endpoints.getCategories.initiate({ status: "active" }, options))),
    get(dispatch(catalogApi.endpoints.getSubCategories.initiate({ status: "active" }, options))),
    get(dispatch(attributeApi.endpoints.getAttributes.initiate(undefined, options))),
  ]);
  return { brands: brands.items, mains: mains.items, categories: categories.items, subs: subs.items, attributes: attributes.items };
};

const fetchAllProducts = (dispatch: AppDispatch, filters: Omit<ProductListParams, "page" | "limit"> = {}) =>
  fetchAllPages(
    async (page) =>
      (
        await dispatch(
          productApi.endpoints.getProducts.initiate({ ...filters, page, limit: PAGE }, { subscribe: false, forceRefetch: true }),
        ).unwrap()
      ).items,
    PAGE,
  );

// ---------------------------------------------------------------------------
// Download

type ProductRow = { product: Product; variant?: Product["variants"][number] };

const named = (refs: Refs, list: keyof Pick<Refs, "brands" | "mains" | "categories" | "subs">, ref: unknown) =>
  refName(ref as never) ?? refs[list].find((each) => each._id === refId(ref as never))?.name ?? "";

// "Colour: Black; Storage: 128GB", with option labels rather than stored values.
const optionsText = (refs: Refs, variant: NonNullable<ProductRow["variant"]>) =>
  variant.attributes
    .map(({ attributeId, value }) => {
      const id = typeof attributeId === "string" ? attributeId : attributeId._id;
      const attribute = refs.attributes.find((each) => each._id === id) ?? (typeof attributeId === "object" ? attributeId : undefined);
      const label = (raw: string) => attribute?.options?.find((option) => option.value === raw)?.label ?? raw;
      const shown = Array.isArray(value) ? value.map(label).join(", ") : typeof value === "boolean" ? yesNo(value) : label(String(value));
      return `${attribute?.name ?? id}: ${shown}`;
    })
    .join("; ");

const columns = (refs: Refs): SheetColumn<ProductRow>[] => [
  { header: H.name, width: 36, value: ({ product }) => product.name },
  { header: H.type, width: 13, value: ({ product }) => (product.hasVariants ? VARIANTS : SINGLE) },
  { header: H.sku, width: 18, value: ({ product, variant }) => (variant ? variant.sku : product.sku) },
  { header: H.options, width: 30, value: ({ variant }) => (variant ? optionsText(refs, variant) : "") },
  { header: H.price, width: 11, value: ({ product, variant }) => (variant ?? product).price },
  { header: H.discount, width: 13, value: ({ product, variant }) => (variant ?? product).discount },
  { header: H.stock, width: 8, value: ({ product, variant }) => (variant ?? product).stock },
  { header: H.brand, width: 16, value: ({ product }) => named(refs, "brands", product.brandId) },
  { header: H.main, width: 20, value: ({ product }) => named(refs, "mains", product.mainCategoryId) },
  { header: H.category, width: 20, value: ({ product }) => named(refs, "categories", product.categoryId) },
  { header: H.sub, width: 20, value: ({ product }) => named(refs, "subs", product.subCategoryId) },
  { header: H.status, width: 10, value: ({ product }) => (product.status === "active" ? "Active" : "Inactive") },
  { header: H.featured, width: 10, value: ({ product }) => yesNo(product.isFeatured) },
  { header: H.exclusive, width: 10, value: ({ product }) => yesNo(product.isExclusive) },
  { header: H.upcoming, width: 12, value: ({ product }) => yesNo(product.isUpcoming) },
  { header: H.description, width: 40, value: ({ product }) => product.description ?? "" },
  { header: H.slug, width: 30, value: ({ product }) => product.slug },
];

export async function downloadProducts(dispatch: AppDispatch, filters: Omit<ProductListParams, "page" | "limit">) {
  const [refs, products] = await Promise.all([fetchRefs(dispatch), fetchAllProducts(dispatch, filters)]);
  const rows = products.flatMap((product): ProductRow[] =>
    product.hasVariants && product.variants.length ? product.variants.map((variant) => ({ product, variant })) : [{ product }],
  );
  await downloadSheet(`products-${fileDate()}.xlsx`, "Products", columns(refs), rows);
}

// ---------------------------------------------------------------------------
// Upload

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
const findByName = <T extends { name: string }>(list: T[], name: string) => list.find((each) => same(each.name, name));

const toNumber = (text: string) => (text === "" ? NaN : Number(text.replace(/,/g, "")));
const isMoney = (value: number) => Number.isFinite(value) && value >= 0;
const isCount = (value: number) => Number.isInteger(value) && value >= 0;

// The product-level part of a row (or of a variant group's first row).
type Base = Omit<ProductFields, "attributes" | "hasVariants" | "variants" | "price" | "discount" | "stock" | "sku">;

const readBase = (refs: Refs, cells: Record<string, string>): Base | string => {
  const name = cells[H.name] ?? "";
  if (!name) return "Name is empty.";
  const brand = findByName(refs.brands, cells[H.brand] ?? "");
  if (!brand) return `Brand “${cells[H.brand] || "(empty)"}” isn't in the shop. Add it under Brands first.`;
  const main = findByName(refs.mains, cells[H.main] ?? "");
  if (!main) return `Main category “${cells[H.main] || "(empty)"}” isn't in the shop.`;
  const category = refs.categories.find((each) => same(each.name, cells[H.category] ?? "") && refId(each.mainCategoryId as never) === main._id);
  if (!category) return `Category “${cells[H.category] || "(empty)"}” isn't under ${main.name}.`;
  let subCategoryId: string | undefined;
  if (cells[H.sub]) {
    const sub = refs.subs.find((each) => same(each.name, cells[H.sub]) && refId(each.categoryId as never) === category._id);
    if (!sub) return `Sub-category “${cells[H.sub]}” isn't under ${category.name}.`;
    subCategoryId = sub._id;
  }
  const statusText = (cells[H.status] ?? "").toLowerCase();
  const status: CatalogStatus = statusText === "inactive" ? "inactive" : "active";

  return {
    name,
    description: cells[H.description] ?? "",
    brandId: brand._id,
    mainCategoryId: main._id,
    categoryId: category._id,
    ...(subCategoryId ? { subCategoryId } : {}),
    status,
    isFeatured: isYes(cells[H.featured] ?? ""),
    isExclusive: isYes(cells[H.exclusive] ?? ""),
    isUpcoming: isYes(cells[H.upcoming] ?? ""),
  };
};

const readPricing = (cells: Record<string, string>) => {
  const price = toNumber(cells[H.price] ?? "");
  const discount = cells[H.discount] ? toNumber(cells[H.discount]) : 0;
  const stock = toNumber(cells[H.stock] ?? "");
  if (!isMoney(price)) return "Price must be a number, 0 or more.";
  if (!isMoney(discount)) return "Discount must be a number, 0 or more.";
  if (discount > price) return "Discount can't be more than the price.";
  if (!isCount(stock)) return "Stock must be a whole number, 0 or more.";
  return { price, discount, stock };
};

// "Colour: Black; Storage: 128GB" → attribute values, by attribute name and option label.
const readOptions = (refs: Refs, mainCategoryId: string, text: string): ProductAttribute[] | string => {
  if (!text) return "Variant options are empty (e.g. “Colour: Black; Storage: 128GB”).";
  const forMain = refs.attributes.filter((each) =>
    each.mainCategoryIds.some((id) => (typeof id === "string" ? id : id._id) === mainCategoryId),
  );
  const result: ProductAttribute[] = [];
  for (const part of text.split(";").map((each) => each.trim()).filter(Boolean)) {
    const colon = part.indexOf(":");
    if (colon < 1) return `“${part}” should look like “Colour: Black”.`;
    const name = part.slice(0, colon).trim();
    const raw = part.slice(colon + 1).trim();
    const attribute = findByName(forMain, name) ?? findByName(refs.attributes, name);
    if (!attribute) return `There's no “${name}” attribute.`;
    const option = (label: string) =>
      attribute.options?.find((each) => same(each.label, label) || same(each.value, label))?.value;
    let value: AttributeValue;
    if (attribute.type === "select") {
      const found = option(raw);
      if (!found) return `“${raw}” isn't a ${attribute.name} choice.`;
      value = found;
    } else if (attribute.type === "multi_select") {
      const picks = raw.split(",").map((each) => each.trim()).filter(Boolean).map(option);
      if (picks.some((each) => !each)) return `Some of “${raw}” aren't ${attribute.name} choices.`;
      value = picks as string[];
    } else if (attribute.type === "number") {
      value = toNumber(raw);
      if (!Number.isFinite(value)) return `${attribute.name} must be a number.`;
    } else if (attribute.type === "boolean") {
      value = isYes(raw);
    } else {
      value = raw;
    }
    result.push({ attributeId: attribute._id, value });
  }
  return result;
};

// The listing price of a variant product: its cheapest variant, and all the stock (as the form does).
const listing = (variants: VariantFields[]) => {
  const cheapest = variants.reduce((best, each) => (each.price - each.discount < best.price - best.discount ? each : best));
  return { price: cheapest.price, discount: cheapest.discount, stock: variants.reduce((sum, each) => sum + each.stock, 0) };
};

// Product-level fields that differ from the product as it is.
const baseChanges = (base: Base, product: Product) => {
  const changes: Partial<ProductFields> = {};
  const notes: string[] = [];
  const change = <K extends keyof ProductFields>(key: K, value: ProductFields[K], note: string) => {
    changes[key] = value;
    notes.push(note);
  };

  if (base.name !== product.name) change("name", base.name, "name");
  if (base.description !== (product.description ?? "")) change("description", base.description, "description");
  if (base.brandId !== refId(product.brandId as never)) change("brandId", base.brandId, "brand");
  if (
    base.mainCategoryId !== refId(product.mainCategoryId as never) ||
    base.categoryId !== refId(product.categoryId as never) ||
    (base.subCategoryId ?? "") !== refId(product.subCategoryId as never)
  ) {
    Object.assign(changes, { mainCategoryId: base.mainCategoryId, categoryId: base.categoryId });
    if (base.subCategoryId) changes.subCategoryId = base.subCategoryId;
    notes.push("categories");
  }
  if (base.status !== product.status) change("status", base.status, `status ${base.status}`);
  if (base.isFeatured !== product.isFeatured) change("isFeatured", base.isFeatured, "featured");
  if (base.isExclusive !== product.isExclusive) change("isExclusive", base.isExclusive, "exclusive");
  if (base.isUpcoming !== product.isUpcoming) change("isUpcoming", base.isUpcoming, "coming soon");
  return { changes, notes };
};

const money = (value: number) => value.toLocaleString("en-IN");

export const productImporter = (dispatch: AppDispatch): Importer => ({
  noun: "products",
  help:
    "Add or update products. A row whose SKU matches a product updates it; otherwise it's added. For a product with variants, give each variant its own row with the same Name, “Product type” = Variants and “Variant options” like “Colour: Black; Storage: 128GB”. Brand and categories go by name, as in the shop. Photos aren't in the sheet: add them in the product form.",
  template: async () => {
    const example: { [key: string]: string | number }[] = [
      { [H.name]: "Spigen Rugged Armor Case", [H.type]: SINGLE, [H.sku]: "SPG-RA-17", [H.price]: 2499, [H.discount]: 200, [H.stock]: 25, [H.brand]: "Spigen", [H.main]: "Cases & Protectors", [H.category]: "Apple", [H.sub]: "iPhone 17 (Cases & Protectors)", [H.status]: "Active", [H.featured]: "No", [H.exclusive]: "No", [H.upcoming]: "No" },
      { [H.name]: "Galaxy Watch 8", [H.type]: VARIANTS, [H.sku]: "GW8-40-SLV", [H.options]: "Dial Size: 40mm; Colour: Silver", [H.price]: 27499, [H.discount]: 1500, [H.stock]: 10, [H.brand]: "Samsung", [H.main]: "Watches", [H.category]: "Smart Watch", [H.sub]: "Samsung", [H.status]: "Active", [H.featured]: "Yes", [H.exclusive]: "No", [H.upcoming]: "No" },
      { [H.name]: "Galaxy Watch 8", [H.type]: VARIANTS, [H.sku]: "GW8-44-GRA", [H.options]: "Dial Size: 44mm; Colour: Graphite", [H.price]: 29999, [H.discount]: 1500, [H.stock]: 6, [H.brand]: "Samsung", [H.main]: "Watches", [H.category]: "Smart Watch", [H.sub]: "Samsung", [H.status]: "Active", [H.featured]: "Yes", [H.exclusive]: "No", [H.upcoming]: "No" },
    ];
    const headers = Object.values(H).filter((header) => header !== H.slug);
    await downloadSheet(
      "products-template.xlsx",
      "Products",
      headers.map((header) => ({ header, width: header === H.name ? 30 : 16, value: (row: (typeof example)[number]) => row[header] ?? "" })),
      example,
    );
  },
  plan: async (rows: SheetRow[]) => {
    const [refs, products] = await Promise.all([fetchRefs(dispatch), fetchAllProducts(dispatch)]);
    const bySku = new Map(products.filter((each) => each.sku).map((each) => [each.sku!.toUpperCase(), each]));
    const byVariantSku = new Map(products.flatMap((each) => each.variants.map((variant) => [variant.sku.toUpperCase(), each] as const)));
    const plan: PlannedRow[] = [];

    // Single products, row by row.
    for (const { row, cells } of rows.filter(({ cells }) => !same(cells[H.type] ?? "", VARIANTS))) {
      const label = cells[H.name] || cells[H.sku] || "(no name)";
      const base = readBase(refs, cells);
      if (typeof base === "string") {
        plan.push({ row, label, action: "skip", error: base });
        continue;
      }
      const pricing = readPricing(cells);
      if (typeof pricing === "string") {
        plan.push({ row, label, action: "skip", error: pricing });
        continue;
      }
      const sku = (cells[H.sku] ?? "").toUpperCase();
      const existing = sku ? bySku.get(sku) : undefined;

      if (!existing) {
        if (sku && byVariantSku.has(sku)) {
          plan.push({ row, label, action: "skip", error: `SKU ${sku} belongs to a variant of “${byVariantSku.get(sku)!.name}”.` });
          continue;
        }
        const fields: ProductFields = { ...base, ...pricing, ...(sku ? { sku } : {}), attributes: [], hasVariants: false, variants: [] };
        plan.push({
          row,
          label,
          action: "create",
          detail: `Tk ${money(pricing.price - pricing.discount)} · ${pricing.stock} in stock${sku ? "" : " · SKU made automatically"}`,
          apply: () => dispatch(productApi.endpoints.createProduct.initiate(fields)).unwrap(),
        });
        continue;
      }

      const { changes, notes } = baseChanges(base, existing);
      if (pricing.price !== existing.price || pricing.discount !== existing.discount) {
        Object.assign(changes, { price: pricing.price, discount: pricing.discount });
        notes.unshift(`price Tk ${money(existing.price - existing.discount)} → ${money(pricing.price - pricing.discount)}`);
      }
      if (pricing.stock !== existing.stock) {
        changes.stock = pricing.stock;
        notes.push(`stock ${existing.stock} → ${pricing.stock}`);
      }
      if (!Object.keys(changes).length) {
        plan.push({ row, label, action: "skip", detail: "Same as in the shop" });
        continue;
      }
      plan.push({
        row,
        label,
        action: "update",
        detail: notes.join(", "),
        apply: () => dispatch(productApi.endpoints.updateProduct.initiate({ id: existing._id, changes })).unwrap(),
      });
    }

    // Variant products: rows grouped by Name.
    const groups = new Map<string, SheetRow[]>();
    for (const sheetRow of rows.filter(({ cells }) => same(cells[H.type] ?? "", VARIANTS))) {
      const key = (sheetRow.cells[H.name] ?? "").trim().toLowerCase();
      groups.set(key, [...(groups.get(key) ?? []), sheetRow]);
    }

    for (const group of groups.values()) {
      const first = group[0];
      const label = `${first.cells[H.name] || "(no name)"} (${group.length} variant${group.length === 1 ? "" : "s"})`;
      const fail = (error: string, row = first.row) => plan.push({ row, label, action: "skip", error });

      const base = readBase(refs, first.cells);
      if (typeof base === "string") {
        fail(base);
        continue;
      }

      const variants: VariantFields[] = [];
      const seenSkus = new Set<string>();
      let problem: { error: string; row: number } | null = null;
      for (const { row, cells } of group) {
        const pricing = readPricing(cells);
        if (typeof pricing === "string") {
          problem = { error: `Row ${row}: ${pricing}`, row };
          break;
        }
        const attributes = readOptions(refs, base.mainCategoryId, cells[H.options] ?? "");
        if (typeof attributes === "string") {
          problem = { error: `Row ${row}: ${attributes}`, row };
          break;
        }
        const sku = (cells[H.sku] ?? "").toUpperCase();
        if (sku && seenSkus.has(sku)) {
          problem = { error: `Row ${row}: SKU ${sku} is used twice.`, row };
          break;
        }
        if (sku) seenSkus.add(sku);
        variants.push({ ...(sku ? { sku } : {}), attributes, ...pricing });
      }
      if (problem) {
        fail(problem.error, problem.row);
        continue;
      }

      // The same product: one with variants, by any of these SKUs or by name.
      const existing =
        [...seenSkus].map((sku) => byVariantSku.get(sku)).find(Boolean) ??
        products.find((each) => each.hasVariants && same(each.name, base.name));
      const price = listing(variants);

      if (!existing) {
        const fields: ProductFields = { ...base, ...price, attributes: [], hasVariants: true, variants };
        plan.push({
          row: first.row,
          label,
          action: "create",
          detail: `${variants.length} variants · from Tk ${money(price.price - price.discount)}`,
          apply: () => dispatch(productApi.endpoints.createProduct.initiate(fields)).unwrap(),
        });
        continue;
      }

      const { changes, notes } = baseChanges(base, existing);
      const asIs = (list: { sku?: string; price: number; discount: number; stock: number; attributes: unknown[] }[]) =>
        JSON.stringify(
          list
            .map((each) => ({ sku: each.sku ?? "", price: each.price, discount: each.discount, stock: each.stock, n: each.attributes.length }))
            .sort((a, b) => a.sku.localeCompare(b.sku)),
        );
      if (!existing.hasVariants || asIs(variants) !== asIs(existing.variants) || variants.some((each) => !each.sku)) {
        Object.assign(changes, { hasVariants: true, variants, ...price });
        notes.unshift(`${variants.length} variants`);
      }
      if (!Object.keys(changes).length) {
        plan.push({ row: first.row, label, action: "skip", detail: "Same as in the shop" });
        continue;
      }
      plan.push({
        row: first.row,
        label,
        action: "update",
        detail: notes.join(", "),
        apply: () => dispatch(productApi.endpoints.updateProduct.initiate({ id: existing._id, changes })).unwrap(),
      });
    }

    return plan.sort((a, b) => a.row - b.row);
  },
});
