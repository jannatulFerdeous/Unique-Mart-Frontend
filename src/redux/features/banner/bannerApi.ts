import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { refreshHomepageBanners } from "@/shared/api/banners.actions";
import { baseApi, TAG } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";
import type { Banner, BannerFields, CreateBannerArgs, UpdateBannerArgs } from "./banner.types";

const LIST = { type: TAG.banner, id: "LIST" } as const;

// Multipart only when an image rides along; plain JSON otherwise.
const toBody = (fields: Partial<BannerFields>, image?: File) => {
  if (!image) return fields;

  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) form.append(key, String(value));
  }
  form.append("image", image);
  return form;
};

// After a successful write, clear the homepage's cached slides so the
// storefront shows the change on its next visit.
const refreshHomepage = async ({ queryFulfilled }: { queryFulfilled: Promise<unknown> }) => {
  try {
    await queryFulfilled;
    await refreshHomepageBanners();
  } catch {
    // Failed writes change nothing; the caller shows the error.
  }
};

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBanners: build.query<Banner[], void>({
      query: () => "/banners",
      transformResponse: (response: ApiResponse<Banner[]>) => response.data,
      providesTags: (banners = []) => [
        LIST,
        ...banners.map(({ _id }) => ({ type: TAG.banner, id: _id })),
      ],
    }),

    getBanner: build.query<Banner, string>({
      query: (id) => `/banners/${id}`,
      transformResponse: (response: ApiResponse<Banner>) => response.data,
      providesTags: (_result, _error, id) => [{ type: TAG.banner, id }],
    }),

    createBanner: build.mutation<Banner, CreateBannerArgs>({
      query: ({ image, ...fields }) => ({
        url: "/banners",
        method: "POST",
        body: toBody(fields, image),
      }),
      transformResponse: (response: ApiResponse<Banner>) => response.data,
      onQueryStarted: (_args, api) => refreshHomepage(api),
      invalidatesTags: [LIST],
    }),

    updateBanner: build.mutation<Banner, UpdateBannerArgs>({
      query: ({ banner, changes: { image, ...changes } }) => ({
        url: `/banners/${banner._id}`,
        method: "PATCH",
        // The backend's update validator defaults a missing sortOrder to 0,
        // so always send the current one to keep the slide in place.
        body: toBody({ ...changes, sortOrder: banner.sortOrder }, image),
      }),
      transformResponse: (response: ApiResponse<Banner>) => response.data,
      onQueryStarted: (_args, api) => refreshHomepage(api),
      invalidatesTags: (_result, _error, { banner }) => [{ type: TAG.banner, id: banner._id }],
    }),

    // Takes the full list in its new order and saves each changed position.
    reorderBanners: build.mutation<null, Banner[]>({
      async queryFn(ordered, _api, _extra, baseQuery) {
        const moved = ordered
          .map((banner, sortOrder) => ({ banner, sortOrder }))
          .filter(({ banner, sortOrder }) => banner.sortOrder !== sortOrder);

        const results = await Promise.all(
          moved.map(({ banner, sortOrder }) =>
            baseQuery({ url: `/banners/${banner._id}`, method: "PATCH", body: { sortOrder } }),
          ),
        );

        const failed = results.find((result) => result.error);
        return failed ? { error: failed.error as FetchBaseQueryError } : { data: null };
      },
      async onQueryStarted(ordered, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          bannerApi.util.updateQueryData("getBanners", undefined, () =>
            ordered.map((banner, sortOrder) => ({ ...banner, sortOrder })),
          ),
        );
        try {
          await queryFulfilled;
          await refreshHomepageBanners();
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [LIST],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useReorderBannersMutation,
} = bannerApi;
