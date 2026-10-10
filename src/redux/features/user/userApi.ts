import { baseApi, TAG } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";
import type {
  CreateUserArgs,
  UpdateUserArgs,
  User,
  UserFields,
  UserList,
  UserListParams,
} from "./user.types";

const LIST = { type: TAG.user, id: "LIST" } as const;

// Multipart only when a profile photo rides along; plain JSON otherwise.
const toBody = (fields: Partial<UserFields> & { password?: string }, image?: File) => {
  if (!image) return fields;

  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) form.append(key, String(value));
  }
  form.append("profileImage", image);
  return form;
};

// Drop empty filters so the backend's exact-match filter doesn't see `role=`.
const toSearch = (params: UserListParams) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ""));

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UserList, UserListParams>({
      query: (params) => ({ url: "/users", params: toSearch(params) }),
      transformResponse: (response: ApiResponse<User[]>) => ({
        users: response.data,
        meta: response.meta ?? { page: 1, limit: response.data.length, total: response.data.length, totalPage: 1 },
      }),
      providesTags: (result) => [
        LIST,
        ...(result?.users ?? []).map(({ _id }) => ({ type: TAG.user, id: _id })),
      ],
    }),

    getUser: build.query<User, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: ApiResponse<User>) => response.data,
      providesTags: (_result, _error, id) => [{ type: TAG.user, id }],
    }),

    createUser: build.mutation<User, CreateUserArgs>({
      query: ({ profileImage, ...fields }) => ({
        url: "/users",
        method: "POST",
        body: toBody(fields, profileImage),
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: [LIST],
    }),

    updateUser: build.mutation<User, UpdateUserArgs>({
      query: ({ id, changes: { profileImage, ...changes } }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: toBody(changes, profileImage),
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      // LIST too: a status or role change can move the user out of the current tab.
      invalidatesTags: (_result, _error, { id }) => [LIST, { type: TAG.user, id }],
    }),

    // The backend soft-deletes: the user stays, with status "deleted".
    deleteUser: build.mutation<User, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: (_result, _error, id) => [LIST, { type: TAG.user, id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
