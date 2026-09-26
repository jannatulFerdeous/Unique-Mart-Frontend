"use client";

import { useId, useState } from "react";
import { Star, User } from "lucide-react";
import { Stars } from "@/common/components/Stars";
import { REVIEW_LIMITS, type ReviewSummary, type Review } from "@/shared/libs/reviews";
import { initials } from "@/shared/libs/session";
import { cn } from "@/shared/utils/cn";
import { product_details_data } from "../config/constants";

type Props = {
  reviews: Review[];
  summary: ReviewSummary;
  onSubmit: (draft: { rating: number; comment: string }) => void;
};

const { reviews: copy } = product_details_data;

const countLabel = (count: number) =>
  count === 1 ? copy.countOne : copy.countMany.replace("{n}", String(count));

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function Avatar({ name }: { name: string | null }) {
  const letters = name ? initials(name) : "";

  return (
    <span
      aria-hidden
      className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-tertiary bg-tertiary-soft font-bold text-tertiary sm:size-16"
    >
      {letters || <User className="size-7 stroke-[1.5]" />}
    </span>
  );
}

export function ProductReviews({ reviews, summary, onSubmit }: Props) {
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const found: string[] = [];
    if (!rating) found.push(copy.errors.rating);
    if (!comment.trim()) found.push(copy.errors.comment);

    setErrors(found);
    if (found.length) return;

    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
    setOpen(false);
    setSaved(true);
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="font-sans font-bold text-ink">{copy.heading}</h2>

        {!open && (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setSaved(false);
            }}
            className="rounded-control bg-tertiary px-5 py-2.5 font-medium text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
          >
            {copy.write}
          </button>
        )}
      </div>

      {saved && (
        <p
          role="status"
          className="mt-4 rounded-control border border-tertiary bg-tertiary-soft px-4 py-3 text-tertiary"
        >
          {copy.saved}
        </p>
      )}

      {open && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-5 rounded-control border border-line bg-surface p-5"
        >
          <fieldset>
            <legend className="font-medium text-ink">{copy.form.rating}</legend>
            <p className="sr-only">{copy.form.ratingHint}</p>

            <div
              className="mt-2 flex gap-1"
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <label
                  key={value}
                  onMouseEnter={() => setHovered(value)}
                  className="cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`${fieldId}-rating`}
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                    className="peer sr-only"
                  />
                  <Star
                    className={cn(
                      "size-8 stroke-none transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-tertiary",
                      value <= (hovered || rating)
                        ? "fill-ink"
                        : "fill-line-strong",
                    )}
                  />
                  <span className="sr-only">
                    {value} {value === 1 ? "star" : "stars"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <label
              htmlFor={`${fieldId}-comment`}
              className="block font-medium text-ink"
            >
              {copy.form.comment}
            </label>
            <textarea
              id={`${fieldId}-comment`}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={REVIEW_LIMITS.comment}
              rows={4}
              placeholder={copy.form.commentPlaceholder}
              className="mt-2 w-full rounded-control border border-line-strong bg-surface p-2 text-base text-ink placeholder:text-ink-subtle"
            />
            <p className="mt-1 text-right text-sm text-ink-subtle tabular-nums">
              {comment.length}/{REVIEW_LIMITS.comment}
            </p>
          </div>

          {errors.length > 0 && (
            <ul
              role="alert"
              className="mt-4 list-disc space-y-1 rounded-control border border-line-strong bg-surface-muted py-3 pr-4 pl-8 text-ink"
            >
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}

          <p className="mt-4 text-sm text-ink-subtle">{copy.storageNote}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-control bg-tertiary px-6 py-2.5 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
            >
              {copy.form.submit}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setErrors([]);
              }}
              className="rounded-control border border-line px-6 py-2.5 font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              {copy.cancel}
            </button>
          </div>
        </form>
      )}

      {summary.count > 0 ? (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5 border-y border-line py-5">
            <div>
              <p className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-ink tabular-nums">
                  {summary.average?.toFixed(1)}
                </span>
                <span className="text-ink-muted">{copy.ofFive}</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Stars value={summary.average ?? 0} />
                <span className="text-sm text-ink-muted">
                  {countLabel(summary.count)}
                </span>
              </div>
            </div>

            <ul className="min-w-60 flex-1 space-y-1">
              {summary.breakdown.map((total, index) => {
                const star = 5 - index;
                const share = summary.count ? (total / summary.count) * 100 : 0;

                return (
                  <li key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-8 shrink-0 text-ink-muted tabular-nums">
                      {star} ★
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                      <span
                        className="block h-full rounded-full bg-tertiary"
                        style={{ width: `${share}%` }}
                      />
                    </span>
                    <span className="w-6 shrink-0 text-right text-ink-subtle tabular-nums">
                      {total}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <ul className="divide-y divide-line">
            {reviews.map((review) => (
              <li key={review.id} className="flex gap-4 py-6 sm:gap-6">
                <Avatar name={review.name} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-bold text-ink">
                      {review.name ?? copy.anonymous}
                    </p>
                    <span className="flex items-center gap-1.5">
                      <Stars value={review.rating} />
                      <span className="text-sm text-ink-muted tabular-nums">
                        ({review.rating})
                      </span>
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-ink-subtle">
                    {copy.on} {formatDate(review.createdAt)}
                  </p>

                  <p className="mt-2 whitespace-pre-line text-ink-muted">
                    {review.comment}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-8 text-ink-muted">{copy.empty}</p>
      )}
    </div>
  );
}
