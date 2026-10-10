"use client";

import { useState } from "react";
import Link from "next/link";
import { Stars } from "@/common/components/Stars";
import { apiErrorMessage } from "@/redux/api/errors";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import {
  useDeleteReviewMutation,
  useGetAllReviewsQuery,
  useSetReviewStatusMutation,
} from "@/redux/features/review/reviewApi";
import { REVIEW_STATUSES, productOf, type Review, type ReviewStatus } from "@/redux/features/review/review.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatDate, formatDateTime } from "@/shared/libs/admin/format";
import { productHref } from "@/shared/libs/storefront/catalog";
import { cn } from "@/shared/utils/cn";
import { Button } from "../components/Button";
import { ConfirmAction } from "../components/ConfirmAction";
import { NoticeLine, SearchBox } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { REVIEW_STATUS_META } from "../config/feedback";
import { blurbFor } from "./AdminSidebar";

const TAB_LABEL: Record<ReviewStatus, string> = { pending: "To check", approved: "Published", rejected: "Rejected" };

export function ReviewsScreen() {
  const notice = useAppSelector(selectNotice("reviews"));
  const { data: reviews = [], isLoading, isError, error, refetch } = useGetAllReviewsQuery();
  const [tab, setTab] = useState<ReviewStatus>("pending");
  const [search, setSearch] = useState("");

  const term = search.trim().toLowerCase();
  const inTab = reviews.filter((review) => review.status === tab);
  const shown = term
    ? inTab.filter((review) =>
        [productOf(review.productId)?.name, reviewer(review)?.name, reviewer(review)?.email, review.comment]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
    : inTab;

  return (
    <>
      <ScreenHeader title="Reviews" blurb={blurbFor("/admin/reviews")} />
      <NoticeLine notice={notice} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filter by status" className="inline-flex gap-1 rounded-control border border-line bg-surface p-1">
          {REVIEW_STATUSES.map((status) => {
            const count = reviews.filter((review) => review.status === status).length;
            return (
              <button
                key={status}
                type="button"
                aria-pressed={tab === status}
                onClick={() => setTab(status)}
                className={cn(
                  "rounded-control px-3 py-1.5 text-sm font-medium transition-colors",
                  tab === status ? "bg-inverse text-ink-inverse" : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                )}
              >
                {TAB_LABEL[status]}
                <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
        <SearchBox value={search} onChange={setSearch} label="Search product, person or text" />
      </div>

      <Panel bodyClassName="py-0 md:py-0">
        {isLoading ? (
          <EmptyState title="Loading reviews…" />
        ) : isError ? (
          <EmptyState
            title="Couldn't load reviews"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : shown.length === 0 ? (
          <EmptyState
            title={term ? "No reviews match" : tab === "pending" ? "Nothing waiting" : "No reviews here"}
            body={tab === "pending" && !term ? "New reviews from shoppers land here for you to publish or reject." : undefined}
          />
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((review) => (
              <ReviewRow key={review._id} review={review} />
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

const reviewer = (review: Review) =>
  review.userId && typeof review.userId === "object" ? review.userId : null;

function ReviewRow({ review }: { review: Review }) {
  const dispatch = useAppDispatch();
  const [setStatus, setting] = useSetReviewStatusMutation();
  const [remove, removing] = useDeleteReviewMutation();
  const busy = setting.isLoading || removing.isLoading;
  const product = productOf(review.productId);
  const person = reviewer(review);
  const meta = REVIEW_STATUS_META[review.status];

  const act = async (action: () => Promise<unknown>, text: string) => {
    try {
      await action();
      dispatch(showNotice({ scope: "reviews", tone: "good", text }));
    } catch (problem) {
      dispatch(showNotice({ scope: "reviews", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  const move = (status: ReviewStatus, text: string) => act(() => setStatus({ review, status }).unwrap(), text);

  return (
    <li aria-busy={busy} className="flex flex-col gap-3 py-4 md:flex-row md:items-start">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {product ? (
            <Link href={productHref(product.slug)} target="_blank" className="font-medium text-ink hover:text-tertiary">
              {product.name}
            </Link>
          ) : (
            <span className="font-medium text-ink-muted">Deleted product</span>
          )}
          <StatusPill label={meta.label} tone={meta.tone} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <Stars value={review.rating} size="size-3.5" />
          <span className="sr-only">{review.rating} out of 5 stars</span>
          <span>
            {person ? `${person.name} · ${person.email}` : "Deleted account"} ·{" "}
            <time dateTime={review.createdAt} title={formatDateTime(review.createdAt)}>
              {formatDate(review.createdAt)}
            </time>
          </span>
        </div>
        <p className="mt-2 text-sm whitespace-pre-line text-ink">{review.comment}</p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-1.5">
        {review.status !== "approved" && (
          <Button size="sm" variant="primary" disabled={busy} onClick={() => move("approved", "Review published.")}>
            Publish
          </Button>
        )}
        {review.status !== "rejected" && (
          <Button size="sm" disabled={busy} onClick={() => move("rejected", "Review rejected. It won't show on the shop.")}>
            Reject
          </Button>
        )}
        <ConfirmAction
          label="Delete"
          describe={`review of ${product?.name ?? "a deleted product"}`}
          onConfirm={() => act(() => remove(review).unwrap(), "Review deleted.")}
        />
      </div>
    </li>
  );
}
