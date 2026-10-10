import { baseApi, TAG } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";
import type { Address, SaveAddressArgs } from "./address.types";

const LIST = { type: TAG.address, id: "LIST" } as const;

export const addressApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Active addresses only, the default one first.
    getAddresses: build.query<Address[], void>({
      query: () => "/user-address",
      transformResponse: (response: ApiResponse<Address[]>) => response.data,
      providesTags: (addresses = []) => [LIST, ...addresses.map(({ _id }) => ({ type: TAG.address, id: _id }))],
    }),

    // A new default unsets the old one, so the whole list refetches.
    saveAddress: build.mutation<Address, SaveAddressArgs>({
      query: ({ id, fields }) =>
        id
          ? { url: `/user-address/${id}`, method: "PATCH", body: fields }
          : { url: "/user-address", method: "POST", body: fields },
      transformResponse: (response: ApiResponse<Address>) => response.data,
      invalidatesTags: [LIST],
    }),

    // The backend soft-deletes: the address turns inactive and drops out of the list.
    deleteAddress: build.mutation<null, string>({
      query: (id) => ({ url: `/user-address/${id}`, method: "DELETE" }),
      transformResponse: () => null,
      invalidatesTags: [LIST],
    }),
  }),
});

export const { useGetAddressesQuery, useSaveAddressMutation, useDeleteAddressMutation } = addressApi;
