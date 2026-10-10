"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import {
  useGetAttributeGroupsQuery,
  useGetAttributesQuery,
  useSaveAttributeMutation,
} from "@/redux/features/attribute/attributeApi";
import { hasOptions, type Attribute } from "@/redux/features/attribute/attribute.types";
import { useGetMainCategoriesQuery } from "@/redux/features/catalog/catalogApi";
import type { CatalogStatus } from "@/redux/features/catalog/catalog.types";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/shared/utils/cn";
import { Button, ButtonLink } from "../components/Button";
import { FilterSelect } from "../components/Field";
import { NoticeLine, SearchBox, StatusTabs } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { StatusSwitch } from "../components/StatusSwitch";
import { Table, TableScroll, Td, Th, Tr } from "../components/Table";
import { ATTRIBUTES_HREF, ATTRIBUTE_GROUPS_HREF, ATTRIBUTE_TYPE_META } from "../config/catalog";
import { MainCategoryList } from "./AttributeGroupsScreen";

export const ATTRIBUTES_BLURB =
  "The specs a product can have, like Colour, Storage or Battery. A product fills in the attributes of its main category; pick-one attributes can also define its variants.";

// Shows at most this many option labels in a row before "+N more".
const OPTIONS_PREVIEW = 4;

export function AttributesScreen({ initialGroup = "" }: { initialGroup?: string }) {
  const dispatch = useAppDispatch();
  const notice = useAppSelector(selectNotice("specs"));
  const [tab, setTab] = useState<CatalogStatus>("active");
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState(initialGroup);
  const [mainCategory, setMainCategory] = useState("");

  const attributes = useGetAttributesQuery({
    status: tab,
    groupId: group || undefined,
    mainCategoryIds: mainCategory || undefined,
  });
  // All groups, so rows filed under a switched-off group still show its name.
  const groups = useGetAttributeGroupsQuery();
  const mainCategories = useGetMainCategoriesQuery({ status: "active" });
  const [save, { isLoading: saving }] = useSaveAttributeMutation();

  const groupList = useMemo(() => groups.data?.items ?? [], [groups.data]);
  const groupName = (id: string) => groupList.find((each) => each._id === id)?.name ?? "—";

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const items = attributes.data?.items ?? [];
    return needle ? items.filter((each) => each.name.toLowerCase().includes(needle)) : items;
  }, [attributes.data, query]);

  const toggle = async (attribute: Attribute) => {
    const next: CatalogStatus = attribute.status === "active" ? "inactive" : "active";
    try {
      await save({ id: attribute._id, fields: { status: next } }).unwrap();
      dispatch(showNotice({ scope: "specs", tone: "good", text: `${attribute.name} is ${next}.` }));
    } catch (problem) {
      dispatch(showNotice({ scope: "specs", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  const noGroups = !groups.isLoading && !groupList.some((each) => each.status === "active");
  const filtered = query !== "" || group !== "" || mainCategory !== "";
  const addButton = (
    <ButtonLink href={`${ATTRIBUTES_HREF}/new`} variant="primary">
      <Plus className="size-4" aria-hidden />
      Add attribute
    </ButtonLink>
  );

  return (
    <>
      <ScreenHeader title="Attributes" blurb={ATTRIBUTES_BLURB} actions={addButton} />

      <NoticeLine notice={notice} />

      {noGroups && (
        <p className="rounded-control border border-warning bg-warning-soft px-4 py-3 text-sm text-ink">
          Every attribute is listed under a group, and there are no active groups yet.{" "}
          <Link href={`${ATTRIBUTE_GROUPS_HREF}/new`} className="font-medium text-tertiary hover:underline">
            Add a group first
          </Link>
          .
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <StatusTabs value={tab} onChange={setTab} />
        <FilterSelect label="Group" value={group} onChange={(event) => setGroup(event.target.value)}>
          <option value="">All</option>
          {groupList.map((each) => (
            <option key={each._id} value={each._id}>
              {each.name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Main category" value={mainCategory} onChange={(event) => setMainCategory(event.target.value)}>
          <option value="">All</option>
          {mainCategories.data?.items.map((each) => (
            <option key={each._id} value={each._id}>
              {each.name}
            </option>
          ))}
        </FilterSelect>
        <SearchBox value={query} onChange={setQuery} label="Search attributes" className="sm:ml-auto" />
      </div>

      <Panel bodyClassName="py-0 md:py-0">
        {attributes.isLoading ? (
          <EmptyState title="Loading…" />
        ) : attributes.isError ? (
          <EmptyState
            title="Couldn't load attributes"
            body={apiErrorMessage(attributes.error)}
            action={<Button onClick={() => attributes.refetch()}>Try again</Button>}
          />
        ) : shown.length === 0 ? (
          <EmptyState
            title={filtered ? "Nothing matches" : `No ${tab} attributes`}
            body={
              filtered
                ? "Try a different name or filter."
                : tab === "active"
                  ? "Add the first attribute, like Colour, and it will appear here."
                  : "Switched-off attributes appear here."
            }
            action={!filtered && tab === "active" && !noGroups && addButton}
          />
        ) : (
          <TableScroll>
            <Table className={cn("min-w-4xl transition-opacity", attributes.isFetching && "opacity-60")}>
              <caption className="sr-only">Attributes</caption>
              <thead>
                <tr>
                  <Th className="min-w-56">Attribute</Th>
                  <Th className="w-28">Type</Th>
                  <Th className="w-36">Group</Th>
                  <Th className="min-w-40">Main categories</Th>
                  <Th className="w-40">Rules</Th>
                  <Th className="w-36">Status</Th>
                  <Th className="w-20">
                    <span className="sr-only">Actions</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {shown.map((attribute) => (
                  <Tr key={attribute._id}>
                    <Td className="max-w-0">
                      <p className="truncate font-medium text-ink">{attribute.name}</p>
                      {hasOptions(attribute.type) && attribute.options?.length ? (
                        <p className="truncate text-xs text-ink-muted">
                          {attribute.options
                            .slice(0, OPTIONS_PREVIEW)
                            .map((option) => option.label)
                            .join(", ")}
                          {attribute.options.length > OPTIONS_PREVIEW &&
                            ` +${attribute.options.length - OPTIONS_PREVIEW} more`}
                        </p>
                      ) : (
                        <p className="truncate text-xs text-ink-muted">/{attribute.slug}</p>
                      )}
                    </Td>
                    <Td className="text-ink-muted">{ATTRIBUTE_TYPE_META[attribute.type].label}</Td>
                    <Td className="text-ink-muted">{groupName(attribute.groupId)}</Td>
                    <Td className="text-ink-muted">
                      <MainCategoryList refs={attribute.mainCategoryIds} />
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        {attribute.isRequired && <StatusPill label="Required" tone="warning" />}
                        {attribute.isFilterable && <StatusPill label="Filter" tone="flow-2" />}
                        {!attribute.isRequired && !attribute.isFilterable && <span className="text-ink-subtle">—</span>}
                      </div>
                    </Td>
                    <Td>
                      <StatusSwitch
                        label={attribute.name}
                        on={attribute.status === "active"}
                        disabled={saving}
                        onToggle={() => toggle(attribute)}
                      />
                    </Td>
                    <Td className="text-right">
                      <ButtonLink href={`${ATTRIBUTES_HREF}/${attribute._id}/edit`} size="sm" aria-label={`Edit ${attribute.name}`}>
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
