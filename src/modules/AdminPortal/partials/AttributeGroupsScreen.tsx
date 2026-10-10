"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import {
  useGetAttributeGroupsQuery,
  useGetAttributesQuery,
  useSaveAttributeGroupMutation,
} from "@/redux/features/attribute/attributeApi";
import type { AttributeGroup } from "@/redux/features/attribute/attribute.types";
import { useGetMainCategoriesQuery } from "@/redux/features/catalog/catalogApi";
import { refName, type CatalogStatus } from "@/redux/features/catalog/catalog.types";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatDate } from "@/shared/libs/admin/format";
import { cn } from "@/shared/utils/cn";
import { Button, ButtonLink } from "../components/Button";
import { NoticeLine, SearchBox, StatusTabs } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusSwitch } from "../components/StatusSwitch";
import { Table, TableScroll, Td, Th, Tr } from "../components/Table";
import { ATTRIBUTES_HREF, ATTRIBUTE_GROUPS_HREF, MAIN_CATEGORIES_HREF } from "../config/catalog";

export const GROUPS_BLURB =
  "Headings that a product's specs are listed under, like Display, Battery or Camera. Each group is offered only in the main categories you tick.";

export function AttributeGroupsScreen() {
  const dispatch = useAppDispatch();
  const notice = useAppSelector(selectNotice("specs"));
  const [tab, setTab] = useState<CatalogStatus>("active");
  const [query, setQuery] = useState("");

  const groups = useGetAttributeGroupsQuery({ status: tab });
  const attributes = useGetAttributesQuery({ status: "active" });
  const mainCategories = useGetMainCategoriesQuery({ status: "active" });
  const [save, { isLoading: saving }] = useSaveAttributeGroupMutation();

  const items = useMemo(() => groups.data?.items ?? [], [groups.data]);
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? items.filter((each) => each.name.toLowerCase().includes(needle)) : items;
  }, [items, query]);

  const counts = useMemo(() => {
    const tally = new Map<string, number>();
    for (const each of attributes.data?.items ?? []) tally.set(each.groupId, (tally.get(each.groupId) ?? 0) + 1);
    return tally;
  }, [attributes.data]);

  const toggle = async (group: AttributeGroup) => {
    const next: CatalogStatus = group.status === "active" ? "inactive" : "active";
    try {
      await save({ id: group._id, fields: { status: next } }).unwrap();
      dispatch(showNotice({ scope: "specs", tone: "good", text: `${group.name} is ${next}.` }));
    } catch (problem) {
      dispatch(showNotice({ scope: "specs", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  const noMainCategories = !mainCategories.isLoading && (mainCategories.data?.items.length ?? 0) === 0;
  const addButton = (
    <ButtonLink href={`${ATTRIBUTE_GROUPS_HREF}/new`} variant="primary">
      <Plus className="size-4" aria-hidden />
      Add group
    </ButtonLink>
  );

  return (
    <>
      <ScreenHeader title="Attribute groups" blurb={GROUPS_BLURB} actions={addButton} />

      <NoticeLine notice={notice} />

      {noMainCategories && (
        <p className="rounded-control border border-warning bg-warning-soft px-4 py-3 text-sm text-ink">
          Every group belongs to at least one main category, and there are no active ones yet.{" "}
          <Link href={`${MAIN_CATEGORIES_HREF}/new`} className="font-medium text-tertiary hover:underline">
            Add a main category first
          </Link>
          .
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusTabs value={tab} onChange={setTab} />
        <SearchBox value={query} onChange={setQuery} label="Search groups" />
      </div>

      <Panel bodyClassName="py-0 md:py-0">
        {groups.isLoading ? (
          <EmptyState title="Loading…" />
        ) : groups.isError ? (
          <EmptyState
            title="Couldn't load attribute groups"
            body={apiErrorMessage(groups.error)}
            action={<Button onClick={() => groups.refetch()}>Try again</Button>}
          />
        ) : shown.length === 0 ? (
          <EmptyState
            title={query ? "Nothing matches" : `No ${tab} groups`}
            body={
              query
                ? "Try a different name."
                : tab === "active"
                  ? "Add the first group, like Display, and it will appear here."
                  : "Switched-off groups appear here."
            }
            action={!query && tab === "active" && !noMainCategories && addButton}
          />
        ) : (
          <TableScroll>
            <Table className={cn("min-w-3xl transition-opacity", groups.isFetching && "opacity-60")}>
              <caption className="sr-only">Attribute groups</caption>
              <thead>
                <tr>
                  <Th className="min-w-48">Group</Th>
                  <Th>Main categories</Th>
                  <Th className="w-32">Attributes</Th>
                  <Th className="w-36">Status</Th>
                  <Th className="w-28">Added</Th>
                  <Th className="w-20">
                    <span className="sr-only">Actions</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {shown.map((group) => {
                  const count = counts.get(group._id) ?? 0;
                  return (
                    <Tr key={group._id}>
                      <Td className="max-w-0">
                        <p className="truncate font-medium text-ink">{group.name}</p>
                        <p className="truncate text-xs text-ink-muted">/{group.slug}</p>
                      </Td>
                      <Td className="text-ink-muted">
                        <MainCategoryList refs={group.mainCategoryIds} />
                      </Td>
                      <Td className="tabular-nums">
                        <Link href={`${ATTRIBUTES_HREF}?group=${group._id}`} className="text-tertiary hover:underline">
                          {count} {count === 1 ? "attribute" : "attributes"}
                        </Link>
                      </Td>
                      <Td>
                        <StatusSwitch
                          label={group.name}
                          on={group.status === "active"}
                          disabled={saving}
                          onToggle={() => toggle(group)}
                        />
                      </Td>
                      <Td className="whitespace-nowrap text-ink-muted">{formatDate(group.createdAt)}</Td>
                      <Td className="text-right">
                        <ButtonLink
                          href={`${ATTRIBUTE_GROUPS_HREF}/${group._id}/edit`}
                          size="sm"
                          aria-label={`Edit ${group.name}`}
                        >
                          <Pencil className="size-3.5" aria-hidden />
                          Edit
                        </ButtonLink>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </Panel>
    </>
  );
}

export function MainCategoryList({ refs }: { refs: AttributeGroup["mainCategoryIds"] }) {
  const names = refs.map(refName).filter(Boolean);
  if (names.length === 0) return <span>—</span>;
  return <span className="line-clamp-2">{names.join(", ")}</span>;
}
