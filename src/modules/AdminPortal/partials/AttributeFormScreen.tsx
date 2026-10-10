"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import {
  useGetAttributeGroupsQuery,
  useGetAttributeQuery,
  useSaveAttributeMutation,
} from "@/redux/features/attribute/attributeApi";
import {
  hasOptions,
  type Attribute,
  type AttributeFields,
  type AttributeOption,
  type AttributeType,
} from "@/redux/features/attribute/attribute.types";
import { useGetMainCategoriesQuery } from "@/redux/features/catalog/catalogApi";
import { refId, type CatalogStatus } from "@/redux/features/catalog/catalog.types";
import { clearNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button, ButtonLink } from "../components/Button";
import { ChoiceChips } from "../components/ChoiceChips";
import { Field, Input, Select } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import {
  ATTRIBUTES_HREF,
  ATTRIBUTE_GROUPS_HREF,
  ATTRIBUTE_TYPES,
  ATTRIBUTE_TYPE_META,
  CATALOG_STATUS_META,
  optionValue,
} from "../config/catalog";
import { sameSet } from "./AttributeGroupFormScreen";
import { ATTRIBUTES_BLURB } from "./AttributesScreen";

const sameOptions = (a: AttributeOption[], b: AttributeOption[]) =>
  a.length === b.length && a.every((each, index) => each.label === b[index].label && each.value === b[index].value);

// `id` given → edit that attribute; no `id` → add a new one.
export function AttributeFormScreen({ id }: { id?: string }) {
  const dispatch = useAppDispatch();
  const editing = id !== undefined;
  const { data: attribute, isLoading, isError, error, refetch } = useGetAttributeQuery(id ?? "", { skip: !editing });

  // Opening a form starts a fresh visit; drop any old list message.
  useEffect(() => {
    dispatch(clearNotice());
  }, [dispatch]);

  return (
    <>
      <ScreenHeader
        title={editing ? "Edit attribute" : "Add attribute"}
        blurb={ATTRIBUTES_BLURB}
        actions={
          <ButtonLink href={ATTRIBUTES_HREF}>
            <ArrowLeft className="size-4" aria-hidden />
            All attributes
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
            title="Couldn't load this attribute"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        </Panel>
      ) : (
        <AttributeForm key={attribute?._id ?? "new"} attribute={editing ? attribute : undefined} />
      )}
    </>
  );
}

type OptionRow = AttributeOption & { key: number; valueEdited: boolean };

// Stable React keys for option rows, which have no id of their own.
let optionKey = 0;

const optionRow = (option: AttributeOption = { label: "", value: "" }): OptionRow => ({
  ...option,
  key: optionKey++,
  valueEdited: option.value !== "" && option.value !== optionValue(option.label),
});

type Errors = { name?: string; groupId?: string; mainCategoryIds?: string; options?: string; submit?: string };

function AttributeForm({ attribute }: { attribute?: Attribute }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const groups = useGetAttributeGroupsQuery({ status: "active" });
  const mainCategories = useGetMainCategoriesQuery({ status: "active" });
  const [save, { isLoading: saving }] = useSaveAttributeMutation();

  const groupList = groups.data?.items ?? [];
  const initialIds = attribute ? attribute.mainCategoryIds.map(refId) : [];
  const initialOptions = attribute?.options ?? [];

  const [name, setName] = useState(attribute?.name ?? "");
  const [type, setType] = useState<AttributeType>(attribute?.type ?? "select");
  const [groupId, setGroupId] = useState(attribute?.groupId ?? "");
  const [mainCategoryIds, setMainCategoryIds] = useState<string[]>(initialIds);
  const [options, setOptions] = useState<OptionRow[]>(() =>
    initialOptions.length ? initialOptions.map((each) => optionRow(each)) : [optionRow()],
  );
  const [isRequired, setIsRequired] = useState(attribute?.isRequired ?? false);
  const [isFilterable, setIsFilterable] = useState(attribute?.isFilterable ?? false);
  const [status, setStatus] = useState<CatalogStatus>(attribute?.status ?? "active");
  const [errors, setErrors] = useState<Errors>({});

  // A new attribute starts in the same main categories as its group.
  const pickGroup = (id: string) => {
    setGroupId(id);
    const chosen = groupList.find((each) => each._id === id);
    if (chosen && mainCategoryIds.length === 0) setMainCategoryIds(chosen.mainCategoryIds.map(refId));
  };

  const editOption = (key: number, change: Partial<Pick<OptionRow, "label" | "value">>) =>
    setOptions((current) =>
      current.map((each) => {
        if (each.key !== key) return each;
        if (change.value !== undefined) return { ...each, value: change.value, valueEdited: true };
        const label = change.label ?? each.label;
        return { ...each, label, value: each.valueEdited ? each.value : optionValue(label) };
      }),
    );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    const withOptions = hasOptions(type);
    const cleaned = options
      .map((each) => ({ label: each.label.trim(), value: each.value.trim().toLowerCase() }))
      .filter((each) => each.label || each.value);
    const values = cleaned.map((each) => each.value);

    const next: Errors = {
      name: trimmed ? undefined : "Give the attribute a name.",
      groupId: groupId ? undefined : "Choose the group it's listed under.",
      mainCategoryIds: mainCategoryIds.length ? undefined : "Tick at least one main category.",
      options: !withOptions
        ? undefined
        : cleaned.length === 0
          ? "Add at least one choice."
          : cleaned.some((each) => !each.label || !each.value)
            ? "Every choice needs a label and a value."
            : new Set(values).size !== values.length
              ? "Two choices share the same value."
              : undefined,
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    const finalOptions = withOptions ? cleaned : [];
    const fields: AttributeFields = {};
    if (!attribute || trimmed !== attribute.name) fields.name = trimmed;
    if (!attribute || groupId !== attribute.groupId) fields.groupId = groupId;
    if (!attribute || !sameSet(mainCategoryIds, initialIds)) fields.mainCategoryIds = mainCategoryIds;
    // The validator checks options against `type` only when both are sent.
    if (!attribute || type !== attribute.type || !sameOptions(finalOptions, initialOptions)) {
      fields.type = type;
      if (withOptions || attribute) fields.options = finalOptions;
    }
    if (!attribute || isRequired !== attribute.isRequired) fields.isRequired = isRequired;
    if (!attribute || isFilterable !== attribute.isFilterable) fields.isFilterable = isFilterable;
    if (!attribute || status !== attribute.status) fields.status = status;

    try {
      if (!attribute || Object.keys(fields).length) await save({ id: attribute?._id, fields }).unwrap();
      dispatch(showNotice({ scope: "specs", tone: "good", text: `${trimmed} ${attribute ? "saved" : "added"}.` }));
      router.push(ATTRIBUTES_HREF);
    } catch (problem) {
      setErrors({ submit: apiErrorMessage(problem) });
    }
  };

  const noGroups = !groups.isLoading && groupList.length === 0;

  return (
    <form onSubmit={submit} noValidate className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <Panel title="Details">
        <fieldset disabled={saving} className="flex min-w-0 flex-col gap-4">
          <legend className="sr-only">{attribute ? `Edit ${attribute.name}` : "New attribute"}</legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Colour" autoFocus={!attribute} />
            </Field>

            <Field
              label="Type"
              hint={
                attribute && type !== attribute.type
                  ? "Products that already use this attribute keep their old values and may fail to save until they're updated."
                  : ATTRIBUTE_TYPE_META[type].hint
              }
            >
              <Select value={type} onChange={(event) => setType(event.target.value as AttributeType)}>
                {ATTRIBUTE_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {ATTRIBUTE_TYPE_META[value].label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          {hasOptions(type) && (
            <fieldset className="min-w-0">
              <legend className="mb-1.5 block text-sm font-medium text-ink">Choices</legend>
              <div className="mb-1 grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_2rem] gap-1.5 text-xs text-ink-subtle">
                <span>Label</span>
                <span>Value</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {options.map((option, index) => (
                  <li key={option.key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_2rem] gap-1.5">
                    <Input
                      aria-label={`Choice ${index + 1} label`}
                      value={option.label}
                      onChange={(event) => editOption(option.key, { label: event.target.value })}
                      placeholder="Midnight Black"
                    />
                    <Input
                      aria-label={`Choice ${index + 1} value`}
                      value={option.value}
                      onChange={(event) => editOption(option.key, { value: event.target.value })}
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove choice ${index + 1}`}
                      disabled={options.length === 1}
                      onClick={() => setOptions((current) => current.filter((each) => each.key !== option.key))}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </Button>
                  </li>
                ))}
              </ul>
              {errors.options ? (
                <p className="mt-1 text-xs text-danger">{errors.options}</p>
              ) : (
                <p className="mt-1 text-xs text-ink-subtle">
                  Shoppers see the label. The value is what&apos;s stored, lowercase.
                </p>
              )}
              <Button size="sm" className="mt-2" onClick={() => setOptions((current) => [...current, optionRow()])}>
                <Plus className="size-3.5" aria-hidden />
                Add choice
              </Button>
            </fieldset>
          )}
        </fieldset>
      </Panel>

      <div className="flex min-w-0 flex-col gap-5">
        <Panel title="Where it applies">
          <fieldset disabled={saving} className="flex min-w-0 flex-col gap-4">
            <legend className="sr-only">Where it applies</legend>

            <Field
              label="Group"
              error={errors.groupId}
              hint={noGroups ? "There are no active groups yet." : undefined}
            >
              <Select value={groupId} onChange={(event) => pickGroup(event.target.value)}>
                <option value="">Choose a group</option>
                {groupList.map((each) => (
                  <option key={each._id} value={each._id}>
                    {each.name}
                  </option>
                ))}
              </Select>
            </Field>
            {noGroups && (
              <Link href={`${ATTRIBUTE_GROUPS_HREF}/new`} className="-mt-2 text-sm font-medium text-tertiary hover:underline">
                Add a group first →
              </Link>
            )}

            <ChoiceChips
              legend="Main categories"
              options={(mainCategories.data?.items ?? []).map((each) => ({ value: each._id, label: each.name }))}
              value={mainCategoryIds}
              onChange={setMainCategoryIds}
              hint="Products in these main categories get this attribute."
              error={errors.mainCategoryIds}
              empty="There are no active main categories yet."
            />

            <div className="flex flex-col gap-2">
              <label className="flex items-start gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(event) => setIsRequired(event.target.checked)}
                  className="mt-0.5 size-4 accent-tertiary"
                />
                <span>
                  Required
                  <span className="block text-xs text-ink-subtle">Every product in these main categories must fill it in.</span>
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={isFilterable}
                  onChange={(event) => setIsFilterable(event.target.checked)}
                  className="mt-0.5 size-4 accent-tertiary"
                />
                <span>
                  Use as a shop filter
                  <span className="block text-xs text-ink-subtle">Shoppers can narrow a listing by it.</span>
                </span>
              </label>
            </div>

            <Field label="Status">
              <Select value={status} onChange={(event) => setStatus(event.target.value as CatalogStatus)}>
                {(["active", "inactive"] as const).map((value) => (
                  <option key={value} value={value}>
                    {CATALOG_STATUS_META[value].label}
                  </option>
                ))}
              </Select>
            </Field>
          </fieldset>
        </Panel>

        {errors.submit && (
          <p role="alert" className="text-sm font-medium text-danger">
            {errors.submit}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <ButtonLink href={ATTRIBUTES_HREF}>Cancel</ButtonLink>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving…" : attribute ? "Save changes" : "Add attribute"}
          </Button>
        </div>
      </div>
    </form>
  );
}
