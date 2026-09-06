/* Rebuilds `src/shared/config/product-details/` and the gallery artwork under
   `src/images/products/<slug>/` from the reference catalogue.

       node scripts/scrape-catalogue.mjs

   Three steps, each cached under `.cache/catalogue/` so a re-run costs nothing:
     1. fetch  — one JSON record per product, from the reference's own data
                 route plus its description endpoint
     2. images — every gallery shot the records name
     3. emit   — one generated TypeScript module per product

   The product list comes from `src/shared/config/products.ts`, so a product
   added there is picked up here. Detail data is derived, never hand-edited:
   fix this script and re-run.

   What is deliberately dropped on the way through — none of it is a claim this
   business is allowed to make. See memory.md.
     · the reference's shop-selling description blocks (BANNED)
     · warranty rows and the whole "Warranty Information" spec group
     · the Apple Authorized Reseller badge and the gift panel (never read) */

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

/** Ours on the left, the reference's on the right. Two products it renamed,
 *  and one whose slug it misspells ("hyrbird"). */
const UPSTREAM_SLUG = {
  "macbook-neo-8-256": "macbook-neo",
  "macbook-neo-8-512": "macbook-neo-8gb-512gb",
  "spigen-ultra-hybrid-magfit-case-for-galaxy-s26-ultra":
    "spigen-ultra-hyrbird-magfit-case-for-galaxy-s26-ultra",
};

/* ------------------------------------------------------------------ text */

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

/** Copy the reference's trading claims and we would be asserting things this
 *  business cannot. A description block matching this is dropped whole. */
const BANNED =
  /gadget\s*(?:&|and)\s*gear|gadgetandgear|\bg&g\b|authoriz|authoris|warrant|showroom|outlet|best price|cheapest|lowest price|official (?:store|reseller|retailer)|genuine|after-?sales/i;

/** The reference's spec table ends in a "Warranty Information" group. We make
 *  no warranty claim, so the group and any stray warranty row are dropped. */
const SPEC_BANNED = /warrant|guarantee/i;

/* --------------------------------------------------------------- fetching */

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

/** Runs `worker` over `items`, `limit` at a time. */
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

/* ---------------------------------------------------------------- parsing */

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

    // One cell can hold several lines; the reference stacks them.
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

/** The reference's long description is HTML. Keep the product facts, drop the
 *  blocks that sell the reference's own shop, and close with ours. */
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
      // The first heading is the description's own title.
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

  // Ours, not theirs: only the claims the trust strip already makes.
  blocks.push({
    heading: `Buying the ${name} from Unique Mart`,
    paragraphs: [
      "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
    ],
  });

  return { title: title && !BANNED.test(title) ? title : name, blocks };
};

/* ----------------------------------------------------------------- emitting */

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
    breadcrumb.length ? `  breadcrumb: [${breadcrumb.map(q).join(", ")}],` : "",
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

/* --------------------------------------------------------------------- run */

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

// Hash what is already committed, so a gallery shot identical to a card image
// reuses that file rather than landing a second copy of the same bytes.
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

  /* place the artwork */
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

  // Dedupe on the placed file, not the upstream path: the catalogue lists the
  // same photo under several paths — once per storage tier, typically — and two
  // of them resolving to one import would repeat it in the gallery.
  const gallery = [];
  for (const source of paths) {
    const spec = importOf.get(source);
    if (spec && !gallery.includes(spec)) gallery.push(spec);
  }
  if (!gallery.length) throw new Error(`no gallery images for ${slug}`);

  /* colours, and every other variant axis the product records */
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
        .map((crumb) => oneLine(crumb.name))
        .filter(Boolean),
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
