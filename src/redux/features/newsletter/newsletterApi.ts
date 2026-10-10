import { baseApi, TAG } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";

// Mirror the backend enum in `newsletter.constant.ts`.
export const SUBSCRIBER_STATUSES = ["subscribed", "unsubscribed"] as const;

export type SubscriberStatus = (typeof SUBSCRIBER_STATUSES)[number];

// Mirrors the backend Newsletter document.
export type Subscriber = {
  _id: string;
  email: string;
  status: SubscriberStatus;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
};

const LIST = { type: TAG.newsletter, id: "LIST" } as const;

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Public. Signing up again after unsubscribing turns the old entry back on.
    subscribe: build.mutation<null, string>({
      query: (email) => ({ url: "/newsletters/subscribe", method: "POST", body: { email } }),
      transformResponse: () => null,
      invalidatesTags: [LIST],
    }),

    unsubscribe: build.mutation<null, string>({
      query: (email) => ({ url: "/newsletters/unsubscribe", method: "POST", body: { email } }),
      transformResponse: () => null,
      invalidatesTags: [LIST],
    }),

    // Admin: newest first.
    getSubscribers: build.query<Subscriber[], void>({
      query: () => "/newsletters",
      transformResponse: (response: ApiResponse<Subscriber[]>) => response.data,
      providesTags: [LIST],
    }),

    setSubscriberStatus: build.mutation<Subscriber, { id: string; status: SubscriberStatus }>({
      query: ({ id, status }) => ({ url: `/newsletters/${id}`, method: "PATCH", body: { status } }),
      transformResponse: (response: ApiResponse<Subscriber>) => response.data,
      invalidatesTags: [LIST],
    }),

    // Removes the address entirely.
    deleteSubscriber: build.mutation<null, string>({
      query: (id) => ({ url: `/newsletters/${id}`, method: "DELETE" }),
      transformResponse: () => null,
      invalidatesTags: [LIST],
    }),
  }),
});

export const {
  useSubscribeMutation,
  useUnsubscribeMutation,
  useGetSubscribersQuery,
  useSetSubscriberStatusMutation,
  useDeleteSubscriberMutation,
} = newsletterApi;
