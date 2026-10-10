"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useGetAttributeGroupQuery, useSaveAttributeGroupMutation } from "@/redux/features/attribute/attributeApi";
import type { AttributeGroup, AttributeGroupFields } from "@/redux/features/attribute/attribute.types";
import { useGetMainCategoriesQuery } from "@/redux/features/catalog/catalogApi";
import { refId, type CatalogStatus } from "@/redux/features/catalog/catalog.types";
import { clearNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button, ButtonLink } from "../components/Button";
import { ChoiceChips } from "../components/ChoiceChips";
import { Field, Input, Select } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { ATTRIBUTE_GROUPS_HREF, CATALOG_STATUS_META, MAIN_CATEGORIES_HREF } from "../config/catalog";
import { GROUPS_BLURB } from "./AttributeGroupsScreen";

export const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((each) => b.includes(each));

// `id` given → edit that group; no `id` → add a new one.
export function AttributeGroupFormScreen({ id }: { id?: string }) {
  const dispatch = useAppDispatch();
  const editing = id !== undefined;
  const { data: group, isLoading, isError, error, refetch } = useGetAttributeGroupQuery(id ?? "", { skip: !editing });

  // Opening a form starts a fresh visit; drop any old list message.
  useEffect(() => {
    dispatch(clearNotice());
  }, [dispatch]);

  return (
    <>
      <ScreenHeader
        title={editing ? "Edit attribute group" : "Add attribute group"}
        blurb={GROUPS_BLURB}
        actions={
          <ButtonLink href={ATTRIBUTE_GROUPS_HREF}>
            <ArrowLeft className="size-4" aria-hidden />
            All groups
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
            title="Couldn't load this group"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        </Panel>
      ) : (
        <GroupForm key={group?._id ?? "new"} group={editing ? group : undefined} />
      )}
    </>
  );
}

function GroupForm({ group }: { group?: AttributeGroup }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mainCategories = useGetMainCategoriesQuery({ status: "active" });
  const [save, { isLoading: saving }] = useSaveAttributeGroupMutation();

  const initialIds = group ? group.mainCategoryIds.map(refId) : [];
  const [name, setName] = useState(group?.name ?? "");
  const [mainCategoryIds, setMainCategoryIds] = useState<string[]>(initialIds);
  const [status, setStatus] = useState<CatalogStatus>(group?.status ?? "active");
  const [errors, setErrors] = useState<{ name?: string; mainCategoryIds?: string; submit?: string }>({});

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    const next = {
      name: trimmed ? undefined : "Give the group a name.",
      mainCategoryIds: mainCategoryIds.length ? undefined : "Tick at least one main category.",
    };
    setErrors(next);
    if (next.name || next.mainCategoryIds) return;

    const fields: AttributeGroupFields = {};
    if (!group || trimmed !== group.name) fields.name = trimmed;
    if (!group || !sameSet(mainCategoryIds, initialIds)) fields.mainCategoryIds = mainCategoryIds;
    if (!group || status !== group.status) fields.status = status;

    try {
      if (!group || Object.keys(fields).length) await save({ id: group?._id, fields }).unwrap();
      dispatch(showNotice({ scope: "specs", tone: "good", text: `${trimmed} ${group ? "saved" : "added"}.` }));
      router.push(ATTRIBUTE_GROUPS_HREF);
    } catch (problem) {
      setErrors({ submit: apiErrorMessage(problem) });
    }
  };

  const noMainCategories = !mainCategories.isLoading && (mainCategories.data?.items.length ?? 0) === 0;

  return (
    <form onSubmit={submit} noValidate className="max-w-3xl">
      <Panel>
        <fieldset disabled={saving} className="grid min-w-0 gap-4 sm:grid-cols-2">
          <legend className="sr-only">{group ? `Edit ${group.name}` : "New attribute group"}</legend>

          <Field label="Name" hint="Shown as a heading in the product's spec table." error={errors.name}>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Display" autoFocus={!group} />
          </Field>

          <Field label="Status">
            <Select value={status} onChange={(event) => setStatus(event.target.value as CatalogStatus)}>
              {(["active", "inactive"] as const).map((value) => (
                <option key={value} value={value}>
                  {CATALOG_STATUS_META[value].label}
                </option>
              ))}
            </Select>
          </Field>

          <ChoiceChips
            legend="Main categories"
            options={(mainCategories.data?.items ?? []).map((each) => ({ value: each._id, label: each.name }))}
            value={mainCategoryIds}
            onChange={setMainCategoryIds}
            hint="Where this group is offered."
            error={errors.mainCategoryIds}
            empty="There are no active main categories yet."
            className="sm:col-span-2"
          />
        </fieldset>
      </Panel>

      {noMainCategories && (
        <p className="mt-3 text-sm text-ink-muted">
          <Link href={`${MAIN_CATEGORIES_HREF}/new`} className="font-medium text-tertiary hover:underline">
            Add a main category first →
          </Link>
        </p>
      )}

      {errors.submit && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {errors.submit}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <ButtonLink href={ATTRIBUTE_GROUPS_HREF}>Cancel</ButtonLink>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving…" : group ? "Save changes" : "Add group"}
        </Button>
      </div>
    </form>
  );
}
