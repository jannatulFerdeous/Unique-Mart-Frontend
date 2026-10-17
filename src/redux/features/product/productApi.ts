import { baseApi, TAG } from "../../api/baseApi";
import { refreshShop } from "../../api/refresh";
import { cleanParams, toFormData, toPaged, type Paged } from "../../api/list";
import type { ApiResponse } from "../../api/types";
import type {
  Product,
  ProductFields,
  ProductListParams,
  UpdateProductArgs,
  UploadProductImagesArgs,
} from "./product.types";

const LIST = { type: TAG.product, id: "LIST" } as const;

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Paged<Product>, ProductListParams>({
      query: (params) => ({ url: "/products", params: cleanParams(params) }),
      transformResponse: toPaged<Product>,
      providesTags: (result) => [
        LIST,
        ...(result?.items ?? []).map(({ _id }) => ({ type: TAG.product, id: _id })),
      ],
    }),

    // The backend looks single products up by slug.
    getProduct: build.query<Product, string>({
      query: (slug) => `/products/${slug}`,
      transformResponse: (response: ApiResponse<Product>) => response.data,
      providesTags: (result) => (result ? [{ type: TAG.product, id: result._id }] : []),
    }),

    // JSON only. The validator wants real numbers, booleans and arrays, which a
    // multipart body can't carry, so photos go up separately afterwards.
    createProduct: build.mutation<Product, ProductFields>({
      query: (fields) => ({ url: "/products", method: "POST", body: fields }),
      transformResponse: (response: ApiResponse<Product>) => response.data,
      invalidatesTags: [LIST],
      onQueryStarted: refreshShop,
    }),

    // Removes the product for good, photos and all. Past orders keep their own copy.
    deleteProduct: build.mutation<unknown, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [LIST, { type: TAG.product, id }],
      onQueryStarted: refreshShop,
    }),

    updateProduct: build.mutation<Product, UpdateProductArgs>({
      query: ({ id, changes }) => ({ url: `/products/${id}`, method: "PATCH", body: changes }),
      transformResponse: (response: ApiResponse<Product>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [LIST, { type: TAG.product, id }],
      onQueryStarted: refreshShop,
    }),

    // A multipart PATCH: the new photos, and which current ones to keep.
    uploadProductImages: build.mutation<Product, UploadProductImagesArgs>({
      query: ({ id, images, keep }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: toFormData({ keepImages: keep ? JSON.stringify(keep) : undefined }, { field: "images", list: images }),
      }),
      transformResponse: (response: ApiResponse<Product>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [LIST, { type: TAG.product, id }],
      onQueryStarted: refreshShop,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
} = productApi;
