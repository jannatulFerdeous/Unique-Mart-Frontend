import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { Buffer } from "node:buffer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, ".cache/catalogue");
const RAW = path.join(CACHE, "raw");
const DOWNLOADS = path.join(CACHE, "images");
const IMAGES = path.join(ROOT, "src/images");
const OUT = path.join(ROOT, "src/shared/config/product-details");

const SITE = "https://gadgetandgear.com";
const API = "https://api-v3.gadgetandgear.com/api/v1";
const ASSETS = "https://assets.gadgetandgear.com/upload/";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36";

const UPSTREAM_SLUG = {
  "macbook-neo-8-256": "macbook-neo",
  "macbook-neo-8-512": "macbook-neo-8gb-512gb",
  "spigen-ultra-hybrid-magfit-case-for-galaxy-s26-ultra":
    "spigen-ultra-hyrbird-magfit-case-for-galaxy-s26-ultra",
};

const list = (value) =>
  String(value ?? "")
    .split(",")
    .map((each) => each.trim())
    .filter(Boolean);

const cacheName = (source) => source.replace(/[^a-zA-Z0-9._-]/g, "_");

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
  ndash: "–", mdash: "—", hellip: "…", trade: "™",
  reg: "®", copy: "©", deg: "°", times: "×",
  middot: "·",
};

const decode = (value) =>
  String(value ?? "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (whole, name) => ENTITIES[name.toLowerCase()] ?? whole);

const text = (html) =>
  decode(
    String(html ?? "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[^\S\n]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .trim();

const oneLine = (html) => text(html).replace(/\s*\n\s*/g, " ").trim();

const camel = (slug) =>
  slug
    .replace(/[^a-z0-9]+(.)/gi, (_, char) => char.toUpperCase())
    .replace(/^(\d)/, "p$1");

const q = (value) => JSON.stringify(value);

const BANNED =
  /gadget\s*(?:&|and)\s*gear|gadgetandgear|\bg&g\b|authoriz|authoris|warrant|showroom|outlet|best price|cheapest|lowest price|official (?:store|reseller|retailer)|genuine|after-?sales/i;

const SPEC_BANNED = /warrant|guarantee/i;

const slugsFromCatalogue = () => {
  const source = readFileSync(
    path.join(ROOT, "src/shared/config/products.ts"),
    "utf8",
  );
  return [...new Set([...source.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]))].sort();
};

const buildId = async () => {
  const html = await (
    await fetch(`${SITE}/product/iphone-air`, { headers: { "user-agent": UA } })
  ).text();
  const id = html.match(/"buildId":"([^"]+)"/)?.[1];
  if (!id) throw new Error("could not read the reference's buildId");
  return id;
};

const pool = async (items, limit, worker) => {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (queue.length) await worker(queue.shift());
    }),
  );
};

const fetchRecords = async (slugs) => {
  mkdirSync(RAW, { recursive: true });
  const pending = slugs.filter((slug) => !existsSync(path.join(RAW, `${slug}.json`)));
  if (!pending.length) return [];

  const id = await buildId();
  const misses = [];

  await pool(pending, 4, async (slug) => {
    const upstream = UPSTREAM_SLUG[slug] ?? slug;
    const response = await fetch(
      `${SITE}/_next/data/${id}/product/${upstream}.json?slug=${upstream}`,
      { headers: { "user-agent": UA } },
    );
    if (!response.ok) {
      misses.push(`${slug} (${upstream}) → ${response.status}`);
      return;
    }
    const product = (await response.json())?.pageProps?.product;
    if (!product?.slug) {
      misses.push(`${slug} → empty record`);
      return;
    }

    let longDescription = "";
    const details = await fetch(
      `${API}/product/storefront/product-details/${upstream}`,
      { headers: { "user-agent": UA } },
    );
    if (details.ok) longDescription = (await details.json())?.longDescription ?? "";

    writeFileSync(
      path.join(RAW, `${slug}.json`),
      JSON.stringify({ ...product, longDescription, upstreamSlug: upstream }, null, 1),
    );
    process.stdout.write(".");
  });

  return misses;
};

const fetchMenu = async () => {
  const file = path.join(CACHE, "menu.json");
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));

  const response = await fetch(`${API}/category/storefront/get-menu`, {
    headers: { "user-agent": UA },
  });
  if (!response.ok) throw new Error(`menu → ${response.status}`);

  const payload = await response.json();
  const menu = payload?.data ?? payload;
  if (!Array.isArray(menu)) throw new Error("menu: unexpected shape");

  writeFileSync(file, JSON.stringify(menu, null, 1));
  return menu;
};

const fetchImages = async (sources) => {
  mkdirSync(DOWNLOADS, { recursive: true });
  const pending = [...sources].filter(
    (source) => !existsSync(path.join(DOWNLOADS, cacheName(source))),
  );
  const misses = [];

  await pool(pending, 8, async (source) => {
    const url = ASSETS + (source.includes("%") ? source : encodeURI(source));
    const response = await fetch(url, { headers: { "user-agent": UA } });
    if (!response.ok) {
      misses.push(`${response.status} ${source}`);
      return;
    }
    writeFileSync(
      path.join(DOWNLOADS, cacheName(source)),
      Buffer.from(await response.arrayBuffer()),
    );
    process.stdout.write(".");
  });

  return misses;
};

const parseSpecs = (specifications = []) => {
  const groups = [];

  for (const row of specifications) {
    const label = oneLine(row.key);
    const value = text(row.value);

    if (row.isTitle) {
      groups.push({ title: label || oneLine(row.value), rows: [] });
      continue;
    }
    if (!label || !value) continue;
    if (SPEC_BANNED.test(label) || SPEC_BANNED.test(value)) continue;
    if (BANNED.test(value)) continue;

    const lines = value
      .split(/\n|;\s+/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) continue;

    if (!groups.length) groups.push({ title: "Specification", rows: [] });
    groups.at(-1).rows.push({ label, value: lines });
  }

  return groups.filter(
    (group) => group.rows.length && !SPEC_BANNED.test(group.title),
  );
};

const parseHighlights = (shortDescription) => {
  const items = [
    ...String(shortDescription ?? "").matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi),
  ]
    .map((match) => oneLine(match[1]))
    .filter(Boolean);
  if (items.length) return items;

  const fallback = oneLine(shortDescription);
  return fallback ? [fallback] : [];
};

const parseEmi = (gift, price) => {
  if (!gift || !price) return null;

  let parsed;
  try {
    parsed = JSON.parse(gift);
  } catch {
    return null;
  }

  const tenors = parsed?.EMI?.emiTenors;
  if (!parsed?.EMI?.selected || !Array.isArray(tenors) || !tenors.length) return null;

  const months = Math.max(
    ...tenors.map((tenor) => Number(String(tenor.name).match(/\d+/)?.[0] ?? 0)),
  );
  if (!months) return null;

  return { months, perMonth: Math.round(price / months) };
};

const parseDescription = (longDescription, name) => {
  const blocks = [];
  let title = "";
  let current = null;

  const flush = () => {
    if (current?.paragraphs.length) blocks.push(current);
    current = null;
  };

  const tokens = String(longDescription ?? "").matchAll(
    /<(h2|h3|h4|p|li)[^>]*>([\s\S]*?)<\/\1>/gi,
  );

  for (const [, tag, inner] of tokens) {
    const value = oneLine(inner);
    if (!value) continue;

    if (tag.toLowerCase().startsWith("h")) {
      flush();
      if (!title) {
        title = value;
        continue;
      }
      current = BANNED.test(value) ? null : { heading: value, paragraphs: [] };
      continue;
    }

    if (BANNED.test(value)) continue;
    if (!current) current = { paragraphs: [] };
    current.paragraphs.push(value);
  }
  flush();

  blocks.push({
    heading: `Buying the ${name} from Unique Mart`,
    paragraphs: [
      "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
    ],
  });

  return { title: title && !BANNED.test(title) ? title : name, blocks };
};

const FACET_GROUPS = [
  {
    id: "availability",
    label: "Availability",
    values: ["In Stock", "Pre Order", "Up Coming", "Out of Stock"],
  },
  {
    id: "display-size",
    label: "Display Size",
    values: ["5.5 to 5.9 Inch", "6.0 to 6.4 Inch", "6.5 to 6.9 Inch", "7.0 to Above"],
  },
  {
    id: "display-type",
    label: "Display Type",
    values: [
      "OLED", "Super AMOLED", "AMOLED", "IPS", "TFT",
      "Super Retina XDR", "Dynamic AMOLED", "LCD", "P-OLED", "Dot Drop",
    ],
  },
  {
    id: "chipset",
    label: "Chipset",
    values: [
      "Apple A-Series", "Snapdragon", "MediaTek", "Exynos",
      "UNISOC", "Tensor", "Kirin",
    ],
  },
  {
    id: "ram",
    label: "RAM",
    values: ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"],
  },
  {
    id: "storage",
    label: "Internal Storage",
    values: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB"],
  },
  {
    id: "battery",
    label: "Battery Capacity",
    values: [
      "3000 to 3999 mAh", "4000 to 4999 mAh", "5000 to 5999 mAh",
      "6000 to 7000 mAh", "7000 mAh & Above",
    ],
  },
  {
    id: "features",
    label: "Key Features",
    values: [
      "Dual Sim", "eSim Supported", "Virtual Memory",
      "Quick Charging", "VOOC Charging", "Water Resistant",
    ],
  },
];

const specIndex = (product) => {
  const index = new Map();
  let group = "";

  for (const row of product.specifications ?? []) {
    if (row.isTitle) {
      group = oneLine(row.value).toLowerCase();
      continue;
    }
    const key = oneLine(row.key).toLowerCase();
    const value = text(row.value);
    if (!key || !value || value === "undefined") continue;

    index.set(`${group}::${key}`, value);
    if (!index.has(key)) index.set(key, value);
  }

  return index;
};

const readSpec = (index, ...keys) => {
  for (const key of keys) {
    const found = index.get(key);
    if (found) return found;
  }
  return "";
};

const DISPLAY_TYPES = [
  [/super retina xdr/i, "Super Retina XDR"],
  [/dynamic amoled/i, "Dynamic AMOLED"],
  [/super amoled/i, "Super AMOLED"],
  [/amoled/i, "AMOLED"],
  [/p-?oled/i, "P-OLED"],
  [/oled/i, "OLED"],
  [/\bips\b/i, "IPS"],
  [/\btft\b/i, "TFT"],
  [/\blcd\b/i, "LCD"],
  [/dot drop/i, "Dot Drop"],
];

const CHIPSETS = [
  [/snapdragon/i, "Snapdragon"],
  [/mediatek|helio|dimensity/i, "MediaTek"],
  [/exynos/i, "Exynos"],
  [/unisoc|\bT\d{4}\b/i, "UNISOC"],
  [/tensor/i, "Tensor"],
  [/kirin/i, "Kirin"],
  [/\bA\d{2}\b.*chip|bionic/i, "Apple A-Series"],
];

const sizeBucket = (inches) => {
  if (inches >= 7) return "7.0 to Above";
  if (inches >= 6.5) return "6.5 to 6.9 Inch";
  if (inches >= 6) return "6.0 to 6.4 Inch";
  if (inches >= 5.5) return "5.5 to 5.9 Inch";
  return null;
};

const batteryBucket = (mah) => {
  if (mah >= 7000) return "7000 mAh & Above";
  if (mah >= 6000) return "6000 to 7000 mAh";
  if (mah >= 5000) return "5000 to 5999 mAh";
  if (mah >= 4000) return "4000 to 4999 mAh";
  if (mah >= 3000) return "3000 to 3999 mAh";
  return null;
};

const deriveFacets = (product) => {
  const index = specIndex(product);
  const facets = {};
  const add = (id, ...values) => {
    for (const value of values) {
      if (!value) continue;
      facets[id] ??= [];
      if (!facets[id].includes(value)) facets[id].push(value);
    }
  };

  const skus = product.skus ?? [];
  if (skus.some((sku) => sku.preOrder)) add("availability", "Pre Order");
  else if (skus.length && skus.every((sku) => sku.comingSoon)) {
    add("availability", "Up Coming");
  } else {
    add("availability", product.stockStatus === "In Stock" ? "In Stock" : "Out of Stock");
  }

  const sizeText = readSpec(index, "display::size", "size", "display::display size");
  const inches = [...sizeText.matchAll(/(\d+(?:\.\d+)?)\s*[‑–-]?\s*inch/gi)]
    .map((match) => Number(match[1]))
    .filter((value) => value > 3 && value < 20);
  if (inches.length) add("display-size", sizeBucket(Math.max(...inches)));

  let typeText = readSpec(index, "display::type", "display::display type");
  for (const [pattern, label] of DISPLAY_TYPES) {
    if (pattern.test(typeText)) {
      add("display-type", label);
      typeText = typeText.replace(new RegExp(pattern.source, "gi"), " ");
    }
  }

  const chipText = readSpec(index, "processor::chipset", "chipset", "processor::cpu type");
  for (const [pattern, label] of CHIPSETS) {
    if (pattern.test(chipText)) {
      add("chipset", label);
      break;
    }
  }

  const ramText = readSpec(index, "memory::ram", "ram");
  const ram = ramText.match(/(\d+)\s*GB/i);
  if (ram) add("ram", `${ram[1]}GB`);

  const romText = readSpec(
    index, "memory::rom", "memory::internal storage", "rom", "internal storage", "storage",
  );
  for (const match of romText.matchAll(/(\d+)\s*(GB|TB)/gi)) {
    add("storage", `${match[1]}${match[2].toUpperCase()}`);
  }

  const batteryText = readSpec(index, "battery::type", "battery::capacity", "battery");
  const mah = [...batteryText.matchAll(/([\d,]{3,6})\s*mah/gi)]
    .map((match) => Number(match[1].replace(/,/g, "")))
    .filter((value) => value >= 1000 && value <= 20000);
  if (mah.length) add("battery", batteryBucket(Math.max(...mah)));

  const sim = `${readSpec(index, "network & connectivity::sim", "sim", "memory::card slot", "card slot")} ${readSpec(index, "network & amp; connectivity::sim")}`;
  if (/dual\s*-?\s*sim|2 nano|2 sim|two active|nano-sim \+ nano-sim/i.test(sim)) {
    add("features", "Dual Sim");
  }
  if (/e-?sim/i.test(sim)) add("features", "eSim Supported");

  const extras = `${ramText} ${readSpec(index, "features::other features", "other features")}`;
  if (/virtual (ram|memory)|extended ram|ram expansion|turbo ram/i.test(extras)) {
    add("features", "Virtual Memory");
  }

  const charging = readSpec(index, "battery::fast charging", "fast charging", "battery::charging");
  if (/vooc/i.test(charging)) add("features", "VOOC Charging");
  if (/\d+\s*W|fast charg|quick charg|supercharge|turbo charg/i.test(charging)) {
    add("features", "Quick Charging");
  }

  const ip = readSpec(index, "features::ip rating", "ip rating", "features::protection");
  if (/ip[x\d]\d/i.test(ip)) add("features", "Water Resistant");

  return facets;
};

const galleryPaths = (product) => {
  const paths = [];
  const seen = new Set();

  const add = (value) => {
    for (const item of list(value)) {
      if (seen.has(item)) continue;
      seen.add(item);
      paths.push(item);
    }
  };

  add(product.thumbnail);
  for (const sku of product.skus ?? []) add(sku.images);
  return paths;
};

const emit = ({ slug, product, gallery, colors, options, emi, specs, highlights, description, breadcrumb }) => {
  const variable = new Map();
  gallery.forEach((spec, index) => variable.set(spec, `img${index + 1}`));

  const imports = gallery
    .map((spec) => `import ${variable.get(spec)} from ${q(spec)};`)
    .join("\n");

  const colorLines = colors.map((color) => {
    const image = color.image && variable.get(color.image);
    return `    { name: ${q(color.name)}, hex: ${q(color.hex)}${image ? `, image: ${image}` : ""} },`;
  });

  const optionLines = options.map(
    (group) =>
      `    { label: ${q(group.label)}, values: [${group.values.map(q).join(", ")}] },`,
  );

  const specLines = specs
    .map(
      (group) =>
        `    {\n      title: ${q(group.title)},\n      rows: [\n${group.rows
          .map(
            (row) =>
              `        { label: ${q(row.label)}, value: [${row.value.map(q).join(", ")}] },`,
          )
          .join("\n")}\n      ],\n    },`,
    )
    .join("\n");

  const descriptionLines = description.blocks
    .map(
      (block) =>
        `      {\n${block.heading ? `        heading: ${q(block.heading)},\n` : ""}        paragraphs: [\n${block.paragraphs
          .map((paragraph) => `          ${q(paragraph)},`)
          .join("\n")}\n        ],\n      },`,
    )
    .join("\n");

  const parts = [
    breadcrumb.length
      ? `  breadcrumb: [\n${breadcrumb
          .map((crumb) => `    { label: ${q(crumb.label)}, slug: ${q(crumb.slug)} },`)
          .join("\n")}\n  ],`
      : "",
    `  gallery: [${gallery.map((spec) => variable.get(spec)).join(", ")}],`,
    `  inStock: ${product.stockStatus === "In Stock"},`,
    highlights.length
      ? `\n  highlights: [\n${highlights.map((line) => `    ${q(line)},`).join("\n")}\n  ],`
      : `\n  highlights: [],`,
    colorLines.length ? `\n  colors: [\n${colorLines.join("\n")}\n  ],` : "",
    optionLines.length ? `\n  options: [\n${optionLines.join("\n")}\n  ],` : "",
    emi ? `\n  emi: { months: ${emi.months}, perMonth: ${emi.perMonth} },` : "",
    `\n  specs: [\n${specLines}\n  ],`,
    `\n  description: {\n    title: ${q(description.title)},\n    blocks: [\n${descriptionLines}\n    ],\n  },`,
  ].filter(Boolean);

  return `/* Generated by scripts/scrape-catalogue.mjs — do not edit by hand.
   Change the script and re-run it instead. */

import type { ProductDetail } from "../catalog";
${imports}

export const ${camel(slug)}: ProductDetail = {
${parts.join("\n")}
};
`;
};

const slugs = slugsFromCatalogue();
console.log(`catalogue: ${slugs.length} products`);

const recordMisses = await fetchRecords(slugs);
if (recordMisses.length) {
  console.error("\ncould not fetch:\n  " + recordMisses.join("\n  "));
  process.exit(1);
}

const records = new Map(
  slugs.map((slug) => [
    slug,
    JSON.parse(readFileSync(path.join(RAW, `${slug}.json`), "utf8")),
  ]),
);

const sources = new Set();
for (const product of records.values())
  for (const source of galleryPaths(product)) sources.add(source);

const imageMisses = await fetchImages(sources);
if (imageMisses.length) {
  console.error("\ncould not download:\n  " + imageMisses.join("\n  "));
  process.exit(1);
}
console.log(`\nrecords ${records.size}, images ${sources.size}`);

const byHash = new Map();
const indexDir = (dir) => {
  const full = path.join(IMAGES, dir);
  if (!existsSync(full)) return;
  for (const entry of readdirSync(full, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith(".")) continue;
    const hash = createHash("sha1")
      .update(readFileSync(path.join(full, entry.name)))
      .digest("hex");
    if (!byHash.has(hash)) byHash.set(hash, `@/images/${dir}/${entry.name}`);
  }
};
indexDir("products");
indexDir("brands");

if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });

const modules = [];
let placed = 0;
let reused = 0;

for (const slug of slugs) {
  const product = records.get(slug);
  const paths = galleryPaths(product);

  const importOf = new Map();
  for (const [index, source] of paths.entries()) {
    const cached = path.join(DOWNLOADS, cacheName(source));
    if (!existsSync(cached)) continue;

    const hash = createHash("sha1").update(readFileSync(cached)).digest("hex");
    if (byHash.has(hash)) {
      importOf.set(source, byHash.get(hash));
      reused++;
      continue;
    }

    const name = `${String(index + 1).padStart(2, "0")}-${path
      .basename(source)
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase()}`;
    mkdirSync(path.join(IMAGES, "products", slug), { recursive: true });
    copyFileSync(cached, path.join(IMAGES, "products", slug, name));

    const spec = `@/images/products/${slug}/${name}`;
    byHash.set(hash, spec);
    importOf.set(source, spec);
    placed++;
  }

  const gallery = [];
  for (const source of paths) {
    const spec = importOf.get(source);
    if (spec && !gallery.includes(spec)) gallery.push(spec);
  }
  if (!gallery.length) throw new Error(`no gallery images for ${slug}`);

  const colors = new Map();
  const options = new Map();

  for (const sku of product.skus ?? []) {
    const first = list(sku.images)
      .map((image) => importOf.get(image))
      .find((spec) => spec && gallery.includes(spec));

    for (const attribute of sku.attributes ?? []) {
      const label = oneLine(attribute.key);
      const value = oneLine(attribute.value);
      if (!label || !value) continue;

      if (/^colou?r$/i.test(label)) {
        if (!colors.has(value)) {
          colors.set(value, {
            name: value,
            hex: String(attribute.code || "").trim() || "#d4d4d8",
            image: first,
          });
        }
        continue;
      }

      if (!options.has(label)) options.set(label, new Set());
      options.get(label).add(value);
    }
  }

  writeFileSync(
    path.join(OUT, `${slug}.ts`),
    emit({
      slug,
      product,
      gallery,
      colors: [...colors.values()],
      options: [...options.entries()].map(([label, values]) => ({
        label,
        values: [...values],
      })),
      emi: parseEmi(product.gift, Number(product.skus?.[0]?.price ?? 0)),
      specs: parseSpecs(product.specifications),
      highlights: parseHighlights(product.shortDescription),
      description: parseDescription(product.longDescription, product.name),
      breadcrumb: (product.breadcrumbs ?? [])
        .map((crumb) => ({ label: oneLine(crumb.name), slug: String(crumb.slug ?? "") }))
        .filter((crumb) => crumb.label && crumb.slug),
    }),
  );

  modules.push({ slug, name: camel(slug) });
}

writeFileSync(
  path.join(OUT, "index.ts"),
  `/* Detail data for every product in the catalogue, generated by
   scripts/scrape-catalogue.mjs. One module per product, all of them generated:
   fix the script and re-run it rather than editing a file here.

   Deliberately not carried over from the reference: its Apple Authorized
   Reseller badge, its warranty rows and copy, its "GIFT FROM G&G" panel, and
   any block of description text that sells the reference's own shop.
   See memory.md. */

import type { ProductDetail } from "../catalog";
${modules.map((each) => `import { ${each.name} } from "./${each.slug}";`).join("\n")}

export const productDetails: Record<string, ProductDetail> = {
${modules.map((each) => `  ${q(each.slug)}: ${each.name},`).join("\n")}
};

export const findProductDetail = (slug: string): ProductDetail | undefined =>
  productDetails[slug];
`,
);

console.log(
  `wrote ${modules.length} modules — ${placed} images placed, ${reused} reused from artwork already committed`,
);

const menu = await fetchMenu();
const tree = new Map();

const node = (slug, name) => {
  if (!slug) return null;
  if (!tree.has(slug)) {
    tree.set(slug, { slug, name, trail: [], children: [], products: [] });
  }
  const found = tree.get(slug);
  if (name && !found.name) found.name = name;
  return found;
};

const link = (parent, child) => {
  if (!parent || !child || parent.slug === child.slug) return;
  if (!parent.children.includes(child.slug)) parent.children.push(child.slug);
};

const walkMenu = (entries, ancestors) => {
  const top = [];

  for (const entry of entries) {
    if (entry?.type && entry.type !== "category") continue;
    const current = node(String(entry.url ?? ""), oneLine(entry.name));
    if (!current) continue;

    if (!current.trail.length && ancestors.length) {
      current.trail = ancestors.map((each) => each.slug);
    }
    link(ancestors.at(-1), current);
    top.push(current.slug);
    walkMenu(entry.submenu ?? [], [...ancestors, current]);
  }

  return top;
};
const navTop = walkMenu(menu, []);

for (const [slug, product] of records) {
  const crumbs = (product.breadcrumbs ?? [])
    .map((crumb) => node(String(crumb.slug ?? ""), oneLine(crumb.name)))
    .filter(Boolean);

  crumbs.forEach((crumb, index) => {
    if (!crumb.trail.length && index) {
      crumb.trail = crumbs.slice(0, index).map((each) => each.slug);
    }
    link(crumbs[index - 1], crumb);
    if (!crumb.products.includes(slug)) crumb.products.push(slug);
  });
}

const ordered = [...tree.values()].sort((a, b) => a.slug.localeCompare(b.slug));

writeFileSync(
  path.join(ROOT, "src/shared/config/categories.ts"),
  `/* The category tree, generated by scripts/scrape-catalogue.mjs from the
   reference's menu plus our own products' breadcrumbs. Do not edit by hand.

   \`products\` holds every product slug in a category *and its descendants*, so
   a top-level page lists the whole section. A category with an empty list is
   one the navbar reaches but we hold no stock for — the page says so. */

export type Category = {
  slug: string;
  name: string;
  /** Ancestor slugs, outermost first. */
  trail: string[];
  children: string[];
  products: string[];
};

/** Top-level slugs, in the order the navbar shows them. */
export const rootCategories: string[] = [
${navTop.map((slug) => `  ${q(slug)},`).join("\n")}
];

export const categories: Record<string, Category> = {
${ordered
  .map(
    (each) =>
      `  ${q(each.slug)}: {\n` +
      `    slug: ${q(each.slug)},\n` +
      `    name: ${q(each.name || each.slug)},\n` +
      `    trail: [${each.trail.map(q).join(", ")}],\n` +
      `    children: [${each.children.map(q).join(", ")}],\n` +
      `    products: [${each.products.map(q).join(", ")}],\n` +
      `  },`,
  )
  .join("\n")}
};

export const categoryPath = (slug: string) => \`/category/\${slug}\`;

export const findCategory = (slug: string): Category | undefined =>
  categories[slug];
`,
);

const stocked = ordered.filter((each) => each.products.length).length;
console.log(
  `wrote ${ordered.length} categories (${stocked} with products, ${navTop.length} in the navbar)`,
);

const facetsBySlug = new Map();
for (const [slug, product] of records) {
  const facets = deriveFacets(product);
  if (Object.keys(facets).length) facetsBySlug.set(slug, facets);
}

writeFileSync(
  path.join(ROOT, "src/shared/config/facets.ts"),
  `/* Filter facets, generated by scripts/scrape-catalogue.mjs. Do not edit.

   Every value here was normalised out of a product's own specification rows —
   the source text is inconsistent ("12GB" / "12 GB", bare "T7225" for a UNISOC
   part, three spellings of 7000 mAh), and all of that cleaning happens in the
   script. A product appears under a facet only when its specs say so, so a
   category whose products do not record a field simply has no such group. */

export type FacetGroup = {
  id: string;
  label: string;
  /** Fixes checkbox order. A value nothing matches is never rendered. */
  values: string[];
};

export const facetGroups: FacetGroup[] = [
${FACET_GROUPS.map(
  (group) =>
    `  {\n    id: ${q(group.id)},\n    label: ${q(group.label)},\n` +
    `    values: [${group.values.map(q).join(", ")}],\n  },`,
).join("\n")}
];

/** Product slug → facet id → the values that product matches. */
export const productFacets: Record<string, Record<string, string[]>> = {
${[...facetsBySlug.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(
    ([slug, facets]) =>
      `  ${q(slug)}: {\n` +
      Object.entries(facets)
        .map(([id, values]) => `    ${q(id)}: [${values.map(q).join(", ")}],`)
        .join("\n") +
      `\n  },`,
  )
  .join("\n")}
};

export const facetsFor = (slug: string): Record<string, string[]> =>
  productFacets[slug] ?? {};
`,
);

const coverage = FACET_GROUPS.map((group) => {
  const hits = [...facetsBySlug.values()].filter((each) => each[group.id]?.length).length;
  return `${group.id} ${hits}`;
}).join(", ");
console.log(`wrote facets for ${facetsBySlug.size} products — ${coverage}`);
