import type { ReportStatus } from "@/redux/features/report/reportApi";
import type { ReviewStatus } from "@/redux/features/review/review.types";
import type { SubscriberStatus } from "@/redux/features/newsletter/newsletterApi";
import type { Tone } from "./types";

export const REVIEW_STATUS_META: Record<ReviewStatus, { label: string; tone: Tone }> = {
  pending: { label: "Waiting for approval", tone: "warning" },
  approved: { label: "Published", tone: "good" },
  rejected: { label: "Not published", tone: "critical" },
};

export const REPORT_STATUS_META: Record<ReportStatus, { label: string; tone: Tone }> = {
  pending: { label: "Received", tone: "flow-1" },
  in_progress: { label: "In progress", tone: "flow-3" },
  resolved: { label: "Resolved", tone: "good" },
  closed: { label: "Closed", tone: "neutral" },
};

export const SUBSCRIBER_STATUS_META: Record<SubscriberStatus, { label: string; tone: Tone }> = {
  subscribed: { label: "Subscribed", tone: "good" },
  unsubscribed: { label: "Unsubscribed", tone: "neutral" },
};
