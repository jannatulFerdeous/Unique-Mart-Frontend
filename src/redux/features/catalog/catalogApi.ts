import { baseApi, TAG } from "../../api/baseApi";
import { refreshShop } from "../../api/refresh";
import { cleanParams, toFormData, toPaged } from "../../api/list";
import type { ApiResponse } from "../../api/types";
import type {
  Brand,
  CatalogFields,
  CatalogKind,
  CatalogListParams,
  Category,
  MainCategory,
  SaveCatalogArgs,
  SubCategory,
} from "./catalog.types";

// Enough for every brand/category a store this size will have, in one page.
const LIST_LIMIT = 500;

// `logoField` only where the backend stores an upload (main categories, brands).
const ROUTE: Record<CatalogKind, { url: string; tag: (typeof TAG)[keyof typeof TAG]; logoField?: string }> = {
  mainCategory: { url: "/main-categories", tag: TAG.mainCategory, logoField: "logo" },
  brand: { url: "/brands", tag: TAG.brand, logoField: "logo" },
  category: { url: "/categories", tag: TAG.category },
  subCategory: { url: "/sub-categories", tag: TAG.subCategory },
};

// Status is always sent: the brand list filters on `status` even when it's
// missing, so asking without one isn't a reliable "all".
const listQuery = (kind: CatalogKind, params: CatalogListParams) => ({
  url: ROUTE[kind].url,
  params: cleanParams({ ...params, limit: LIST_LIMIT, sort: "name" }),
});

const saveQuery = (kind: CatalogKind, { id, fields, logo }: SaveCatalogArgs) => {
  const { logoField } = ROUTE[kind];
  const body: CatalogFields | FormData = logo && logoField ? toFormData(fields, { field: logoField, list: [logo] }) : fields;
  return id
    ? { url: `${ROUTE[kind].url}/${id}`, method: "PATCH", body }
    : { url: ROUTE[kind].url, method: "POST", body };
};

// The backend looks single catalog items up by slug.
const itemQuery = (kind: CatalogKind) => ({
  query: (slug: string) => `${ROUTE[kind].url}/${slug}`,
  transformResponse: <T>(response: ApiResponse<T>) => response.data,
  providesTags: (result?: { _id: string }) => (result ? [{ type: ROUTE[kind].tag, id: result._id }] : []),
});

const listTags = (kind: CatalogKind) => (result?: { items: { _id: string }[] }) => [
  { type: ROUTE[kind].tag, id: "LIST" },
  ...(result?.items ?? []).map(({ _id }) => ({ type: ROUTE[kind].tag, id: _id })),
];

const saveTags = (kind: CatalogKind) => (_result: unknown, _error: unknown, { id }: SaveCatalogArgs) => [
  { type: ROUTE[kind].tag, id: "LIST" },
  ...(id ? [{ type: ROUTE[kind].tag, id }] : []),
  // Product rows show category names; lower levels show their parent's name.
  { type: TAG.product, id: "LIST" },
  ...(kind === "mainCategory" ? [{ type: TAG.category, id: "LIST" }] : []),
  ...(kind === "category" ? [{ type: TAG.subCategory, id: "LIST" }] : []),
];

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMainCategories: build.query<{ items: MainCategory[] }, CatalogListParams>({
      query: (params) => listQuery("mainCategory", params),
      transformResponse: toPaged<MainCategory>,
      providesTags: listTags("mainCategory"),
    }),
    getMainCategory: build.query<MainCategory, string>(itemQuery("mainCategory")),
    saveMainCategory: build.mutation<MainCategory, SaveCatalogArgs>({
      query: (args) => saveQuery("mainCategory", args),
      transformResponse: (response: ApiResponse<MainCategory>) => response.data,
      invalidatesTags: saveTags("mainCategory"),
      onQueryStarted: refreshShop,
    }),

    getBrands: build.query<{ items: Brand[] }, CatalogListParams>({
      query: (params) => listQuery("brand", params),
      transformResponse: toPaged<Brand>,
      providesTags: listTags("brand"),
    }),
    getBrand: build.query<Brand, string>(itemQuery("brand")),
    saveBrand: build.mutation<Brand, SaveCatalogArgs>({
      query: (args) => saveQuery("brand", args),
      transformResponse: (response: ApiResponse<Brand>) => response.data,
      invalidatesTags: saveTags("brand"),
      onQueryStarted: refreshShop,
    }),

    getCategories: build.query<{ items: Category[] }, CatalogListParams>({
      query: (params) => listQuery("category", params),
      transformResponse: toPaged<Category>,
      providesTags: listTags("category"),
    }),
    getCategory: build.query<Category, string>(itemQuery("category")),
    saveCategory: build.mutation<Category, SaveCatalogArgs>({
      query: (args) => saveQuery("category", args),
      transformResponse: (response: ApiResponse<Category>) => response.data,
      invalidatesTags: saveTags("category"),
      onQueryStarted: refreshShop,
    }),

    getSubCategories: build.query<{ items: SubCategory[] }, CatalogListParams>({
      query: (params) => listQuery("subCategory", params),
      transformResponse: toPaged<SubCategory>,
      providesTags: listTags("subCategory"),
    }),
    getSubCategory: build.query<SubCategory, string>(itemQuery("subCategory")),
    saveSubCategory: build.mutation<SubCategory, SaveCatalogArgs>({
      query: (args) => saveQuery("subCategory", args),
      transformResponse: (response: ApiResponse<SubCategory>) => response.data,
      invalidatesTags: saveTags("subCategory"),
      onQueryStarted: refreshShop,
    }),
  }),
});

export const {
  useGetMainCategoryQuery,
  useGetBrandQuery,
  useGetCategoryQuery,
  useGetSubCategoryQuery,
  useGetMainCategoriesQuery,
  useSaveMainCategoryMutation,
  useGetBrandsQuery,
  useSaveBrandMutation,
  useGetCategoriesQuery,
  useSaveCategoryMutation,
  useGetSubCategoriesQuery,
  useSaveSubCategoryMutation,
} = catalogApi;
