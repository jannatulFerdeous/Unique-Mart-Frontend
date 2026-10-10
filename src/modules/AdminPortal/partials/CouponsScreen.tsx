"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useGetCouponsQuery, useSaveCouponMutation } from "@/redux/features/coupon/couponApi";
import type { Coupon } from "@/redux/features/coupon/coupon.types";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatDate } from "@/shared/libs/admin/format";
import { formatPrice } from "@/shared/utils/price";
import { Button, ButtonLink } from "../components/Button";
import { NoticeLine, SearchBox } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { StatusSwitch } from "../components/StatusSwitch";
import { Table, TableScroll, Td, Th, Tr } from "../components/Table";
import { COUPONS_BLURB, COUPONS_HREF, couponWindow, describeDiscount } from "../config/coupons";

const appliesTo = (coupon: Coupon) => {
  const parts = [
    [coupon.applicableMainCategories.length, "main category", "main categories"],
    [coupon.applicableCategories.length, "category", "categories"],
    [coupon.applicableProducts.length, "product", "products"],
  ] as const;
  const named = parts.filter(([count]) => count > 0).map(([count, one, many]) => `${count} ${count === 1 ? one : many}`);
  return named.length ? named.join(", ") : "Everything";
};

export function CouponsScreen() {
  const notice = useAppSelector(selectNotice("coupons"));
  const { data: coupons = [], isLoading, isError, error, refetch } = useGetCouponsQuery();
  const [search, setSearch] = useState("");

  const term = search.trim().toLowerCase();
  const shown = term
    ? coupons.filter((coupon) => `${coupon.code} ${coupon.description ?? ""}`.toLowerCase().includes(term))
    : coupons;

  return (
    <>
      <ScreenHeader
        title="Coupons"
        blurb={COUPONS_BLURB}
        actions={
          <ButtonLink href={`${COUPONS_HREF}/new`} variant="primary">
            <Plus className="size-4" aria-hidden />
            Add coupon
          </ButtonLink>
        }
      />

      <NoticeLine notice={notice} />

      <div className="flex justify-end">
        <SearchBox value={search} onChange={setSearch} label="Search codes" />
      </div>

      <p className="text-sm text-ink-muted">
        Codes can be set up here, but checkout doesn&apos;t take them yet: the store&apos;s order service accepts a
        code and ignores it.
      </p>

      <Panel bodyClassName="py-0 md:py-0">
        {isLoading ? (
          <EmptyState title="Loading coupons…" />
        ) : isError ? (
          <EmptyState
            title="Couldn't load coupons"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : shown.length === 0 ? (
          <EmptyState
            title={term ? "No coupons match" : "No coupons yet"}
            body={term ? "Try a different code." : "Add a code to offer money off."}
          />
        ) : (
          <TableScroll>
            <Table className="min-w-5xl">
              <caption className="sr-only">Coupons</caption>
              <thead>
                <tr>
                  <Th>Code</Th>
                  <Th>Discount</Th>
                  <Th>Applies to</Th>
                  <Th>Runs</Th>
                  <Th>Used</Th>
                  <Th>State</Th>
                  <Th>On</Th>
                  <Th>
                    <span className="sr-only">Actions</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {shown.map((coupon) => (
                  <CouponRow key={coupon._id} coupon={coupon} />
                ))}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </Panel>
    </>
  );
}

function CouponRow({ coupon }: { coupon: Coupon }) {
  const dispatch = useAppDispatch();
  const [save, { isLoading: saving }] = useSaveCouponMutation();
  const state = couponWindow(coupon);
  const on = coupon.status === "active";

  const toggle = async () => {
    try {
      await save({ id: coupon._id, fields: { status: on ? "inactive" : "active" } }).unwrap();
      dispatch(showNotice({ scope: "coupons", tone: "good", text: `${coupon.code} is ${on ? "off" : "on"}.` }));
    } catch (problem) {
      dispatch(showNotice({ scope: "coupons", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  return (
    <Tr aria-busy={saving}>
      <Td className="min-w-48">
        <p className="font-mono font-semibold text-ink">{coupon.code}</p>
        {coupon.description && <p className="line-clamp-2 text-xs text-ink-muted">{coupon.description}</p>}
      </Td>
      <Td className="whitespace-nowrap">
        <p className="text-ink">{describeDiscount(coupon)}</p>
        {coupon.minimumOrderAmount > 0 && (
          <p className="text-xs text-ink-muted">Orders over {formatPrice(coupon.minimumOrderAmount)}</p>
        )}
      </Td>
      <Td className="text-ink-muted">{appliesTo(coupon)}</Td>
      <Td className="whitespace-nowrap text-ink-muted">
        {formatDate(coupon.startDate)} – {formatDate(coupon.endDate)}
      </Td>
      <Td className="whitespace-nowrap text-ink-muted tabular-nums">
        {coupon.usedCount}
        {coupon.usageLimit !== null ? ` / ${coupon.usageLimit}` : ""}
        {coupon.perUserLimit !== null && <span className="block text-xs">{coupon.perUserLimit} per customer</span>}
      </Td>
      <Td>
        <StatusPill label={state.label} tone={state.tone} />
      </Td>
      <Td>
        <StatusSwitch label={coupon.code} on={on} disabled={saving} onToggle={toggle} onText="On" offText="Off" />
      </Td>
      <Td className="text-right">
        <ButtonLink href={`${COUPONS_HREF}/${coupon._id}/edit`} size="sm" aria-label={`Edit ${coupon.code}`}>
          <Pencil className="size-3.5" aria-hidden />
          Edit
        </ButtonLink>
      </Td>
    </Tr>
  );
}
