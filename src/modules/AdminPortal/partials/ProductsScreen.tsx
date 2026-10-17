"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ImageOff, Pencil, Plus, Star } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import {
  useGetCategoriesQuery,
  useGetMainCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/redux/features/catalog/catalogApi";
import { refId, refName } from "@/redux/features/catalog/catalog.types";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/redux/features/product/productApi";
import { salePrice, type Product } from "@/redux/features/product/product.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatMoney } from "@/shared/libs/admin/format";
import { cn } from "@/shared/utils/cn";
import { Button, ButtonLink } from "../components/Button";
import { ExcelActions } from "../components/ExcelActions";
import { FilterSelect } from "../components/Field";
import { downloadProducts, productImporter } from "../config/excel/products";
import { NoticeLine, SearchBox } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { Table, TableScroll, Td, Th, Tr } from "../components/Table";
import { ConfirmAction } from "../components/ConfirmAction";
import { StatusSwitch } from "../components/StatusSwitch";
import { LOW_STOCK, PRODUCTS_HREF, PRODUCTS_PAGE_SIZE } from "../config/catalog";

const SEARCH_DELAY = 300;

type Report = (tone: "good" | "danger", text: string) => void;

export function ProductsScreen() {
  const dispatch = useAppDispatch();
  const notice = useAppSelector(selectNotice("products"));

  const [typed, setTyped] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [page, setPage] = useState(1);

  // Wait for a pause in typing before asking the server.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchTerm(typed.trim());
      setPage(1);
    }, SEARCH_DELAY);
    return () => window.clearTimeout(timer);
  }, [typed]);

  const mainCategories = useGetMainCategoriesQuery({ status: "active" });
  const categories = useGetCategoriesQuery({ status: "active" });
  const subCategories = useGetSubCategoriesQuery({ status: "active" });

  // The category filter lists only aisles inside the chosen main category.
  const chosenMain = mainCategories.data?.items.find((each) => each.slug === mainCategory);
  const aisles = (categories.data?.items ?? []).filter(
    (each) => !chosenMain || refId(each.mainCategoryId) === chosenMain._id,
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useGetProductsQuery({
    page,
    limit: PRODUCTS_PAGE_SIZE,
    searchTerm,
    mainCategory,
    category,
    featured: featured ? "true" : undefined,
  });

  const products = data?.items ?? [];
  const meta = data?.meta;
  // A full page may mean more pages even if the reported total says otherwise.
  const hasNext = meta ? page < meta.totalPage || products.length === PRODUCTS_PAGE_SIZE : false;
  const filtered = searchTerm !== "" || mainCategory !== "" || category !== "" || featured;
  const first = (page - 1) * PRODUCTS_PAGE_SIZE + 1;

  const report: Report = (tone, text) => dispatch(showNotice({ scope: "products", tone, text }));
  const setFilter = (apply: () => void) => {
    apply();
    setPage(1);
  };

  const nothingToFileUnder =
    !mainCategories.isLoading &&
    !categories.isLoading &&
    !subCategories.isLoading &&
    (!mainCategories.data?.items.length || !categories.data?.items.length || !subCategories.data?.items.length);

  return (
    <>
      <ScreenHeader
        title="Products"
        blurb="Everything for sale: prices, stock, specs, variants and where each product is filed."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <ExcelActions
              onDownload={() =>
                downloadProducts(dispatch, { searchTerm, mainCategory, category, featured: featured ? "true" : undefined })
              }
              importer={productImporter(dispatch)}
            />
            <ButtonLink href={`${PRODUCTS_HREF}/new`} variant="primary">
              <Plus className="size-4" aria-hidden />
              Add product
            </ButtonLink>
          </div>
        }
      />

      <NoticeLine notice={notice} />

      {nothingToFileUnder && (
        <p className="rounded-control border border-warning bg-warning-soft px-4 py-3 text-sm text-ink">
          Every product needs an active main category, category and sub-category. Add them under{" "}
          <Link href="/admin/main-categories" className="font-medium text-tertiary hover:underline">Main categories</Link>,{" "}
          <Link href="/admin/categories" className="font-medium text-tertiary hover:underline">Categories</Link> and{" "}
          <Link href="/admin/sub-categories" className="font-medium text-tertiary hover:underline">Sub-categories</Link>{" "}
          first.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={typed} onChange={setTyped} label="Search name or SKU" />

        <FilterSelect
          label="Main category"
          value={mainCategory}
          onChange={(event) =>
            setFilter(() => {
              setMainCategory(event.target.value);
              setCategory("");
            })
          }
        >
          <option value="">All</option>
          {mainCategories.data?.items.map((each) => (
            <option key={each._id} value={each.slug}>
              {each.name}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Category"
          value={category}
          onChange={(event) => setFilter(() => setCategory(event.target.value))}
        >
          <option value="">All</option>
          {aisles.map((each) => (
            <option key={each._id} value={each.slug}>
              {each.name}
            </option>
          ))}
        </FilterSelect>

        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFilter(() => setFeatured(event.target.checked))}
            className="size-4 accent-tertiary"
          />
          Featured only
        </label>
      </div>

      <Panel bodyClassName="py-0 md:py-0">
        {isLoading ? (
          <EmptyState title="Loading products…" />
        ) : isError ? (
          <EmptyState
            title="Couldn't load products"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : products.length === 0 && page > 1 ? (
          <EmptyState
            title="Nothing left on this page"
            action={<Button onClick={() => setPage(1)}>Back to page 1</Button>}
          />
        ) : products.length === 0 ? (
          <EmptyState
            title={filtered ? "No products match" : "No products yet"}
            body={filtered ? "Try a different search or filter." : "Add the first product and it will appear here."}
            action={
              !filtered && (
                <ButtonLink href={`${PRODUCTS_HREF}/new`} variant="primary">
                  <Plus className="size-4" aria-hidden />
                  Add product
                </ButtonLink>
              )
            }
          />
        ) : (
          <>
            <TableScroll>
              <Table className={cn("min-w-5xl transition-opacity", isFetching && "opacity-60")}>
                <caption className="sr-only">Products</caption>
                <thead>
                  <tr>
                    <Th className="min-w-72">Product</Th>
                    <Th className="w-52">Filed under</Th>
                    <Th className="w-32 text-right">Price</Th>
                    <Th className="w-32">Stock</Th>
                    <Th className="w-20 text-center">Featured</Th>
                    <Th className="w-36">Status</Th>
                    <Th className="w-20">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <ProductRow key={product._id} product={product} report={report} />
                  ))}
                </tbody>
              </Table>
            </TableScroll>

            <nav
              aria-label="Pages"
              className="-mx-4 flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm md:-mx-5 md:px-5"
            >
              <p className="text-ink-muted">
                Showing {first}–{first + products.length - 1}
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" disabled={page === 1 || isFetching} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="size-4" aria-hidden />
                  Previous
                </Button>
                <span className="px-1 text-ink-muted tabular-nums">Page {page}</span>
                <Button size="sm" disabled={!hasNext || isFetching} onClick={() => setPage(page + 1)}>
                  Next
                  <ChevronRight className="size-4" aria-hidden />
                </Button>
              </div>
            </nav>
          </>
        )}
      </Panel>
    </>
  );
}

function StockPill({ stock }: { stock: number }) {
  if (stock === 0) return <StatusPill label="Out of stock" tone="critical" />;
  if (stock <= LOW_STOCK) return <StatusPill label={`Only ${stock} left`} tone="warning" />;
  return <StatusPill label={`${stock} in stock`} tone="neutral" />;
}

function ProductRow({ product, report }: { product: Product; report: Report }) {
  const [update, { isLoading: saving }] = useUpdateProductMutation();
  const [remove, { isLoading: removing }] = useDeleteProductMutation();
  const photo = product.images[0]?.url;
  const live = product.status === "active";
  const mainCategory = refName(product.mainCategoryId);
  const category = refName(product.categoryId);
  const subCategory = refName(product.subCategoryId);
  const variantCount = product.hasVariants ? product.variants.length : 0;

  const save = async (changes: Parameters<typeof update>[0]["changes"], done: string) => {
    try {
      await update({ id: product._id, changes }).unwrap();
      report("good", done);
    } catch (problem) {
      report("danger", apiErrorMessage(problem));
    }
  };

  const deleteProduct = async () => {
    try {
      await remove(product._id).unwrap();
      report("good", `${product.name} was deleted.`);
    } catch (problem) {
      report("danger", apiErrorMessage(problem));
    }
  };

  return (
    <Tr aria-busy={saving || removing}>
      <Td className="max-w-0">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-control border border-line bg-surface">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="h-full w-full object-contain" />
            ) : (
              <ImageOff className="size-4 text-ink-subtle" aria-label="No photo" />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{product.name}</p>
            <p className="truncate text-xs text-ink-muted">
              {variantCount ? `${variantCount} ${variantCount === 1 ? "variant" : "variants"}` : product.sku}
              {product.isUpcoming && <> · Coming soon</>}
              {product.isExclusive && <> · Exclusive</>}
            </p>
          </div>
        </div>
      </Td>
      <Td className="text-ink-muted">
        <p className="truncate">{[mainCategory, category].filter(Boolean).join(" › ") || "—"}</p>
        {subCategory && <p className="truncate text-xs text-ink-subtle">{subCategory}</p>}
      </Td>
      <Td className="text-right tabular-nums whitespace-nowrap">
        <p className="font-medium text-ink">
          {variantCount > 0 && <span className="text-xs font-normal text-ink-subtle">from </span>}
          {formatMoney(salePrice(product))}
        </p>
        {product.discount > 0 && (
          <p className="text-xs text-ink-subtle line-through">{formatMoney(product.price)}</p>
        )}
      </Td>
      <Td>
        <StockPill stock={product.stock} />
      </Td>
      <Td className="text-center">
        <button
          type="button"
          aria-pressed={product.isFeatured}
          aria-label={`Feature ${product.name}`}
          disabled={saving}
          onClick={() =>
            save(
              { isFeatured: !product.isFeatured },
              product.isFeatured ? `${product.name} is no longer featured.` : `${product.name} is featured.`,
            )
          }
          className="rounded-control p-1.5 transition-colors hover:bg-surface-muted disabled:opacity-50"
        >
          <Star
            className={cn("size-5", product.isFeatured ? "fill-warning text-warning" : "text-line-strong")}
            aria-hidden
          />
        </button>
      </Td>
      <Td>
        <StatusSwitch
          label={product.name}
          on={live}
          disabled={saving}
          onText="In shop"
          offText="Hidden"
          onToggle={() =>
            save(
              { status: live ? "inactive" : "active" },
              live ? `${product.name} is hidden from the shop.` : `${product.name} is back in the shop.`,
            )
          }
        />
      </Td>
      <Td className="text-right">
        <div className="flex items-center justify-end gap-2">
          <ButtonLink href={`${PRODUCTS_HREF}/${product.slug}/edit`} size="sm" aria-label={`Edit ${product.name}`}>
            <Pencil className="size-3.5" aria-hidden />
            Edit
          </ButtonLink>
          {/* For good: the backend removes it and its photos. */}
          <ConfirmAction label="Delete" confirmLabel="Delete for good" cancelLabel="Keep" onConfirm={deleteProduct} />
        </div>
      </Td>
    </Tr>
  );
}
