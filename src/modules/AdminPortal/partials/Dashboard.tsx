"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Stars } from "@/common/components/Stars";
import { apiErrorMessage } from "@/redux/api/errors";
import { useGetCouponsQuery } from "@/redux/features/coupon/couponApi";
import { useGetSubscribersQuery } from "@/redux/features/newsletter/newsletterApi";
import { useGetProductsQuery } from "@/redux/features/product/productApi";
import { useGetAllReportsQuery } from "@/redux/features/report/reportApi";
import { useGetAllReviewsQuery } from "@/redux/features/review/reviewApi";
import { productOf } from "@/redux/features/review/review.types";
import { useGetUsersQuery } from "@/redux/features/user/userApi";
import { formatAgo, formatCount } from "@/shared/libs/admin/format";
import { inStock } from "@/shared/libs/storefront/catalog";
import { Button } from "../components/Button";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatTile } from "../components/StatTile";
import { couponWindow } from "../config/coupons";
import { blurbFor } from "./AdminSidebar";

// The backend caps a list's reported total at the page size, so counts come
// from fetching everything in one page and counting it here.
const ALL = 1000;
const LATEST = 5;

export function Dashboard() {
  const products = useGetProductsQuery({ page: 1, limit: ALL });
  const users = useGetUsersQuery({ page: 1, limit: ALL, status: "active" });
  const reviews = useGetAllReviewsQuery();
  const reports = useGetAllReportsQuery();
  const subscribers = useGetSubscribersQuery();
  const coupons = useGetCouponsQuery();

  const live = (products.data?.items ?? []).filter((product) => product.status === "active");
  const pendingReviews = (reviews.data ?? []).filter((review) => review.status === "pending");
  const openReports = (reports.data ?? []).filter((report) => report.status === "pending" || report.status === "in_progress");

  // A figure, or a dash while it loads or if its list failed.
  const count = (query: { isSuccess: boolean }, value: number) => (query.isSuccess ? formatCount(value) : "—");
  const failed = [products, users, reviews, reports, subscribers, coupons].find((query) => query.isError);

  return (
    <>
      <ScreenHeader title="Dashboard" blurb={blurbFor("/admin")} />

      {failed && (
        <p role="alert" className="text-sm font-medium text-danger">
          Some figures couldn&apos;t load: {apiErrorMessage(failed.error)}
        </p>
      )}

      <section aria-label="Store at a glance" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Products on sale"
          value={count(products, live.length)}
          note={products.isSuccess ? `${live.filter((product) => !inStock(product)).length} out of stock` : undefined}
          action={<TileLink href="/admin/products" label="Products" />}
        />
        <StatTile
          label="Customers"
          value={count(users, (users.data?.users ?? []).filter((user) => user.role === "customer").length)}
          note={users.isSuccess ? `${(users.data?.users ?? []).filter((user) => user.role !== "customer").length} staff` : undefined}
          action={<TileLink href="/admin/users" label="Users" />}
        />
        <StatTile
          label="Reviews to check"
          value={count(reviews, pendingReviews.length)}
          note={reviews.isSuccess ? `${(reviews.data ?? []).filter((review) => review.status === "approved").length} published` : undefined}
          action={<TileLink href="/admin/reviews" label="Reviews" />}
        />
        <StatTile
          label="Open support requests"
          value={count(reports, openReports.length)}
          action={<TileLink href="/admin/reports" label="Support requests" />}
        />
        <StatTile
          label="Newsletter subscribers"
          value={count(subscribers, (subscribers.data ?? []).filter((each) => each.status === "subscribed").length)}
          action={<TileLink href="/admin/newsletter" label="Newsletter" />}
        />
        <StatTile
          label="Coupons running"
          value={count(coupons, (coupons.data ?? []).filter((coupon) => couponWindow(coupon).label === "Running").length)}
          note={coupons.isSuccess ? `${coupons.data?.length ?? 0} in total` : undefined}
          action={<TileLink href="/admin/coupons" label="Coupons" />}
        />
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Panel
          title="Reviews waiting"
          actions={<SeeAll href="/admin/reviews" />}
          bodyClassName="py-0 md:py-0"
        >
          {reviews.isLoading ? (
            <EmptyState title="Loading…" />
          ) : pendingReviews.length === 0 ? (
            <EmptyState title="Nothing waiting" body="New reviews show here until you publish or reject them." />
          ) : (
            <ul className="divide-y divide-line">
              {pendingReviews.slice(0, LATEST).map((review) => (
                <li key={review._id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-ink">
                      {productOf(review.productId)?.name ?? "Deleted product"}
                    </p>
                    <span className="shrink-0 text-xs text-ink-subtle">{formatAgo(review.createdAt)}</span>
                  </div>
                  <Stars value={review.rating} size="size-3" className="mt-1" />
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{review.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Open support requests"
          actions={<SeeAll href="/admin/reports" />}
          bodyClassName="py-0 md:py-0"
        >
          {reports.isLoading ? (
            <EmptyState title="Loading…" />
          ) : openReports.length === 0 ? (
            <EmptyState title="Nothing open" body="Requests customers send from their account show here." />
          ) : (
            <ul className="divide-y divide-line">
              {openReports.slice(0, LATEST).map((report) => (
                <li key={report._id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-ink">{report.title}</p>
                    <span className="shrink-0 text-xs text-ink-subtle">{formatAgo(report.createdAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{report.description}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <p className="text-sm text-ink-subtle">
        Orders and revenue aren&apos;t shown: the store&apos;s order service can only list a customer&apos;s own orders,
        not all of them.
      </p>

      {failed && (
        <div>
          <Button onClick={() => [products, users, reviews, reports, subscribers, coupons].forEach((query) => query.refetch())}>
            Try again
          </Button>
        </div>
      )}
    </>
  );
}

function TileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} aria-label={`Open ${label}`} className="rounded-control p-1 text-ink-subtle hover:bg-surface-muted hover:text-ink">
      <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}

function SeeAll({ href }: { href: string }) {
  return (
    <Link href={href} className="text-sm font-medium text-tertiary hover:underline">
      See all
    </Link>
  );
}
