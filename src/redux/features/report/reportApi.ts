import { baseApi, TAG } from "../../api/baseApi";
import type { ApiResponse } from "../../api/types";

// Mirror the backend enum in `report.constant.ts`.
export const REPORT_STATUSES = ["pending", "in_progress", "resolved", "closed"] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

// Mirrors the backend Report document; the admin routes populate who sent it.
export type Report = {
  _id: string;
  userId: { _id: string; name: string; email: string } | string | null;
  title: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
};

// Mirrors the backend `createReportValidationSchema`.
export type ReportFields = { title: string; description: string };

export const REPORT_LIMITS = { title: { min: 3, max: 200 }, description: { min: 10, max: 2000 } } as const;

const ALL = { type: TAG.report, id: "LIST" } as const;
const MINE = { type: TAG.report, id: "MINE" } as const;

export const reportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyReports: build.query<Report[], void>({
      query: () => "/reports/my",
      transformResponse: (response: ApiResponse<Report[]>) => response.data,
      providesTags: [MINE],
    }),

    createReport: build.mutation<Report, ReportFields>({
      query: (body) => ({ url: "/reports", method: "POST", body }),
      transformResponse: (response: ApiResponse<Report>) => response.data,
      invalidatesTags: [MINE, ALL],
    }),

    // Admin: everyone's, newest first.
    getAllReports: build.query<Report[], void>({
      query: () => "/reports",
      transformResponse: (response: ApiResponse<Report[]>) => response.data,
      providesTags: [ALL],
    }),

    setReportStatus: build.mutation<Report, { id: string; status: ReportStatus }>({
      query: ({ id, status }) => ({ url: `/reports/${id}/status`, method: "PATCH", body: { status } }),
      transformResponse: (response: ApiResponse<Report>) => response.data,
      invalidatesTags: [ALL, MINE],
    }),

    deleteReport: build.mutation<null, string>({
      query: (id) => ({ url: `/reports/${id}`, method: "DELETE" }),
      transformResponse: () => null,
      invalidatesTags: [ALL, MINE],
    }),
  }),
});

export const {
  useGetMyReportsQuery,
  useCreateReportMutation,
  useGetAllReportsQuery,
  useSetReportStatusMutation,
  useDeleteReportMutation,
} = reportApi;
