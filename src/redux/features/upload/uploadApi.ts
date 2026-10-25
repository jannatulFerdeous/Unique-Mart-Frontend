import { baseApi } from "../../api/baseApi";
import { toFormData } from "../../api/list";
import type { ApiResponse } from "../../api/types";

export type UploadedImage = { url: string; width?: number; height?: number };

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // To this site's own route (app/api/description-images), not the backend.
    // An absolute URL skips the API base, and keeps the token refresh on 401.
    uploadDescriptionImage: build.mutation<UploadedImage, File>({
      query: (image) => ({
        url: new URL("/api/description-images", window.location.origin).href,
        method: "POST",
        body: toFormData({}, { field: "image", list: [image] }),
      }),
      transformResponse: (response: ApiResponse<UploadedImage>) => response.data,
    }),
  }),
});

export const { useUploadDescriptionImageMutation } = uploadApi;
