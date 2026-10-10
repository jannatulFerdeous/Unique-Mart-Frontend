import type { ApiMeta, ApiResponse } from "./types";

export type Paged<T> = { items: T[]; meta: ApiMeta };

// List routes answer in two shapes: `data: [...]` with a top-level `meta`
// (categories, users) or `data: { data: [...], meta }` (brands, products).
export const toPaged = <T>(response: ApiResponse<T[] | { data: T[]; meta: ApiMeta }>): Paged<T> => {
  const body = response.data;
  const items = Array.isArray(body) ? body : body.data;
  const meta = (Array.isArray(body) ? response.meta : body.meta) ?? {
    page: 1,
    limit: items.length,
    total: items.length,
    totalPage: 1,
  };
  return { items, meta };
};

// Drop empty params so the backend's exact-match filters don't see `key=`.
export const cleanParams = (params: Record<string, string | number | boolean | undefined>) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ""));

// Multipart form from plain fields plus files under one field name.
export const toFormData = (
  fields: Record<string, string | number | boolean | null | undefined>,
  files: { field: string; list: File[] },
) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) form.append(key, String(value));
  }
  for (const file of files.list) form.append(files.field, file);
  return form;
};
