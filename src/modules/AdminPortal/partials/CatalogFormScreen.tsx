"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import {
  useGetBrandQuery,
  useGetCategoryQuery,
  useGetMainCategoryQuery,
  useGetSubCategoryQuery,
} from "@/redux/features/catalog/catalogApi";
import {
  catalogLogo,
  parentId,
  type CatalogFields,
  type CatalogItem,
  type CatalogKind,
  type CatalogStatus,
} from "@/redux/features/catalog/catalog.types";
import { clearNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button, ButtonLink } from "../components/Button";
import { Field, Input, Select, Textarea } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import {
  CATALOG_COPY,
  CATALOG_STATUS_META,
  DESCRIPTION_MAX,
  IMAGE_ACCEPT,
  NAME_MAX,
  NAME_MIN,
  checkImageFile,
} from "../config/catalog";
import { useCatalogList, useCatalogSave } from "./CatalogScreen";

// One lookup by slug for whichever kind is being edited.
function useCatalogItem(kind: CatalogKind, slug: string | undefined) {
  const skip = (each: CatalogKind) => slug === undefined || kind !== each;
  const mainCategory = useGetMainCategoryQuery(slug ?? "", { skip: skip("mainCategory") });
  const brand = useGetBrandQuery(slug ?? "", { skip: skip("brand") });
  const category = useGetCategoryQuery(slug ?? "", { skip: skip("category") });
  const subCategory = useGetSubCategoryQuery(slug ?? "", { skip: skip("subCategory") });
  const query = { mainCategory, brand, category, subCategory }[kind];
  return { ...query, item: query.data as CatalogItem | undefined };
}

// `slug` given → edit that item; no `slug` → add a new one.
export function CatalogFormScreen({ kind, slug }: { kind: CatalogKind; slug?: string }) {
  const copy = CATALOG_COPY[kind];
  const dispatch = useAppDispatch();
  const editing = slug !== undefined;
  const { item, isLoading, isError, error, refetch } = useCatalogItem(kind, slug);

  // Opening a form starts a fresh visit; drop any old list message.
  useEffect(() => {
    dispatch(clearNotice());
  }, [dispatch]);

  return (
    <>
      <ScreenHeader
        title={editing ? `Edit ${copy.singular}` : `Add ${copy.singular}`}
        blurb={copy.blurb}
        actions={
          <ButtonLink href={copy.href}>
            <ArrowLeft className="size-4" aria-hidden />
            All {copy.title.toLowerCase()}
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
            title={`Couldn't load this ${copy.singular}`}
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        </Panel>
      ) : (
        <CatalogForm key={item?._id ?? "new"} kind={kind} item={editing ? item : undefined} />
      )}
    </>
  );
}

function CatalogForm({ kind, item }: { kind: CatalogKind; item?: CatalogItem }) {
  const copy = CATALOG_COPY[kind];
  const parentField = copy.parent?.kind === "mainCategory" ? "mainCategoryId" : "categoryId";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { parents, parentsLoading } = useCatalogList(kind, "active");
  const { save, saving } = useCatalogSave(kind);

  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [parent, setParent] = useState(item && copy.parent ? parentId(item) : "");
  const [status, setStatus] = useState<CatalogStatus>(item?.status ?? "active");
  const [logo, setLogo] = useState<{ file: File; url: string } | null>(null);
  const [errors, setErrors] = useState<{ name?: string; parent?: string; logo?: string; submit?: string }>({});
  const picked = useRef(logo);

  useEffect(() => {
    picked.current = logo;
  }, [logo]);

  useEffect(
    () => () => {
      if (picked.current) URL.revokeObjectURL(picked.current.url);
    },
    [],
  );

  const preview = logo?.url ?? (item ? catalogLogo(item) : null);

  const pick = (file: File | null) => {
    const problem = file ? checkImageFile(file) : null;
    setErrors((current) => ({ ...current, logo: problem ?? undefined }));
    setLogo((previous) => {
      if (previous) URL.revokeObjectURL(previous.url);
      return file && !problem ? { file, url: URL.createObjectURL(file) } : null;
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    const next = {
      name:
        trimmed.length < NAME_MIN || trimmed.length > NAME_MAX
          ? `Name must be ${NAME_MIN}–${NAME_MAX} characters.`
          : undefined,
      parent: copy.parent && !parent ? `Choose the ${copy.parent.label.toLowerCase()} it belongs to.` : undefined,
      logo: errors.logo,
    };
    setErrors(next);
    if (next.name || next.parent || next.logo) return;

    const fields: CatalogFields = {};
    const text = description.trim();
    if (!item || trimmed !== item.name) fields.name = trimmed;
    if (!item ? text : text !== (item.description ?? "")) fields.description = text;
    if (copy.parent && (!item || parent !== parentId(item))) fields[parentField] = parent;
    if (!item || status !== item.status) fields.status = status;

    try {
      if (!item || Object.keys(fields).length || logo) await save({ id: item?._id, fields, logo: logo?.file });
      dispatch(showNotice({ scope: "catalog", tone: "good", text: `${trimmed} ${item ? "saved" : "added"}.` }));
      router.push(copy.href);
    } catch (problem) {
      setErrors({ submit: apiErrorMessage(problem) });
    }
  };

  const noParents = copy.parent && !parentsLoading && parents.length === 0;

  return (
    <form onSubmit={submit} noValidate className="max-w-3xl">
      <Panel>
        <fieldset disabled={saving} className="grid min-w-0 gap-4 sm:grid-cols-2">
          <legend className="sr-only">{item ? `Edit ${item.name}` : `New ${copy.singular}`}</legend>

          <Field label="Name" hint="The web address is made from the name." error={errors.name} className={copy.parent ? undefined : "sm:col-span-2"}>
            <Input value={name} onChange={(event) => setName(event.target.value)} maxLength={NAME_MAX} autoFocus={!item} />
          </Field>

          {copy.parent && (
            <Field
              label={copy.parent.label}
              error={errors.parent}
              hint={noParents ? `There are no active ${copy.parent.label.toLowerCase()} entries yet.` : undefined}
            >
              <Select value={parent} onChange={(event) => setParent(event.target.value)}>
                <option value="">Choose a {copy.parent.label.toLowerCase()}</option>
                {parents.map((each) => (
                  <option key={each._id} value={each._id}>
                    {each.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <Field label="Description" hint={`Optional. Up to ${DESCRIPTION_MAX} characters.`} className="sm:col-span-2">
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={DESCRIPTION_MAX}
              className="min-h-24"
            />
          </Field>

          {copy.hasLogo && (
            <Field label="Logo (optional)" hint="PNG, JPG, WebP or AVIF, up to 5 MB." error={errors.logo} className="sm:col-span-2">
              <span className="flex flex-wrap items-center gap-4">
                <span className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-control border border-line bg-surface-muted text-xs text-ink-subtle">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="" className="max-h-full max-w-full object-contain" />
                  ) : (
                    "No logo"
                  )}
                </span>
                <input
                  type="file"
                  accept={IMAGE_ACCEPT}
                  onChange={(event) => pick(event.target.files?.[0] ?? null)}
                  className="block min-w-0 flex-1 text-sm text-ink-muted file:mr-3 file:cursor-pointer file:rounded-control file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-surface-muted"
                />
              </span>
            </Field>
          )}

          <Field label="Status" hint="Inactive ones are hidden from the shop.">
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

      {noParents && copy.parent && (
        <p className="mt-3 text-sm text-ink-muted">
          <Link href={`${copy.parent.href}/new`} className="font-medium text-tertiary hover:underline">
            Add a {copy.parent.label.toLowerCase()} first →
          </Link>
        </p>
      )}

      {errors.submit && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {errors.submit}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <ButtonLink href={copy.href}>Cancel</ButtonLink>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving…" : item ? "Save changes" : `Add ${copy.singular}`}
        </Button>
      </div>
    </form>
  );
}
