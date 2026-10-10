"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import {
  SUBSCRIBER_STATUSES,
  useDeleteSubscriberMutation,
  useGetSubscribersQuery,
  useSetSubscriberStatusMutation,
  type Subscriber,
  type SubscriberStatus,
} from "@/redux/features/newsletter/newsletterApi";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatDate, formatDateTime } from "@/shared/libs/admin/format";
import { cn } from "@/shared/utils/cn";
import { Button } from "../components/Button";
import { ConfirmAction } from "../components/ConfirmAction";
import { NoticeLine, SearchBox } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { Table, TableScroll, Td, Th, Tr } from "../components/Table";
import { SUBSCRIBER_STATUS_META } from "../config/feedback";
import { blurbFor } from "./AdminSidebar";

// A one-column CSV of the addresses on screen, for a mailing tool.
const download = (subscribers: Subscriber[]) => {
  const csv = ["email", ...subscribers.map((each) => each.email)].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: "newsletter-subscribers.csv" });
  link.click();
  URL.revokeObjectURL(url);
};

export function NewsletterScreen() {
  const notice = useAppSelector(selectNotice("newsletter"));
  const { data: subscribers = [], isLoading, isError, error, refetch } = useGetSubscribersQuery();
  const [tab, setTab] = useState<SubscriberStatus>("subscribed");
  const [search, setSearch] = useState("");

  const term = search.trim().toLowerCase();
  const shown = subscribers.filter((each) => each.status === tab && (!term || each.email.includes(term)));

  return (
    <>
      <ScreenHeader
        title="Newsletter"
        blurb={blurbFor("/admin/newsletter")}
        actions={
          <Button onClick={() => download(shown)} disabled={shown.length === 0}>
            <Download className="size-4" aria-hidden />
            Download CSV
          </Button>
        }
      />
      <NoticeLine notice={notice} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filter by status" className="inline-flex gap-1 rounded-control border border-line bg-surface p-1">
          {SUBSCRIBER_STATUSES.map((status) => (
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
              {SUBSCRIBER_STATUS_META[status].label}
              <span className="ml-1.5 tabular-nums opacity-70">
                {subscribers.filter((each) => each.status === status).length}
              </span>
            </button>
          ))}
        </div>
        <SearchBox value={search} onChange={setSearch} label="Search emails" />
      </div>

      <Panel bodyClassName="py-0 md:py-0">
        {isLoading ? (
          <EmptyState title="Loading subscribers…" />
        ) : isError ? (
          <EmptyState
            title="Couldn't load subscribers"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : shown.length === 0 ? (
          <EmptyState
            title={term ? "No emails match" : tab === "subscribed" ? "No subscribers yet" : "Nobody has unsubscribed"}
            body={!term && tab === "subscribed" ? "Shoppers sign up from the form at the bottom of every page." : undefined}
          />
        ) : (
          <TableScroll>
            <Table>
              <caption className="sr-only">Newsletter subscribers</caption>
              <thead>
                <tr>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Signed up</Th>
                  <Th>
                    <span className="sr-only">Actions</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {shown.map((subscriber) => (
                  <SubscriberRow key={subscriber._id} subscriber={subscriber} />
                ))}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </Panel>
    </>
  );
}

function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  const dispatch = useAppDispatch();
  const [setStatus, setting] = useSetSubscriberStatusMutation();
  const [remove, removing] = useDeleteSubscriberMutation();
  const busy = setting.isLoading || removing.isLoading;
  const meta = SUBSCRIBER_STATUS_META[subscriber.status];
  const subscribed = subscriber.status === "subscribed";

  const act = async (action: () => Promise<unknown>, text: string) => {
    try {
      await action();
      dispatch(showNotice({ scope: "newsletter", tone: "good", text }));
    } catch (problem) {
      dispatch(showNotice({ scope: "newsletter", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  return (
    <Tr aria-busy={busy}>
      <Td className="font-medium text-ink">{subscriber.email}</Td>
      <Td>
        <StatusPill label={meta.label} tone={meta.tone} />
      </Td>
      <Td className="whitespace-nowrap text-ink-muted">
        <time dateTime={subscriber.subscribedAt} title={formatDateTime(subscriber.subscribedAt)}>
          {formatDate(subscriber.subscribedAt)}
        </time>
        {subscriber.unsubscribedAt && (
          <span className="block text-xs">Left {formatDate(subscriber.unsubscribedAt)}</span>
        )}
      </Td>
      <Td>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Button
            size="sm"
            disabled={busy}
            onClick={() =>
              act(
                () => setStatus({ id: subscriber._id, status: subscribed ? "unsubscribed" : "subscribed" }).unwrap(),
                `${subscriber.email} is ${subscribed ? "unsubscribed" : "subscribed again"}.`,
              )
            }
          >
            {subscribed ? "Unsubscribe" : "Resubscribe"}
          </Button>
          <ConfirmAction
            label="Delete"
            describe={subscriber.email}
            onConfirm={() => act(() => remove(subscriber._id).unwrap(), `${subscriber.email} is deleted.`)}
          />
        </div>
      </Td>
    </Tr>
  );
}
