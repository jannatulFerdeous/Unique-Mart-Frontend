"use client";

import Link from "next/link";
import { Stars } from "@/common/components/Stars";
import { apiErrorMessage } from "@/redux/api/errors";
import { useGetMyReviewsQuery } from "@/redux/features/review/reviewApi";
import { productOf } from "@/redux/features/review/review.types";
import { formatDate, formatDateTime } from "@/shared/libs/admin/format";
import { productHref } from "@/shared/libs/storefront/catalog";
import { Button, ButtonLink } from "../components/Button";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { REVIEW_STATUS_META } from "../config/feedback";
import { blurbFor } from "./AdminSidebar";

export function MyReviewsScreen() {
  const { data: reviews = [], isLoading, isError, error, refetch } = useGetMyReviewsQuery();

  return (
    <>
      <ScreenHeader title="My Reviews" blurb={blurbFor("/account/reviews")} />

      {isLoading ? (
        <Panel>
          <EmptyState title="Loading your reviews…" />
        </Panel>
      ) : isError ? (
        <Panel>
          <EmptyState
            title="Couldn't load your reviews"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        </Panel>
      ) : reviews.length === 0 ? (
        <Panel>
          <EmptyState
            title="No reviews yet"
            body="Open the Reviews tab on any product page to write one. Reviews go live once our team has checked them."
            action={<ButtonLink href="/" variant="primary">Browse products</ButtonLink>}
          />
        </Panel>
      ) : (
        <Panel bodyClassName="py-0 md:py-0">
          <ul className="divide-y divide-line">
            {reviews.map((review) => {
              const product = productOf(review.productId);
              const meta = REVIEW_STATUS_META[review.status];
              return (
                <li key={review._id} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {product ? (
                      <Link href={productHref(product.slug)} className="font-medium text-ink hover:text-tertiary">
                        {product.name}
                      </Link>
                    ) : (
                      <p className="font-medium text-ink-muted">A product that is no longer sold</p>
                    )}
                    <StatusPill label={meta.label} tone={meta.tone} />
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-sm text-ink-subtle">
                    <Stars value={review.rating} size="size-3.5" />
                    <span className="sr-only">{review.rating} out of 5 stars</span>
                    <time dateTime={review.createdAt} title={formatDateTime(review.createdAt)}>
                      {formatDate(review.createdAt)}
                    </time>
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-line text-ink-muted">{review.comment}</p>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </>
  );
}
