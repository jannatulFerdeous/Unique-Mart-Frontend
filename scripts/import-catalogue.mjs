// Imports the scraped catalogue (.cache/catalogue, written by
// scrape-catalogue.mjs) into the backend through its public API, using the
// same contracts as the admin forms.
//
//   node scripts/import-catalogue.mjs                    plan only, writes nothing
//   node scripts/import-catalogue.mjs --apply catalog    brands, categories, specs
//   node scripts/import-catalogue.mjs --apply products   products and their photos
//
// Re-runnable: anything that already exists (matched by slug) is reused, and a
// product whose slug exists is skipped. API base comes from --api, then
// NEXT_PUBLIC_API_BASE_URL in .env.local.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, ".cache/catalogue");
const RAW = path.join(CACHE, "raw");
const DOWNLOADS = path.join(CACHE, "images");

const args = process.argv.slice(2);
const flag = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const APPLY = flag("--apply"); // "catalog" | "products" | undefined
if (APPLY && !["catalog", "products"].includes(APPLY)) {
  console.error('--apply takes "catalog" or "products"');
  process.exit(1);
}

const envApi = () => {
  const file = path.join(ROOT, ".env.local");
  if (!existsSync(file)) return undefined;
  return readFileSync(file, "utf8").match(/^NEXT_PUBLIC_API_BASE_URL=(.+)$/m)?.[1]?.trim();
};
const API = flag("--api") ?? envApi() ?? "http://localhost:5000/api/v1";

// ---------------------------------------------------------------------------
// Text helpers (same cleaning as scrape-catalogue.mjs)

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", ndash: "–", mdash: "—", hellip: "…", trade: "™", reg: "®", deg: "°", times: "×", middot: "·" };

const decode = (value) =>
  String(value ?? "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (whole, name) => ENTITIES[name.toLowerCase()] ?? whole);

const text = (html) =>
  decode(String(html ?? "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""))
    .replace(/[^\S\n]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .trim();

const oneLine = (html) => text(html).replace(/\s*\n\s*/g, " ").trim();

// Mentions of the source shop, and warranty promises that aren't ours to make.
const BANNED =
  /gadget\s*(?:&|and)\s*gear|gadgetandgear|\bg&g\b|authoriz|authoris|warrant|showroom|outlet|best price|cheapest|lowest price|official (?:store|reseller|retailer)|genuine|after-?sales/i;
const SPEC_BANNED = /warrant|guarantee/i;

// The backend's own slugify (src/app/utils/slugify.ts), so lookups match.
const slugify = (value) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

// The admin form's option value (AdminPortal/config/catalog.ts optionValue).
const optionValue = (label) =>
  label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const cacheName = (source) => source.replace(/[^a-zA-Z0-9._-]/g, "_");

const list = (value) =>
  String(value ?? "")
    .split(",")
    .map((each) => each.trim())
    .filter(Boolean);

// ---------------------------------------------------------------------------
// Reading the scrape

// Spec group titles in the source drift ("Main Feature" / "Main Features").
const GROUP_ALIASES = {
  "main feature": "Main Features",
  "network & amp; connectivity": "Network & Connectivity",
  "product specifications": "Product Specifications",
  "physical specifications": "Physical Specification",
};
const groupName = (title) => GROUP_ALIASES[title.toLowerCase()] ?? title;

// Variant option keys in the source, mapped to the attribute that holds them.
const VARIANT_KEYS = { color: "Colour", storage: "Storage", memory: "Storage", "dial size": "Dial Size", "strap size": "Strap Size" };

const MENU_ORDER = JSON.parse(readFileSync(path.join(CACHE, "menu.json"), "utf8")).map((each) => each.name);

// A model family for products filed only two levels deep, e.g.
// "Infinix Hot 70 (8/128GB)" → "Infinix Hot 70".
const family = (name) =>
  name
    .replace(/\(.*?\)/g, "")
    .replace(/\b\d+\s*\/\s*\d+\s*(GB|TB)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const parseSpecs = (specifications = []) => {
  const rows = [];
  let group = "Specification";
  for (const row of specifications) {
    if (row.isTitle) {
      group = groupName(oneLine(row.key) || oneLine(row.value));
      continue;
    }
    const label = oneLine(row.key);
    const value = text(row.value);
    if (!label || !value || SPEC_BANNED.test(group)) continue;
    if (SPEC_BANNED.test(label) || SPEC_BANNED.test(value) || BANNED.test(value)) continue;
    const lines = value.split(/\n|;\s+/).map((line) => line.trim()).filter(Boolean);
    if (lines.length) rows.push({ group, label, value: lines.join("; ") });
  }
  return rows;
};

const parseDescription = (product) => {
  const paragraphs = [...String(product.longDescription ?? "").matchAll(/<(h2|h3|h4|p|li)[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map(([, , inner]) => oneLine(inner))
    .filter((value) => value && !BANNED.test(value));
  if (paragraphs.length) return paragraphs.slice(1).join("\n\n") || paragraphs[0];
  return [...String(product.shortDescription ?? "").matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => oneLine(match[1]))
    .filter((value) => value && !BANNED.test(value))
    .join("\n");
};

const gallery = (product) => {
  const seen = new Set();
  for (const source of [...list(product.thumbnail), ...(product.skus ?? []).flatMap((sku) => list(sku.images))]) {
    seen.add(source);
  }
  return [...seen].map(cacheName).filter((file) => existsSync(path.join(DOWNLOADS, file)));
};

const money = (sku) => {
  const price = Number(sku.price) || 0;
  const paid = Number(sku.discountedPrice) || price;
  return { price, discount: Math.max(0, Math.min(price, price - paid)), stock: Math.max(0, Math.floor(Number(sku.stockQuantity) || 0)) };
};

const products = readdirSync(RAW)
  .filter((file) => file.endsWith(".json"))
  .sort()
  .map((file) => JSON.parse(readFileSync(path.join(RAW, file), "utf8")))
  .map((raw) => {
    const trail = raw.breadcrumbs.map((each) => oneLine(each.name));
    const name = oneLine(raw.name);
    return {
      raw,
      name,
      slug: slugify(name),
      main: trail[0],
      category: trail[1],
      sub: trail.length >= 3 ? trail[2] : family(name),
      brand: oneLine(raw.brand.name),
      specs: parseSpecs(raw.specifications),
      variants: (raw.skus ?? []).map((sku) => ({
        sku: String(sku.customSku || sku.sku).trim().toUpperCase(),
        options: (sku.attributes ?? []).map((each) => ({
          attribute: VARIANT_KEYS[oneLine(each.key).toLowerCase()],
          label: oneLine(each.value),
        })),
        ...money(sku),
      })),
      description: parseDescription(raw),
      images: gallery(raw).slice(0, 5),
      isFeatured: Boolean(raw.isFeatured),
      // The product-level `comingSoon` is stale in the source (set on in-stock
      // products); only call it upcoming when every SKU says so.
      isUpcoming: (raw.skus ?? []).length > 0 && raw.skus.every((sku) => sku.comingSoon),
    };
  })
  .sort((a, b) => MENU_ORDER.indexOf(a.main) - MENU_ORDER.indexOf(b.main) || a.name.localeCompare(b.name));

// ---------------------------------------------------------------------------
// API

const call = async (method, route, body) => {
  const init = { method, headers: {} };
  if (body instanceof FormData) init.body = body;
  else if (body !== undefined) {
    init.headers["content-type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  const response = await fetch(`${API}${route}`, init);
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.success === false) {
    const error = new Error(`${method} ${route} → ${response.status}: ${json.message ?? response.statusText}`);
    error.status = response.status;
    throw error;
  }
  return json;
};

const items = (json) => (Array.isArray(json.data) ? json.data : (json.data?.data ?? []));

// Some list routes filter on `status` even when it's missing, so ask for both.
const listAll = async (route) => {
  const found = new Map();
  for (const status of ["active", "inactive"]) {
    for (const each of items(await call("GET", `${route}?limit=1000&status=${status}`))) found.set(each._id, each);
  }
  return [...found.values()];
};

const refId = (ref) => (typeof ref === "string" ? ref : ref?._id);

// ---------------------------------------------------------------------------
// Plan: what the catalog needs, with names made unique the way the backend
// requires (category, sub-category and attribute names are unique store-wide).

const existing = {
  brands: await listAll("/brands"),
  mains: await listAll("/main-categories"),
  categories: await listAll("/categories"),
  subs: await listAll("/sub-categories"),
  groups: await listAll("/attribute-groups"),
  attributes: await listAll("/attributes"),
};

// Name for a node under `parentKey`; the first claimant (menu order) keeps the
// plain name, later ones get "(Main category)" appended.
const namer = (records, parentOf) => {
  const taken = new Map(records.map((each) => [each.slug, parentOf(each)]));
  const chosen = new Map();
  return (plain, parentKey, qualifier) => {
    const key = `${parentKey}::${plain}`;
    if (chosen.has(key)) return chosen.get(key);
    const owner = taken.get(slugify(plain));
    const name = owner === undefined || owner === parentKey ? plain : `${plain} (${qualifier})`;
    taken.set(slugify(name), parentKey);
    chosen.set(key, name);
    return name;
  };
};

const mainKey = (name) => existing.mains.find((each) => each.slug === slugify(name))?._id ?? `new:${name}`;
const categoryName = namer(existing.categories, (each) => refId(each.mainCategoryId));
const categoryKeys = new Map(); // `${main}::${category}` → planned name
for (const product of products) {
  const key = `${product.main}::${product.category}`;
  if (!categoryKeys.has(key)) categoryKeys.set(key, categoryName(product.category, mainKey(product.main), product.main));
  product.categoryName = categoryKeys.get(key);
}
const categoryParent = (name) => {
  const found = existing.categories.find((each) => each.slug === slugify(name));
  return found ? found._id : `new:${name}`;
};
const subName = namer(existing.subs, (each) => refId(each.categoryId));
for (const product of products) product.subName = subName(product.sub, categoryParent(product.categoryName), product.main);

// Spec attributes: one text attribute per (group, label). A label used in more
// than one group, or clashing with a variant attribute, is qualified by group.
const variantNames = new Set(Object.values(VARIANT_KEYS).map(slugify));
const labelGroups = new Map();
for (const product of products) {
  for (const row of product.specs) {
    if (!labelGroups.has(row.label)) labelGroups.set(row.label, new Set());
    labelGroups.get(row.label).add(row.group);
  }
}
// An attribute already filed under another group (say, an earlier hand-made
// "Storage") also forces the qualified name; one in the same group is ours.
const groupOf = (attribute) => existing.groups.find((each) => each._id === attribute.groupId)?.name;
const clashes = (group, label) =>
  existing.attributes.some((each) => each.slug === slugify(label) && groupOf(each) !== group);
const specAttributeName = (group, label) =>
  labelGroups.get(label).size > 1 || variantNames.has(slugify(label)) || clashes(group, label)
    ? `${label} (${group})`
    : label;

const plan = {
  brands: [...new Set(products.map((each) => each.brand))],
  mains: [...new Set(products.map((each) => each.main))],
  categories: [...new Map(products.map((each) => [each.categoryName, each.main])).entries()],
  subs: [...new Map(products.map((each) => [each.subName, each.categoryName])).entries()],
  groups: new Map(), // group → Set(main)
  specAttributes: new Map(), // name → { group, label, mains }
  variantAttributes: new Map(), // name → { labels: Map(value → label), mains }
};

for (const product of products) {
  for (const row of product.specs) {
    const name = specAttributeName(row.group, row.label);
    row.attribute = name;
    if (!plan.groups.has(row.group)) plan.groups.set(row.group, new Set());
    plan.groups.get(row.group).add(product.main);
    if (!plan.specAttributes.has(name)) plan.specAttributes.set(name, { group: row.group, mains: new Set() });
    plan.specAttributes.get(name).mains.add(product.main);
  }
  for (const variant of product.variants) {
    for (const option of variant.options) {
      if (!option.attribute) continue;
      if (!plan.variantAttributes.has(option.attribute)) plan.variantAttributes.set(option.attribute, { labels: new Map(), mains: new Set() });
      const entry = plan.variantAttributes.get(option.attribute);
      entry.mains.add(product.main);
      const value = optionValue(option.label);
      if (!entry.labels.has(value)) entry.labels.set(value, option.label);
      option.value = value;
    }
  }
}

// Variant attributes live in this group unless they already exist elsewhere.
const VARIANT_GROUP = "General";
for (const name of plan.variantAttributes.keys()) {
  const known = existing.attributes.find((each) => each.slug === slugify(name));
  const group = known ? existing.groups.find((each) => each._id === known.groupId)?.name ?? VARIANT_GROUP : VARIANT_GROUP;
  if (!plan.groups.has(group)) plan.groups.set(group, new Set());
  for (const main of plan.variantAttributes.get(name).mains) plan.groups.get(group).add(main);
  plan.variantAttributes.get(name).group = group;
}

// A product sells as variants when its SKUs differ by at least one option.
for (const product of products) {
  product.hasVariants = product.variants.length > 1 && product.variants.every((each) => each.options.some((option) => option.attribute));
}

const isNew = (records, name) => !records.some((each) => each.slug === slugify(name));

console.log(`API ${API}`);
console.log(`\nProducts in the scrape: ${products.length}`);
console.log(`  with variants: ${products.filter((each) => each.hasVariants).length}, single version: ${products.filter((each) => !each.hasVariants).length}`);
console.log(`  photos found: ${products.reduce((sum, each) => sum + each.images.length, 0)}`);
const summary = (label, names, records) =>
  console.log(`${label}: ${names.length} needed, ${names.filter((name) => isNew(records, name)).length} new`);
summary("Brands", plan.brands, existing.brands);
summary("Main categories", plan.mains, existing.mains);
summary("Categories", plan.categories.map(([name]) => name), existing.categories);
summary("Sub-categories", plan.subs.map(([name]) => name), existing.subs);
summary("Attribute groups", [...plan.groups.keys()], existing.groups);
summary("Spec attributes", [...plan.specAttributes.keys()], existing.attributes);
summary("Variant attributes", [...plan.variantAttributes.keys()], existing.attributes);

const duplicateSkus = (() => {
  const seen = new Map();
  for (const product of products) for (const variant of product.variants) seen.set(variant.sku, (seen.get(variant.sku) ?? 0) + 1);
  return [...seen].filter(([, count]) => count > 1).map(([sku]) => sku);
})();
if (duplicateSkus.length) console.log(`\nSKUs used more than once (kept on the first product only): ${duplicateSkus.join(", ")}`);
const flattened = products.filter((each) => !each.hasVariants && each.variants.length > 1);
if (flattened.length) {
  console.log(`\nSold as a single version (their SKUs don't differ by any option, so only the first is kept):`);
  for (const each of flattened) console.log(`  ${each.name}: ${each.variants.length} SKUs`);
}

if (!APPLY) {
  console.log("\nCategory tree:");
  for (const main of plan.mains) {
    console.log(`  ${main}`);
    for (const [category] of plan.categories.filter(([, owner]) => owner === main)) {
      console.log(`    ${category}`);
      for (const [sub] of plan.subs.filter(([, owner]) => owner === category)) {
        console.log(`      ${sub}  (${products.filter((each) => each.subName === sub).length})`);
      }
    }
  }
  console.log("\nPlan only. Run with --apply catalog, then --apply products.");
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Apply

const bySlug = (records, name) => records.find((each) => each.slug === slugify(name));
let created = 0;

const ensure = async (records, route, name, body) => {
  const found = bySlug(records, name);
  if (found) return found;
  const record = (await call("POST", route, body)).data;
  records.push(record);
  created++;
  console.log(`  + ${route.slice(1)}: ${name}`);
  return record;
};

const union = (current, extra) => [...new Set([...current, ...extra])];

const ensureCatalog = async () => {
  for (const name of plan.brands) await ensure(existing.brands, "/brands", name, { name });

  const mainIds = new Map();
  for (const name of plan.mains) mainIds.set(name, (await ensure(existing.mains, "/main-categories", name, { name }))._id);

  const categoryIds = new Map();
  for (const [name, main] of plan.categories) {
    categoryIds.set(name, (await ensure(existing.categories, "/categories", name, { name, mainCategoryId: mainIds.get(main) }))._id);
  }
  for (const [name, category] of plan.subs) {
    await ensure(existing.subs, "/sub-categories", name, { name, categoryId: categoryIds.get(category) });
  }

  const groupIds = new Map();
  for (const [name, mains] of plan.groups) {
    const ids = [...mains].map((main) => mainIds.get(main));
    const group = await ensure(existing.groups, "/attribute-groups", name, { name, mainCategoryIds: ids });
    const current = group.mainCategoryIds.map(refId);
    const wanted = union(current, ids);
    if (wanted.length !== current.length) {
      await call("PATCH", `/attribute-groups/${group._id}`, { mainCategoryIds: wanted });
      group.mainCategoryIds = wanted;
      console.log(`  ~ attribute-groups: ${name} now covers ${wanted.length} main categories`);
    }
    groupIds.set(name, group._id);
  }

  for (const [name, entry] of plan.specAttributes) {
    const ids = [...entry.mains].map((main) => mainIds.get(main));
    const attribute = await ensure(existing.attributes, "/attributes", name, {
      name,
      type: "text",
      groupId: groupIds.get(entry.group),
      mainCategoryIds: ids,
    });
    const wanted = union(attribute.mainCategoryIds.map(refId), ids);
    if (wanted.length !== attribute.mainCategoryIds.length) {
      await call("PATCH", `/attributes/${attribute._id}`, { mainCategoryIds: wanted });
      attribute.mainCategoryIds = wanted;
    }
  }

  for (const [name, entry] of plan.variantAttributes) {
    const ids = [...entry.mains].map((main) => mainIds.get(main));
    const options = [...entry.labels].map(([value, label]) => ({ label, value }));
    const attribute = await ensure(existing.attributes, "/attributes", name, {
      name,
      type: "select",
      groupId: groupIds.get(entry.group),
      mainCategoryIds: ids,
      options,
      isFilterable: true,
    });
    // An existing pick-one attribute keeps its choices and gains the missing ones.
    const have = attribute.options ?? [];
    const merged = [...have, ...options.filter((option) => !have.some((each) => each.value === option.value))];
    const wanted = union(attribute.mainCategoryIds.map(refId), ids);
    if (merged.length !== have.length || wanted.length !== attribute.mainCategoryIds.length) {
      await call("PATCH", `/attributes/${attribute._id}`, { type: attribute.type, options: merged, mainCategoryIds: wanted });
      attribute.options = merged;
      attribute.mainCategoryIds = wanted;
      console.log(`  ~ attributes: ${name} has ${merged.length} choices`);
    }
  }
};

const importProducts = async () => {
  const id = (records, name, label) => {
    const found = bySlug(records, name);
    if (!found) throw new Error(`${label} "${name}" is missing. Run --apply catalog first.`);
    return found._id;
  };
  const usedSkus = new Set();
  let added = 0;
  let skipped = 0;

  for (const product of products) {
    try {
      await call("GET", `/products/${product.slug}`);
      skipped++;
      continue;
    } catch (error) {
      if (error.status !== 404) throw error;
    }

    const attributes = product.specs.map((row) => ({ attributeId: id(existing.attributes, row.attribute, "Attribute"), value: row.value }));
    const variants = product.variants
      .filter((variant) => !usedSkus.has(variant.sku))
      .map((variant) => ({
        sku: variant.sku,
        attributes: variant.options
          .filter((option) => option.attribute)
          .map((option) => ({ attributeId: id(existing.attributes, option.attribute, "Attribute"), value: option.value })),
        price: variant.price,
        discount: variant.discount,
        stock: variant.stock,
      }));
    const cheapest = [...variants].sort((a, b) => a.price - a.discount - (b.price - b.discount))[0] ?? product.variants[0];

    const body = {
      name: product.name,
      description: product.description,
      brandId: id(existing.brands, product.brand, "Brand"),
      mainCategoryId: id(existing.mains, product.main, "Main category"),
      categoryId: id(existing.categories, product.categoryName, "Category"),
      subCategoryId: id(existing.subs, product.subName, "Sub-category"),
      attributes,
      hasVariants: product.hasVariants,
      ...(product.hasVariants
        ? { variants, price: cheapest.price, discount: cheapest.discount, stock: variants.reduce((sum, each) => sum + each.stock, 0) }
        : { sku: product.variants[0].sku, price: product.variants[0].price, discount: product.variants[0].discount, stock: product.variants[0].stock }),
      isFeatured: product.isFeatured,
      isUpcoming: product.isUpcoming,
      status: "active",
    };

    let saved;
    try {
      saved = (await call("POST", "/products", body)).data;
    } catch (error) {
      if (/brandId/.test(error.message)) {
        console.error(`\nStopped: the backend still drops brandId (${error.message}).`);
        console.error("Add brandId to createProductValidationSchema in product.validation.ts, then run this again.");
        process.exit(1);
      }
      console.error(`  ! ${product.name}: ${error.message}`);
      continue;
    }
    for (const variant of product.variants) usedSkus.add(variant.sku);

    if (product.images.length) {
      const form = new FormData();
      for (const file of product.images) {
        form.append("images", new Blob([readFileSync(path.join(DOWNLOADS, file))], { type: file.endsWith(".png") ? "image/png" : "image/jpeg" }), file);
      }
      try {
        await call("PATCH", `/products/${saved._id}`, form);
      } catch (error) {
        console.error(`  ! ${product.name}: saved, but photos failed: ${error.message}`);
      }
    }
    added++;
    console.log(`  + ${product.name} (${product.hasVariants ? `${variants.length} variants` : "single"}, ${product.images.length} photos)`);
  }

  console.log(`\nProducts added: ${added}, already there: ${skipped}`);
};

if (APPLY === "catalog") {
  await ensureCatalog();
  console.log(`\nCatalog ready. Created ${created} records.`);
} else {
  await importProducts();
}
