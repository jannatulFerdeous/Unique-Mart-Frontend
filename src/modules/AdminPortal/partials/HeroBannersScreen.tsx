"use client";

import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import {
  useGetBannersQuery,
  useReorderBannersMutation,
  useUpdateBannerMutation,
} from "@/redux/features/banner/bannerApi";
import type { Banner } from "@/redux/features/banner/banner.types";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatAgo, formatDateTime } from "@/shared/libs/admin/format";
import { HERO_MAX_ACTIVE } from "@/shared/libs/hero/types";
import { cn } from "@/shared/utils/cn";
import { Button, ButtonLink } from "../components/Button";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { Table, TableScroll, Td, Th, Tr } from "../components/Table";

const isActive = (banner: Banner) => banner.status === "active";

export function HeroBannersScreen() {
  const dispatch = useAppDispatch();
  const notice = useAppSelector(selectNotice("banners"));
  const { data: banners = [], isLoading, isError, error, refetch } = useGetBannersQuery();
  const [reorder, { isLoading: reordering }] = useReorderBannersMutation();

  const activeCount = banners.filter(isActive).length;

  const move = async (from: number, to: number) => {
    const next = [...banners];
    [next[from], next[to]] = [next[to], next[from]];
    try {
      await reorder(next).unwrap();
      dispatch(showNotice({ scope: "banners", tone: "good", text: "Order saved." }));
    } catch (problem) {
      dispatch(showNotice({ scope: "banners", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  return (
    <>
      <ScreenHeader
        title="Hero banners"
        blurb="The slides across the top of the homepage, and where each one links."
        actions={
          <>
            <ButtonLink href="/" target="_blank" rel="noopener">
              <ExternalLink className="size-4" aria-hidden />
              View homepage
            </ButtonLink>
            <ButtonLink href="/admin/hero-banners/new" variant="primary">
              <Plus className="size-4" aria-hidden />
              Add banner
            </ButtonLink>
          </>
        }
      />

      {notice && (
        <p
          role={notice.tone === "danger" ? "alert" : "status"}
          className={cn("text-sm font-medium", notice.tone === "good" ? "text-good" : "text-danger")}
        >
          {notice.text}
        </p>
      )}

      <Panel
        title="Banners"
        description={`Shown on the homepage in this order. Up to ${HERO_MAX_ACTIVE} can be live at once (${activeCount} now).`}
        bodyClassName="py-0 md:py-0"
      >
        {isLoading ? (
          <EmptyState title="Loading banners…" />
        ) : isError ? (
          <EmptyState
            title="Couldn't load the banners"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : banners.length === 0 ? (
          <EmptyState
            title="No banners yet"
            body="Add the first banner and it will appear across the top of the homepage."
            action={
              <ButtonLink href="/admin/hero-banners/new" variant="primary">
                <Plus className="size-4" aria-hidden />
                Add banner
              </ButtonLink>
            }
          />
        ) : (
          <TableScroll>
            <Table>
              <caption className="sr-only">Hero banners, in homepage order</caption>
              <thead>
                <tr>
                  <Th className="w-28">Order</Th>
                  <Th className="w-44">Image</Th>
                  <Th>Title &amp; link</Th>
                  <Th className="w-44">Status</Th>
                  <Th className="w-32">Updated</Th>
                  <Th className="w-20">
                    <span className="sr-only">Actions</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner, position) => (
                  <BannerRow
                    key={banner._id}
                    banner={banner}
                    position={position}
                    last={position === banners.length - 1}
                    canShow={isActive(banner) || activeCount < HERO_MAX_ACTIVE}
                    reordering={reordering}
                    onMove={move}
                  />
                ))}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </Panel>
    </>
  );
}

function BannerRow({
  banner,
  position,
  last,
  canShow,
  reordering,
  onMove,
}: {
  banner: Banner;
  position: number;
  last: boolean;
  canShow: boolean;
  reordering: boolean;
  onMove: (from: number, to: number) => void;
}) {
  const n = position + 1;
  const live = isActive(banner);

  return (
    <Tr>
      <Td>
        <div className="flex items-center gap-1">
          <span className="w-5 text-center font-semibold tabular-nums text-ink">{n}</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={position === 0 || reordering}
            onClick={() => onMove(position, position - 1)}
            aria-label={`Move ${banner.title} up`}
          >
            <ArrowUp className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={last || reordering}
            onClick={() => onMove(position, position + 1)}
            aria-label={`Move ${banner.title} down`}
          >
            <ArrowDown className="size-4" aria-hidden />
          </Button>
        </div>
      </Td>
      <Td>
        <span
          className={cn(
            "block aspect-64/19 w-36 overflow-hidden rounded-control bg-surface-muted",
            !live && "opacity-50",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner.image.url} alt="" className="h-full w-full object-cover" />
        </span>
      </Td>
      <Td className="max-w-0">
        <p className="truncate font-medium text-ink">{banner.title}</p>
        <p className="truncate text-xs text-ink-muted">{banner.link}</p>
      </Td>
      <Td>
        <StatusSwitch banner={banner} canShow={canShow} />
      </Td>
      <Td className="whitespace-nowrap text-ink-muted">
        <time dateTime={banner.updatedAt} title={formatDateTime(banner.updatedAt)}>
          {formatAgo(banner.updatedAt)}
        </time>
      </Td>
      <Td className="text-right">
        <ButtonLink
          href={`/admin/hero-banners/${banner._id}/edit`}
          size="sm"
          aria-label={`Edit ${banner.title}`}
        >
          <Pencil className="size-3.5" aria-hidden />
          Edit
        </ButtonLink>
      </Td>
    </Tr>
  );
}

function StatusSwitch({ banner, canShow }: { banner: Banner; canShow: boolean }) {
  const dispatch = useAppDispatch();
  const [update, { isLoading: saving }] = useUpdateBannerMutation();
  const live = isActive(banner);
  const blocked = !live && !canShow;

  const toggle = async () => {
    try {
      await update({ banner, changes: { status: live ? "inactive" : "active" } }).unwrap();
      dispatch(
        showNotice({
          scope: "banners",
          tone: "good",
          text: live ? `"${banner.title}" is hidden.` : `"${banner.title}" is on the homepage.`,
        }),
      );
    } catch (problem) {
      dispatch(showNotice({ scope: "banners", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={live}
        aria-label={`Show ${banner.title} on the homepage`}
        disabled={saving || blocked}
        onClick={toggle}
        title={blocked ? `${HERO_MAX_ACTIVE} banners are already live. Hide one first.` : undefined}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          live ? "bg-tertiary" : "bg-line-strong",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "size-4 rounded-full bg-surface shadow-card transition-transform",
            live ? "translate-x-4.5" : "translate-x-0.5",
          )}
        />
      </button>
      <span className={cn("text-sm", live ? "text-good" : "text-ink-subtle")}>
        {saving ? "Saving…" : live ? "On homepage" : "Hidden"}
      </span>
    </div>
  );
}
