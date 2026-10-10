"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetMainCategoriesQuery,
  useGetSubCategoriesQuery,
  useSaveBrandMutation,
  useSaveCategoryMutation,
  useSaveMainCategoryMutation,
  useSaveSubCategoryMutation,
} from "@/redux/features/catalog/catalogApi";
import {
  catalogLogo,
  type CatalogItem,
  type CatalogKind,
  type CatalogStatus,
  type SaveCatalogArgs,
} from "@/redux/features/catalog/catalog.types";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatDate } from "@/shared/libs/admin/format";
import { cn } from "@/shared/utils/cn";
import { initials } from "@/shared/utils/initials";
import { Button, ButtonLink } from "../components/Button";
import { NoticeLine, SearchBox, StatusTabs } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusSwitch } from "../components/StatusSwitch";
import { Table, TableScroll, Td, Th, Tr } from "../components/Table";
import { CATALOG_COPY } from "../config/catalog";

// One list for whichever kind this screen shows, plus the active items of the
// level above it (to warn when there's nothing to file under). All hooks run;
// the unused ones are skipped so only the needed requests go out.
export function useCatalogList(kind: CatalogKind, status: CatalogStatus) {
  const parentKind = CATALOG_COPY[kind].parent?.kind;

  const mainCategories = useGetMainCategoriesQuery({ status }, { skip: kind !== "mainCategory" });
  const brands = useGetBrandsQuery({ status }, { skip: kind !== "brand" });
  const categories = useGetCategoriesQuery({ status }, { skip: kind !== "category" });
  const subCategories = useGetSubCategoriesQuery({ status }, { skip: kind !== "subCategory" });
  const activeMainCategories = useGetMainCategoriesQuery({ status: "active" }, { skip: parentKind !== "mainCategory" });
  const activeCategories = useGetCategoriesQuery({ status: "active" }, { skip: parentKind !== "category" });

  const list = { mainCategory: mainCategories, brand: brands, category: categories, subCategory: subCategories }[kind];
  const parents = parentKind === "mainCategory" ? activeMainCategories : parentKind === "category" ? activeCategories : null;

  return {
    list,
    items: (list.data?.items ?? []) as CatalogItem[],
    parents: (parents?.data?.items ?? []) as { _id: string; name: string }[],
    parentsLoading: parents?.isLoading ?? false,
  };
}

// One save for whichever kind is being edited.
export function useCatalogSave(kind: CatalogKind) {
  const [saveMainCategory, mainCategorySave] = useSaveMainCategoryMutation();
  const [saveBrand, brandSave] = useSaveBrandMutation();
  const [saveCategory, categorySave] = useSaveCategoryMutation();
  const [saveSubCategory, subCategorySave] = useSaveSubCategoryMutation();

  const save = { mainCategory: saveMainCategory, brand: saveBrand, category: saveCategory, subCategory: saveSubCategory }[kind];
  const state = { mainCategory: mainCategorySave, brand: brandSave, category: categorySave, subCategory: subCategorySave }[kind];

  return { save: (args: SaveCatalogArgs) => save(args).unwrap(), saving: state.isLoading };
}

export function CatalogScreen({ kind }: { kind: CatalogKind }) {
  const copy = CATALOG_COPY[kind];
  const dispatch = useAppDispatch();
  const notice = useAppSelector(selectNotice("catalog"));
  const [tab, setTab] = useState<CatalogStatus>("active");
  const [query, setQuery] = useState("");

  const { list, items, parents, parentsLoading } = useCatalogList(kind, tab);
  const { save, saving } = useCatalogSave(kind);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => item.name.toLowerCase().includes(needle) || item.slug.includes(needle));
  }, [items, query]);

  const report = (tone: "good" | "danger", text: string) => dispatch(showNotice({ scope: "catalog", tone, text }));

  const toggle = async (item: CatalogItem) => {
    const next: CatalogStatus = item.status === "active" ? "inactive" : "active";
    try {
      await save({ id: item._id, fields: { status: next } });
      report("good", `${item.name} is ${next}.`);
    } catch (problem) {
      report("danger", apiErrorMessage(problem));
    }
  };

  const needsParent = copy.parent && !parentsLoading && parents.length === 0;
  const addButton = (
    <ButtonLink href={`${copy.href}/new`} variant="primary">
      <Plus className="size-4" aria-hidden />
      Add {copy.singular}
    </ButtonLink>
  );

  return (
    <>
      <ScreenHeader title={copy.title} blurb={copy.blurb} actions={addButton} />

      <NoticeLine notice={notice} />

      {needsParent && copy.parent && (
        <p className="rounded-control border border-warning bg-warning-soft px-4 py-3 text-sm text-ink">
          Every {copy.singular} sits inside a {copy.parent.label.toLowerCase()}, and there are no active ones yet.{" "}
          <Link href={copy.parent.href} className="font-medium text-tertiary hover:underline">
            Add a {copy.parent.label.toLowerCase()} first
          </Link>
          .
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusTabs value={tab} onChange={setTab} />
        <SearchBox value={query} onChange={setQuery} label={`Search ${copy.title.toLowerCase()}`} />
      </div>

      <Panel bodyClassName="py-0 md:py-0">
        {list.isLoading ? (
          <EmptyState title="Loading…" />
        ) : list.isError ? (
          <EmptyState
            title={`Couldn't load ${copy.title.toLowerCase()}`}
            body={apiErrorMessage(list.error)}
            action={<Button onClick={() => list.refetch()}>Try again</Button>}
          />
        ) : shown.length === 0 ? (
          <EmptyState
            title={query ? "Nothing matches" : `No ${tab} ${copy.title.toLowerCase()}`}
            body={
              query
                ? "Try a different name."
                : tab === "active"
                  ? `Add the first ${copy.singular} and it will appear here.`
                  : `Switched-off ${copy.title.toLowerCase()} appear here.`
            }
            action={!query && tab === "active" && !needsParent && addButton}
          />
        ) : (
          <TableScroll>
            <Table className={cn("min-w-3xl transition-opacity", list.isFetching && "opacity-60")}>
              <caption className="sr-only">{copy.title}</caption>
              <thead>
                <tr>
                  <Th className="min-w-56">Name</Th>
                  {copy.parent && <Th className="w-48">{copy.parent.label}</Th>}
                  <Th>Description</Th>
                  <Th className="w-36">Status</Th>
                  <Th className="w-28">Added</Th>
                  <Th className="w-20">
                    <span className="sr-only">Actions</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {shown.map((item) => (
                  <Tr key={item._id}>
                    <Td className="max-w-0">
                      <div className="flex items-center gap-3">
                        {copy.hasLogo && <Thumb item={item} />}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{item.name}</p>
                          <p className="truncate text-xs text-ink-muted">/{item.slug}</p>
                        </div>
                      </div>
                    </Td>
                    {copy.parent && <Td className="text-ink-muted">{parentName(item, parents)}</Td>}
                    <Td className="max-w-0 text-ink-muted">
                      <p className="truncate">{item.description || "—"}</p>
                    </Td>
                    <Td>
                      <StatusSwitch
                        label={item.name}
                        on={item.status === "active"}
                        disabled={saving}
                        onToggle={() => toggle(item)}
                      />
                    </Td>
                    <Td className="whitespace-nowrap text-ink-muted">{formatDate(item.createdAt)}</Td>
                    <Td className="text-right">
                      <ButtonLink href={`${copy.href}/${item.slug}/edit`} size="sm" aria-label={`Edit ${item.name}`}>
                        <Pencil className="size-3.5" aria-hidden />
                        Edit
                      </ButtonLink>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </Panel>
    </>
  );
}

// Lists come back with the parent populated; fall back to the active list.
const parentName = (item: CatalogItem, parents: { _id: string; name: string }[]) => {
  const ref = "mainCategoryId" in item ? item.mainCategoryId : "categoryId" in item ? item.categoryId : null;
  if (ref && typeof ref !== "string") return ref.name;
  return parents.find((each) => each._id === ref)?.name ?? "—";
};

export function Thumb({ item, className }: { item: CatalogItem; className?: string }) {
  const url = catalogLogo(item);
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center overflow-hidden rounded-control border border-line bg-surface-muted text-xs font-semibold text-ink-muted",
        className,
      )}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-full w-full object-contain" />
      ) : (
        initials(item.name) || "?"
      )}
    </span>
  );
}
