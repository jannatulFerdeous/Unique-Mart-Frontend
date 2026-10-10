import { baseApi, TAG } from "../../api/baseApi";
import { refreshShop } from "../../api/refresh";
import { cleanParams, toPaged } from "../../api/list";
import type { ApiResponse } from "../../api/types";
import type {
  Attribute,
  AttributeFields,
  AttributeGroup,
  AttributeGroupFields,
  AttributeListParams,
  SaveArgs,
} from "./attribute.types";

// A store defines a few hundred of these at most; one page holds them all.
const LIST_LIMIT = 500;

const GROUP_LIST = { type: TAG.attributeGroup, id: "LIST" } as const;
const ATTRIBUTE_LIST = { type: TAG.attribute, id: "LIST" } as const;

const save = <Fields>(url: string, { id, fields }: SaveArgs<Fields>) =>
  id ? { url: `${url}/${id}`, method: "PATCH", body: fields } : { url, method: "POST", body: fields };

export const attributeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAttributeGroups: build.query<{ items: AttributeGroup[] }, AttributeListParams | void>({
      query: (params) => ({
        url: "/attribute-groups",
        params: cleanParams({ ...params, limit: LIST_LIMIT, sort: "name" }),
      }),
      transformResponse: toPaged<AttributeGroup>,
      providesTags: (result) => [
        GROUP_LIST,
        ...(result?.items ?? []).map(({ _id }) => ({ type: TAG.attributeGroup, id: _id })),
      ],
    }),
    getAttributeGroup: build.query<AttributeGroup, string>({
      query: (id) => `/attribute-groups/${id}`,
      transformResponse: (response: ApiResponse<AttributeGroup>) => response.data,
      providesTags: (result) => (result ? [{ type: TAG.attributeGroup, id: result._id }] : []),
    }),
    saveAttributeGroup: build.mutation<AttributeGroup, SaveArgs<AttributeGroupFields>>({
      query: (args) => save("/attribute-groups", args),
      transformResponse: (response: ApiResponse<AttributeGroup>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [GROUP_LIST, ...(id ? [{ type: TAG.attributeGroup, id }] : [])],
      onQueryStarted: refreshShop,
    }),

    getAttributes: build.query<{ items: Attribute[] }, AttributeListParams | void>({
      query: (params) => ({
        url: "/attributes",
        params: cleanParams({ ...params, limit: LIST_LIMIT, sort: "name" }),
      }),
      transformResponse: toPaged<Attribute>,
      providesTags: (result) => [
        ATTRIBUTE_LIST,
        ...(result?.items ?? []).map(({ _id }) => ({ type: TAG.attribute, id: _id })),
      ],
    }),
    getAttribute: build.query<Attribute, string>({
      query: (id) => `/attributes/${id}`,
      transformResponse: (response: ApiResponse<Attribute>) => response.data,
      providesTags: (result) => (result ? [{ type: TAG.attribute, id: result._id }] : []),
    }),
    saveAttribute: build.mutation<Attribute, SaveArgs<AttributeFields>>({
      query: (args) => save("/attributes", args),
      transformResponse: (response: ApiResponse<Attribute>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [ATTRIBUTE_LIST, ...(id ? [{ type: TAG.attribute, id }] : [])],
      onQueryStarted: refreshShop,
    }),
  }),
});

export const {
  useGetAttributeGroupsQuery,
  useGetAttributeGroupQuery,
  useSaveAttributeGroupMutation,
  useGetAttributesQuery,
  useGetAttributeQuery,
  useSaveAttributeMutation,
} = attributeApi;
