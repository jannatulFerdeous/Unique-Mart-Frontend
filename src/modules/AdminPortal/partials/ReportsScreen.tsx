"use client";

import { useState } from "react";
import { apiErrorMessage } from "@/redux/api/errors";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import {
  REPORT_STATUSES,
  useDeleteReportMutation,
  useGetAllReportsQuery,
  useSetReportStatusMutation,
  type Report,
  type ReportStatus,
} from "@/redux/features/report/reportApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatDate, formatDateTime } from "@/shared/libs/admin/format";
import { Button } from "../components/Button";
import { ConfirmAction } from "../components/ConfirmAction";
import { FilterSelect, Select } from "../components/Field";
import { NoticeLine, SearchBox } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { REPORT_STATUS_META } from "../config/feedback";
import { blurbFor } from "./AdminSidebar";

// Open requests first; that's what the default view shows.
const OPEN: ReportStatus[] = ["pending", "in_progress"];

export function ReportsScreen() {
  const notice = useAppSelector(selectNotice("reports"));
  const { data: reports = [], isLoading, isError, error, refetch } = useGetAllReportsQuery();
  const [status, setStatus] = useState<ReportStatus | "open" | "">("open");
  const [search, setSearch] = useState("");

  const term = search.trim().toLowerCase();
  const shown = reports.filter((report) => {
    const inStatus = status === "" || (status === "open" ? OPEN.includes(report.status) : report.status === status);
    const person = sender(report);
    return inStatus && (!term || [report.title, report.description, person?.name, person?.email].join(" ").toLowerCase().includes(term));
  });

  return (
    <>
      <ScreenHeader title="Support requests" blurb={blurbFor("/admin/reports")} />
      <NoticeLine notice={notice} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterSelect label="Show" value={status} onChange={(event) => setStatus(event.target.value as ReportStatus | "open" | "")}>
          <option value="open">Open</option>
          {REPORT_STATUSES.map((value) => (
            <option key={value} value={value}>
              {REPORT_STATUS_META[value].label}
            </option>
          ))}
          <option value="">All</option>
        </FilterSelect>
        <SearchBox value={search} onChange={setSearch} label="Search requests" />
      </div>

      <Panel bodyClassName="py-0 md:py-0">
        {isLoading ? (
          <EmptyState title="Loading requests…" />
        ) : isError ? (
          <EmptyState
            title="Couldn't load requests"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : shown.length === 0 ? (
          <EmptyState
            title={term ? "No requests match" : status === "open" ? "Nothing open" : "No requests here"}
            body={!term && status === "open" ? "Customers send these from Support in their account." : undefined}
          />
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((report) => (
              <ReportRow key={report._id} report={report} />
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

const sender = (report: Report) => (report.userId && typeof report.userId === "object" ? report.userId : null);

function ReportRow({ report }: { report: Report }) {
  const dispatch = useAppDispatch();
  const [setStatus, setting] = useSetReportStatusMutation();
  const [remove, removing] = useDeleteReportMutation();
  const busy = setting.isLoading || removing.isLoading;
  const person = sender(report);
  const meta = REPORT_STATUS_META[report.status];

  const act = async (action: () => Promise<unknown>, text: string) => {
    try {
      await action();
      dispatch(showNotice({ scope: "reports", tone: "good", text }));
    } catch (problem) {
      dispatch(showNotice({ scope: "reports", tone: "danger", text: apiErrorMessage(problem) }));
    }
  };

  return (
    <li aria-busy={busy} className="flex flex-col gap-3 py-4 md:flex-row md:items-start">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-medium text-ink">{report.title}</p>
          <StatusPill label={meta.label} tone={meta.tone} />
        </div>
        <p className="mt-0.5 text-sm text-ink-muted">
          {person ? (
            <>
              {person.name} ·{" "}
              <a href={`mailto:${person.email}`} className="hover:text-tertiary hover:underline">
                {person.email}
              </a>
            </>
          ) : (
            "Deleted account"
          )}{" "}
          ·{" "}
          <time dateTime={report.createdAt} title={formatDateTime(report.createdAt)}>
            {formatDate(report.createdAt)}
          </time>
        </p>
        <p className="mt-2 text-sm whitespace-pre-line text-ink">{report.description}</p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        <Select
          aria-label={`Status of "${report.title}"`}
          value={report.status}
          disabled={busy}
          onChange={(event) => {
            const next = event.target.value as ReportStatus;
            act(() => setStatus({ id: report._id, status: next }).unwrap(), `Marked ${REPORT_STATUS_META[next].label.toLowerCase()}.`);
          }}
          className="w-auto py-1.5"
        >
          {REPORT_STATUSES.map((value) => (
            <option key={value} value={value}>
              {REPORT_STATUS_META[value].label}
            </option>
          ))}
        </Select>
        <ConfirmAction
          label="Delete"
          describe={report.title}
          onConfirm={() => act(() => remove(report._id).unwrap(), "Request deleted.")}
        />
      </div>
    </li>
  );
}
