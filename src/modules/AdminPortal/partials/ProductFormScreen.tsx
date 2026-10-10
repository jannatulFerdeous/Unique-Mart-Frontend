"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Sparkles, Trash2 } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useGetAttributeGroupsQuery, useGetAttributesQuery } from "@/redux/features/attribute/attributeApi";
import type { Attribute } from "@/redux/features/attribute/attribute.types";
import {
  useGetCategoriesQuery,
  useGetMainCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/redux/features/catalog/catalogApi";
import { refId, type CatalogStatus } from "@/redux/features/catalog/catalog.types";
import { clearNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
} from "@/redux/features/product/productApi";
import {
  productAttributes,
  salePrice,
  type Product,
  type ProductAttribute,
  type ProductFields,
  type VariantFields,
} from "@/redux/features/product/product.types";
import { useAppDispatch } from "@/redux/hooks";
import { formatMoney } from "@/shared/libs/admin/format";
import { cn } from "@/shared/utils/cn";
import { AttributeInput, toDraft, toValue, type Draft } from "../components/AttributeInput";
import { Button, ButtonLink } from "../components/Button";
import { ChoiceChips } from "../components/ChoiceChips";
import { Field, Input, Select, Textarea } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { Table, TableScroll, Td, Th } from "../components/Table";
import {
  ATTRIBUTES_HREF,
  IMAGE_ACCEPT,
  PRODUCTS_HREF,
  PRODUCT_IMAGES_MAX,
  checkImageFile,
} from "../config/catalog";

// "Add every combination" stops short of flooding the table.
const MAX_COMBINATIONS = 60;

// `slug` given → edit that product; no `slug` → add a new one.
export function ProductFormScreen({ slug }: { slug?: string }) {
  const dispatch = useAppDispatch();
  const editing = slug !== undefined;
  const { data: product, isLoading, isError, error, refetch } = useGetProductQuery(slug ?? "", {
    skip: !editing,
  });

  // Opening a form starts a fresh visit; drop any old list message.
  useEffect(() => {
    dispatch(clearNotice());
  }, [dispatch]);

  return (
    <>
      <ScreenHeader
        title={editing ? "Edit product" : "Add product"}
        blurb={
          editing
            ? "Change details, specs, variants, price, stock, photos or where it's filed."
            : "File it under a main category first: that decides which specs and variants it can have."
        }
        actions={
          <ButtonLink href={PRODUCTS_HREF}>
            <ArrowLeft className="size-4" aria-hidden />
            All products
          </ButtonLink>
        }
      />

      {editing && isLoading ? (
        <Panel>
          <EmptyState title="Loading…" />
        </Panel>
      ) : editing && isError ? (
        <Panel>
          <EmptyState
            title="Couldn't load this product"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        </Panel>
      ) : (
        <ProductForm key={product?._id ?? "new"} product={editing ? product : undefined} />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Form state: everything as the inputs hold it, converted on submit.

type VariantRow = {
  key: number;
  sku: string;
  price: string;
  discount: string;
  stock: string;
  values: Record<string, Draft>;
};

type Drafts = {
  specs: Record<string, Draft>;
  hasVariants: boolean;
  variantAttributeIds: string[];
  variants: VariantRow[];
};

let rowKey = 0;

const emptyRow = (values: Record<string, Draft> = {}, sku = ""): VariantRow => ({
  key: rowKey++,
  sku,
  price: "",
  discount: "0",
  stock: "",
  values,
});

const draftsFrom = (product?: Product): Drafts => {
  if (!product) return { specs: {}, hasVariants: false, variantAttributeIds: [], variants: [emptyRow()] };

  const specs = Object.fromEntries(productAttributes(product).map((each) => [each.attributeId, toDraft(each.value)]));
  const variantAttributeIds = [
    ...new Set(product.variants.flatMap((variant) => variant.attributes.map((each) => refId(each.attributeId)))),
  ];
  const variants = product.variants.map((variant) => ({
    key: rowKey++,
    sku: variant.sku,
    price: String(variant.price),
    discount: String(variant.discount ?? 0),
    stock: String(variant.stock),
    values: Object.fromEntries(variant.attributes.map((each) => [refId(each.attributeId), toDraft(each.value)])),
  }));

  return {
    specs,
    hasVariants: product.hasVariants,
    variantAttributeIds,
    variants: variants.length ? variants : [emptyRow()],
  };
};

const toNumber = (value: string) => (value.trim() === "" ? NaN : Number(value));

const isMoney = (value: number) => Number.isFinite(value) && value >= 0;
const isCount = (value: number) => Number.isInteger(value) && value >= 0;

const skuPart = (text: string, length = 12) => text.replace(/[^a-z0-9]/gi, "").slice(0, length).toUpperCase();

const suggestSku = (name: string, parts: string[]) =>
  [skuPart(name, 6), ...parts.map((part) => skuPart(part))].filter(Boolean).join("-");

// Converts the attribute drafts that have a known definition; the rest are dropped.
const specValues = (specs: Record<string, Draft>, byId: Map<string, Attribute>) => {
  const values: ProductAttribute[] = [];
  const errors: Record<string, string> = {};
  for (const attribute of byId.values()) {
    const value = toValue(attribute, specs[attribute._id]);
    if (value === null) errors[attribute._id] = "Enter a number.";
    else if (value === undefined) {
      if (attribute.isRequired) errors[attribute._id] = "Required for this main category.";
    } else values.push({ attributeId: attribute._id, value });
  }
  return { values, errors };
};

const variantValues = (rows: VariantRow[], ids: string[], byId: Map<string, Attribute>) => {
  const variants: VariantFields[] = [];
  let error: string | undefined;
  const skus = new Set<string>();
  const combos = new Set<string>();

  rows.forEach((row, index) => {
    const label = `Variant ${index + 1}`;
    const attributes: ProductAttribute[] = [];
    for (const id of ids) {
      const attribute = byId.get(id);
      if (!attribute) continue;
      const value = toValue(attribute, row.values[id]);
      if (value === null) error ??= `${label}: ${attribute.name} must be a number.`;
      else if (value === undefined) error ??= `${label}: choose a ${attribute.name.toLowerCase()}.`;
      else attributes.push({ attributeId: id, value });
    }
    const sku = row.sku.trim().toUpperCase();
    const price = toNumber(row.price);
    const discount = toNumber(row.discount || "0");
    const stock = toNumber(row.stock);

    if (!sku) error ??= `${label}: enter a SKU.`;
    else if (skus.has(sku)) error ??= `${label}: SKU ${sku} is used twice.`;
    if (!isMoney(price)) error ??= `${label}: enter a price of 0 or more.`;
    if (!isMoney(discount)) error ??= `${label}: enter a discount of 0 or more.`;
    else if (isMoney(price) && discount > price) error ??= `${label}: the discount can't be more than the price.`;
    if (!isCount(stock)) error ??= `${label}: enter stock as a whole number of 0 or more.`;

    const combo = JSON.stringify(attributes.map((each) => each.value));
    if (attributes.length && combos.has(combo)) error ??= `${label} repeats another variant's options.`;

    skus.add(sku);
    combos.add(combo);
    variants.push({ sku, attributes, price, discount, stock });
  });

  if (ids.length === 0) error ??= "Choose at least one attribute the variants differ by.";
  return { variants, error };
};

// The shop lists a variant product at its cheapest variant, with all its stock.
const listingFrom = (variants: VariantFields[]) => {
  const priced = variants.filter((each) => isMoney(each.price) && isMoney(each.discount));
  const cheapest = priced.reduce<VariantFields | null>(
    (best, each) => (!best || salePrice(each) < salePrice(best) ? each : best),
    null,
  );
  const stock = variants.reduce((sum, each) => sum + (isCount(each.stock) ? each.stock : 0), 0);
  return { price: cheapest?.price ?? 0, discount: cheapest?.discount ?? 0, stock };
};

function usePickedFiles() {
  const [picked, setPicked] = useState<{ file: File; url: string }[]>([]);
  const current = useRef(picked);

  useEffect(() => {
    current.current = picked;
  }, [picked]);

  useEffect(
    () => () => {
      for (const each of current.current) URL.revokeObjectURL(each.url);
    },
    [],
  );

  const replace = (files: File[]) => {
    setPicked((previous) => {
      for (const each of previous) URL.revokeObjectURL(each.url);
      return files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    });
  };

  return [picked, replace] as const;
}

// The plain fields; `sku`, price and stock are only used for a single-version product.
type Base = Omit<ProductFields, "attributes" | "hasVariants" | "variants" | "sku"> & { sku: string };

type Errors = Partial<
  Record<
    | "name"
    | "mainCategoryId"
    | "categoryId"
    | "subCategoryId"
    | "sku"
    | "price"
    | "discount"
    | "stock"
    | "variants"
    | "images"
    | "specs"
    | "submit",
    string
  >
> & { spec?: Record<string, string> };

// ---------------------------------------------------------------------------

function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [create, { isLoading: creating }] = useCreateProductMutation();
  const [update, { isLoading: updating }] = useUpdateProductMutation();
  const [upload, { isLoading: uploading }] = useUploadProductImagesMutation();

  const [initial] = useState(() => draftsFrom(product));

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [mainCategoryId, setMainCategoryId] = useState(product ? refId(product.mainCategoryId) : "");
  const [categoryId, setCategoryId] = useState(product ? refId(product.categoryId) : "");
  const [subCategoryId, setSubCategoryId] = useState(product ? refId(product.subCategoryId) : "");
  const [specs, setSpecs] = useState(initial.specs);
  const [hasVariants, setHasVariants] = useState(initial.hasVariants);
  const [variantAttributeIds, setVariantAttributeIds] = useState(initial.variantAttributeIds);
  const [variants, setVariants] = useState(initial.variants);
  const [sku, setSku] = useState(product?.sku ?? "");
  const [price, setPrice] = useState(product && !product.hasVariants ? String(product.price) : "");
  const [discount, setDiscount] = useState(product && !product.hasVariants ? String(product.discount) : "0");
  const [stock, setStock] = useState(product && !product.hasVariants ? String(product.stock) : "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isExclusive, setIsExclusive] = useState(product?.isExclusive ?? false);
  const [isUpcoming, setIsUpcoming] = useState(product?.isUpcoming ?? false);
  const [status, setStatus] = useState<CatalogStatus>(product?.status ?? "active");
  const [photos, setPhotos] = usePickedFiles();
  const [errors, setErrors] = useState<Errors>({});

  const saving = creating || updating || uploading;

  const mainCategories = useGetMainCategoriesQuery({ status: "active" });
  const categories = useGetCategoriesQuery({ status: "active" });
  const subCategories = useGetSubCategoriesQuery({ status: "active" });
  const groups = useGetAttributeGroupsQuery();
  const attributes = useGetAttributesQuery(
    { status: "active", mainCategoryIds: mainCategoryId },
    { skip: !mainCategoryId },
  );

  const aisles = useMemo(
    () => (categories.data?.items ?? []).filter((each) => refId(each.mainCategoryId) === mainCategoryId),
    [categories.data, mainCategoryId],
  );
  const shelves = useMemo(
    () => (subCategories.data?.items ?? []).filter((each) => refId(each.categoryId) === categoryId),
    [subCategories.data, categoryId],
  );

  // Only attributes of the chosen main category can be filled in.
  const applicable = useMemo(() => (mainCategoryId ? (attributes.data?.items ?? []) : []), [attributes.data, mainCategoryId]);
  const byId = useMemo(() => new Map(applicable.map((each) => [each._id, each])), [applicable]);

  const grouped = useMemo(() => {
    const names = new Map((groups.data?.items ?? []).map((each) => [each._id, each.name]));
    const buckets = new Map<string, { name: string; attributes: Attribute[] }>();
    for (const attribute of applicable) {
      const bucket = buckets.get(attribute.groupId) ?? { name: names.get(attribute.groupId) ?? "Other", attributes: [] };
      bucket.attributes.push(attribute);
      buckets.set(attribute.groupId, bucket);
    }
    return [...buckets.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [applicable, groups.data]);

  // Variants differ by pick-one attributes (plus any other kind a saved product already uses).
  const variantChoices = applicable.filter(
    (each) => each.type === "select" || initial.variantAttributeIds.includes(each._id),
  );
  const variantColumns = variantAttributeIds.map((id) => byId.get(id)).filter((each): each is Attribute => Boolean(each));

  const combinations = useMemo(() => {
    if (variantColumns.length === 0 || variantColumns.some((each) => each.type !== "select")) return null;
    return variantColumns.reduce((total, each) => total * (each.options?.length ?? 0), 1);
  }, [variantColumns]);

  const built = variantValues(variants, variantAttributeIds, byId);
  const listing = listingFrom(built.variants);

  const priceValue = toNumber(price);
  const discountValue = toNumber(discount || "0");
  const sale = isMoney(priceValue) && isMoney(discountValue) ? priceValue - discountValue : null;

  const chooseMainCategory = (id: string) => {
    setMainCategoryId(id);
    setCategoryId("");
    setSubCategoryId("");
    // Specs and variant options belong to the main category; start them over.
    setSpecs({});
    setVariantAttributeIds([]);
    setVariants((rows) => rows.map((row) => ({ ...row, values: {} })));
  };

  const editRow = (key: number, change: Partial<Omit<VariantRow, "key">>) =>
    setVariants((rows) => rows.map((row) => (row.key === key ? { ...row, ...change } : row)));

  const addCombinations = () => {
    const lists = variantColumns.map((attribute) =>
      (attribute.options ?? []).map((option) => ({ id: attribute._id, option })),
    );
    const everySet = lists.reduce<{ id: string; option: { label: string; value: string } }[][]>(
      (sets, list) => sets.flatMap((set) => list.map((item) => [...set, item])),
      [[]],
    );
    setVariants((rows) => {
      const seen = new Set(rows.map((row) => JSON.stringify(variantAttributeIds.map((id) => row.values[id] ?? ""))));
      const template = rows.find((row) => row.price !== "");
      const kept = rows.filter((row) => Object.values(row.values).some((value) => value.length) || row.sku);
      const added = everySet
        .map((set) => {
          const values = Object.fromEntries(set.map((item) => [item.id, item.option.value]));
          return { set, values };
        })
        .filter(({ values }) => !seen.has(JSON.stringify(variantAttributeIds.map((id) => values[id] ?? ""))))
        .map(({ set, values }) => ({
          ...emptyRow(values, suggestSku(name, set.map((item) => item.option.value))),
          price: template?.price ?? "",
          discount: template?.discount ?? "0",
        }));
      return [...kept, ...added];
    });
  };

  const pickPhotos = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    const problem =
      files.length > PRODUCT_IMAGES_MAX
        ? `Choose up to ${PRODUCT_IMAGES_MAX} photos.`
        : (files.map(checkImageFile).find(Boolean) ?? null);
    setErrors((current) => ({ ...current, images: problem ?? undefined }));
    setPhotos(problem ? [] : files);
  };

  // Everything the form says, in the validator's shape. A variant product
  // has no SKU of its own and takes its price and stock from the variants.
  const collect = (drafts: Drafts, base: Base) => {
    const spec = specValues(drafts.specs, byId);
    const variant = variantValues(drafts.variants, drafts.variantAttributeIds, byId);
    const { sku: baseSku, ...rest } = base;
    const fields: ProductFields = {
      ...rest,
      ...(drafts.hasVariants ? listingFrom(variant.variants) : { sku: baseSku }),
      attributes: spec.values,
      hasVariants: drafts.hasVariants,
      variants: drafts.hasVariants ? variant.variants : [],
    };
    return { fields, spec, variant };
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedSku = sku.trim().toUpperCase();
    const stockValue = toNumber(stock);
    const { fields, spec, variant } = collect(
      { specs, hasVariants, variantAttributeIds, variants },
      {
        name: name.trim(),
        description: description.trim(),
        mainCategoryId,
        categoryId,
        subCategoryId,
        sku: trimmedSku,
        price: priceValue,
        discount: discountValue,
        stock: stockValue,
        isFeatured,
        isExclusive,
        isUpcoming,
        status,
      },
    );

    const next: Errors = {
      name: fields.name ? undefined : "Give the product a name.",
      mainCategoryId: mainCategoryId ? undefined : "Choose a main category.",
      categoryId: categoryId ? undefined : "Choose a category.",
      subCategoryId: subCategoryId ? undefined : "Choose a sub-category.",
      sku: hasVariants || trimmedSku ? undefined : "Enter a SKU.",
      price: hasVariants || isMoney(priceValue) ? undefined : "Enter a price of 0 or more.",
      discount:
        hasVariants
          ? undefined
          : !isMoney(discountValue)
            ? "Enter a discount of 0 or more."
            : isMoney(priceValue) && discountValue > priceValue
              ? "The discount can't be more than the price."
              : undefined,
      stock: hasVariants || isCount(stockValue) ? undefined : "Enter a whole number of 0 or more.",
      variants: hasVariants ? variant.error : undefined,
      specs: Object.keys(spec.errors).length ? "Some specs need attention." : undefined,
      spec: spec.errors,
      images: errors.images,
    };
    setErrors(next);
    const { spec: specErrors, ...rest } = next;
    if (Object.values(rest).some(Boolean) || Object.keys(specErrors ?? {}).length) return;

    try {
      let saved: Product;
      if (product) {
        const { fields: before } = collect(initial, {
          name: product.name,
          description: product.description ?? "",
          mainCategoryId: refId(product.mainCategoryId),
          categoryId: refId(product.categoryId),
          subCategoryId: refId(product.subCategoryId),
          sku: product.sku ?? "",
          price: product.price,
          discount: product.discount,
          stock: product.stock,
          isFeatured: product.isFeatured,
          isExclusive: product.isExclusive,
          isUpcoming: product.isUpcoming,
          status: product.status,
        });
        const changes: Partial<ProductFields> = {};
        for (const key of Object.keys(fields) as (keyof ProductFields)[]) {
          if (JSON.stringify(fields[key]) !== JSON.stringify(before[key])) Object.assign(changes, { [key]: fields[key] });
        }
        // Keep what the backend checks together, together.
        if ("price" in changes || "discount" in changes) Object.assign(changes, { price: fields.price, discount: fields.discount });
        if ("hasVariants" in changes || "variants" in changes) {
          Object.assign(changes, { hasVariants: fields.hasVariants, variants: fields.variants });
          if (!fields.hasVariants) changes.sku = fields.sku;
        }

        saved = Object.keys(changes).length ? await update({ id: product._id, changes }).unwrap() : product;
      } else {
        saved = await create(fields).unwrap();
      }

      if (photos.length) {
        try {
          saved = await upload({ id: saved._id, images: photos.map((each) => each.file) }).unwrap();
        } catch (problem) {
          dispatch(
            showNotice({
              scope: "products",
              tone: "danger",
              text: `${fields.name} was saved, but its photos didn't upload: ${apiErrorMessage(problem)}`,
            }),
          );
          router.push(`${PRODUCTS_HREF}/${saved.slug}/edit`);
          return;
        }
      }

      dispatch(showNotice({ scope: "products", tone: "good", text: `${fields.name} ${product ? "saved" : "added"}.` }));
      router.push(PRODUCTS_HREF);
    } catch (problem) {
      setErrors({ submit: apiErrorMessage(problem) });
    }
  };

  const current = product?.images ?? [];
  const specError = errors.spec ?? {};

  return (
    <form onSubmit={submit} noValidate className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex min-w-0 flex-col gap-5">
        <Panel title="Details">
          <fieldset disabled={saving} className="flex min-w-0 flex-col gap-4">
            <legend className="sr-only">Details</legend>
            <Field label="Product name" hint="The shop's web address for it is made from the name." error={errors.name}>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="iPhone 17 Pro Max" />
            </Field>
            <Field label="Description" hint="Optional.">
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-36" />
            </Field>
          </fieldset>
        </Panel>

        <Panel
          title="Specifications"
          description={
            mainCategoryId
              ? "Leave a spec empty to skip it. Required ones must be filled in."
              : "Choose a main category to see the specs it uses."
          }
        >
          <fieldset disabled={saving || !mainCategoryId} className="flex min-w-0 flex-col gap-5">
            <legend className="sr-only">Specifications</legend>
            {!mainCategoryId ? (
              <p className="text-sm text-ink-subtle">No main category chosen yet.</p>
            ) : attributes.isLoading ? (
              <p className="text-sm text-ink-subtle">Loading specs…</p>
            ) : grouped.length === 0 ? (
              <p className="text-sm text-ink-muted">
                This main category has no attributes yet.{" "}
                <Link href={ATTRIBUTES_HREF} className="font-medium text-tertiary hover:underline">
                  Add some under Attributes
                </Link>
                .
              </p>
            ) : (
              grouped.map((group) => (
                <fieldset key={group.name} className="min-w-0">
                  <legend className="mb-3 text-xs font-semibold tracking-wide text-ink-muted uppercase">{group.name}</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {group.attributes.map((attribute) => (
                      <div key={attribute._id} className={cn(attribute.type === "multi_select" && "sm:col-span-2")}>
                        <AttributeInput
                          attribute={attribute}
                          value={specs[attribute._id]}
                          onChange={(value) => setSpecs((current) => ({ ...current, [attribute._id]: value }))}
                          error={specError[attribute._id]}
                        />
                      </div>
                    ))}
                  </div>
                </fieldset>
              ))
            )}
            {errors.specs && (
              <p role="alert" className="text-xs text-danger">
                {errors.specs}
              </p>
            )}
          </fieldset>
        </Panel>

        {hasVariants && (
          <Panel
            title="Variants"
            description="Each variant is a version shoppers can pick, with its own SKU, price and stock."
          >
            <fieldset disabled={saving || !mainCategoryId} className="flex min-w-0 flex-col gap-4">
              <legend className="sr-only">Variants</legend>
              <ChoiceChips
                legend="Variants differ by"
                options={variantChoices.map((each) => ({ value: each._id, label: each.name }))}
                value={variantAttributeIds}
                onChange={setVariantAttributeIds}
                empty={
                  mainCategoryId
                    ? "This main category has no attributes that can tell variants apart."
                    : "Choose a main category first."
                }
              />

              {variantColumns.length > 0 && (
                <>
                  <TableScroll>
                    <Table className="min-w-3xl">
                      <caption className="sr-only">Variants</caption>
                      <thead>
                        <tr>
                          <Th className="w-10">#</Th>
                          {variantColumns.map((attribute) => (
                            <Th key={attribute._id} className="min-w-32">
                              {attribute.name}
                            </Th>
                          ))}
                          <Th className="min-w-36">SKU</Th>
                          <Th className="w-28">Price</Th>
                          <Th className="w-24">Discount</Th>
                          <Th className="w-24">Stock</Th>
                          <Th className="w-12">
                            <span className="sr-only">Remove</span>
                          </Th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((row, index) => (
                          <tr key={row.key}>
                            <Td className="px-2 text-ink-subtle tabular-nums">{index + 1}</Td>
                            {variantColumns.map((attribute) => (
                              <Td key={attribute._id} className="px-2">
                                <AttributeInput
                                  compact
                                  attribute={attribute}
                                  value={row.values[attribute._id]}
                                  onChange={(value) => editRow(row.key, { values: { ...row.values, [attribute._id]: value } })}
                                />
                              </Td>
                            ))}
                            <Td className="px-2">
                              <Input
                                aria-label={`Variant ${index + 1} SKU`}
                                value={row.sku}
                                onChange={(event) => editRow(row.key, { sku: event.target.value })}
                                className="px-2 py-1.5 font-mono text-xs uppercase"
                              />
                            </Td>
                            <Td className="px-2">
                              <Input
                                aria-label={`Variant ${index + 1} price`}
                                type="number"
                                inputMode="decimal"
                                min={0}
                                value={row.price}
                                onChange={(event) => editRow(row.key, { price: event.target.value })}
                                className="px-2 py-1.5"
                              />
                            </Td>
                            <Td className="px-2">
                              <Input
                                aria-label={`Variant ${index + 1} discount`}
                                type="number"
                                inputMode="decimal"
                                min={0}
                                value={row.discount}
                                onChange={(event) => editRow(row.key, { discount: event.target.value })}
                                className="px-2 py-1.5"
                              />
                            </Td>
                            <Td className="px-2">
                              <Input
                                aria-label={`Variant ${index + 1} stock`}
                                type="number"
                                inputMode="numeric"
                                min={0}
                                step={1}
                                value={row.stock}
                                onChange={(event) => editRow(row.key, { stock: event.target.value })}
                                className="px-2 py-1.5"
                              />
                            </Td>
                            <Td className="px-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label={`Remove variant ${index + 1}`}
                                disabled={variants.length === 1}
                                onClick={() => setVariants((rows) => rows.filter((each) => each.key !== row.key))}
                              >
                                <Trash2 className="size-3.5" aria-hidden />
                              </Button>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableScroll>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={() => setVariants((rows) => [...rows, emptyRow()])}>
                      <Plus className="size-3.5" aria-hidden />
                      Add variant
                    </Button>
                    {combinations !== null && combinations > 0 && combinations <= MAX_COMBINATIONS && (
                      <Button size="sm" onClick={addCombinations}>
                        <Sparkles className="size-3.5" aria-hidden />
                        Add every combination ({combinations})
                      </Button>
                    )}
                    <p className="text-xs text-ink-subtle">Discount is an amount off, not a percentage. SKUs are saved in capitals.</p>
                  </div>
                </>
              )}

              {errors.variants && (
                <p role="alert" className="text-sm text-danger">
                  {errors.variants}
                </p>
              )}
            </fieldset>
          </Panel>
        )}

        <Panel
          title="Photos"
          description={
            product && current.length
              ? `Optional. Choosing new photos replaces ${current.length === 1 ? "the current photo" : `all ${current.length} current photos`}. Up to ${PRODUCT_IMAGES_MAX}.`
              : `Optional. Up to ${PRODUCT_IMAGES_MAX}; the first one is the main photo in the shop.`
          }
        >
          <fieldset disabled={saving} className="flex min-w-0 flex-col gap-3">
            <legend className="sr-only">Photos</legend>
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {(photos.length ? photos.map((each) => each.url) : current.map((each) => each.url)).map((url, index) => (
                <li key={url} className="relative aspect-square overflow-hidden rounded-control border border-line bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-contain" />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 rounded-control bg-inverse px-1.5 py-0.5 text-[10px] font-medium text-ink-inverse">
                      Main
                    </span>
                  )}
                </li>
              ))}
              {photos.length === 0 && current.length === 0 && (
                <li className="col-span-full grid h-24 place-items-center rounded-control border border-dashed border-line-strong text-sm text-ink-subtle">
                  No photos yet
                </li>
              )}
            </ul>
            <Field
              label={product && current.length ? "Replace photos" : "Choose photos"}
              hint="PNG, JPG, WebP or AVIF, up to 5 MB each."
              error={errors.images}
            >
              <input
                type="file"
                accept={IMAGE_ACCEPT}
                multiple
                onChange={(event) => pickPhotos(event.target.files)}
                className="block w-full text-sm text-ink-muted file:mr-3 file:cursor-pointer file:rounded-control file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-surface-muted"
              />
            </Field>
          </fieldset>
        </Panel>
      </div>

      <div className="flex min-w-0 flex-col gap-5">
        <Panel title="Filed under">
          <fieldset disabled={saving} className="flex min-w-0 flex-col gap-4">
            <legend className="sr-only">Categories</legend>
            <Field
              label="Main category"
              hint={product ? "Changing it clears the specs and variant options." : undefined}
              error={errors.mainCategoryId}
            >
              <Select value={mainCategoryId} onChange={(event) => chooseMainCategory(event.target.value)}>
                <option value="">Choose a main category</option>
                {mainCategories.data?.items.map((each) => (
                  <option key={each._id} value={each._id}>
                    {each.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Category"
              hint={mainCategoryId && aisles.length === 0 ? "This main category has no active categories yet." : undefined}
              error={errors.categoryId}
            >
              <Select
                value={categoryId}
                disabled={!mainCategoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setSubCategoryId("");
                }}
              >
                <option value="">{mainCategoryId ? "Choose a category" : "Choose a main category first"}</option>
                {aisles.map((each) => (
                  <option key={each._id} value={each._id}>
                    {each.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Sub-category"
              hint={categoryId && shelves.length === 0 ? "This category has no active sub-categories yet." : undefined}
              error={errors.subCategoryId}
            >
              <Select value={subCategoryId} disabled={!categoryId} onChange={(event) => setSubCategoryId(event.target.value)}>
                <option value="">{categoryId ? "Choose a sub-category" : "Choose a category first"}</option>
                {shelves.map((each) => (
                  <option key={each._id} value={each._id}>
                    {each.name}
                  </option>
                ))}
              </Select>
            </Field>
          </fieldset>
        </Panel>

        <Panel title="Pricing & stock">
          <fieldset disabled={saving} className="flex min-w-0 flex-col gap-4">
            <legend className="sr-only">Pricing and stock</legend>

            <div role="radiogroup" aria-label="How it's sold" className="grid grid-cols-2 gap-1 rounded-control border border-line bg-surface p-1">
              {([false, true] as const).map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  role="radio"
                  aria-checked={hasVariants === value}
                  onClick={() => setHasVariants(value)}
                  className={cn(
                    "rounded-control px-3 py-1.5 text-sm font-medium transition-colors",
                    hasVariants === value ? "bg-inverse text-ink-inverse" : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                  )}
                >
                  {value ? "Has variants" : "Single version"}
                </button>
              ))}
            </div>

            {hasVariants ? (
              <dl className="grid grid-cols-2 gap-3 rounded-control bg-surface-muted px-3 py-3 text-sm">
                <div>
                  <dt className="text-xs text-ink-muted">Shop price from</dt>
                  <dd className="font-medium text-ink tabular-nums">{formatMoney(salePrice(listing))}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Total stock</dt>
                  <dd className="font-medium text-ink tabular-nums">{listing.stock}</dd>
                </div>
                <p className="col-span-2 text-xs text-ink-subtle">
                  Taken from the variants: the cheapest one sets the listed price.
                </p>
              </dl>
            ) : (
              <>
                <Field label="SKU" hint="Your stock code. Saved in capitals." error={errors.sku}>
                  <Input value={sku} onChange={(event) => setSku(event.target.value)} className="font-mono uppercase" />
                </Field>
                <Field label="Price (Tk)" error={errors.price}>
                  <Input type="number" inputMode="decimal" min={0} value={price} onChange={(event) => setPrice(event.target.value)} />
                </Field>
                <Field
                  label="Discount (Tk off)"
                  hint={sale !== null && sale >= 0 ? `Customers pay ${formatMoney(sale)}.` : "An amount, not a percentage."}
                  error={errors.discount}
                >
                  <Input type="number" inputMode="decimal" min={0} value={discount} onChange={(event) => setDiscount(event.target.value)} />
                </Field>
                <Field label="In stock" error={errors.stock}>
                  <Input type="number" inputMode="numeric" min={0} step={1} value={stock} onChange={(event) => setStock(event.target.value)} />
                </Field>
              </>
            )}
          </fieldset>
        </Panel>

        <Panel title="Visibility">
          <fieldset disabled={saving} className="flex min-w-0 flex-col gap-4">
            <legend className="sr-only">Visibility</legend>
            <Field label="Status" hint="Inactive products are hidden from the shop.">
              <Select value={status} onChange={(event) => setStatus(event.target.value as CatalogStatus)}>
                <option value="active">Active: in the shop</option>
                <option value="inactive">Inactive: hidden</option>
              </Select>
            </Field>
            {(
              [
                ["Featured", "Shown in featured spots on the homepage.", isFeatured, setIsFeatured],
                ["Exclusive", "Marked as a shop exclusive.", isExclusive, setIsExclusive],
                ["Coming soon", "Listed as upcoming, not yet on sale.", isUpcoming, setIsUpcoming],
              ] as const
            ).map(([label, hint, checked, set]) => (
              <label key={label} className="flex items-start gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => set(event.target.checked)}
                  className="mt-0.5 size-4 accent-tertiary"
                />
                <span>
                  {label}
                  <span className="block text-xs text-ink-subtle">{hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </Panel>

        {errors.submit && (
          <p role="alert" className="text-sm font-medium text-danger">
            {errors.submit}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <ButtonLink href={PRODUCTS_HREF}>Cancel</ButtonLink>
          <Button type="submit" variant="primary" disabled={saving}>
            {uploading ? "Uploading photos…" : saving ? "Saving…" : product ? "Save changes" : "Add product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
