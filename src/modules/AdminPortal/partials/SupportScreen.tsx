"use client";

import { useState, type FormEvent } from "react";
import { apiErrorMessage } from "@/redux/api/errors";
import { REPORT_LIMITS, useCreateReportMutation, useGetMyReportsQuery } from "@/redux/features/report/reportApi";
import { formatDate, formatDateTime } from "@/shared/libs/admin/format";
import { Button } from "../components/Button";
import { Field, Input, Textarea } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { REPORT_STATUS_META } from "../config/feedback";
import { blurbFor } from "./AdminSidebar";

export function SupportScreen() {
  const { data: reports = [], isLoading, isError, error, refetch } = useGetMyReportsQuery();

  return (
    <>
      <ScreenHeader title="Support" blurb={blurbFor("/account/support")} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ReportForm />

        <Panel title="Your requests" bodyClassName="py-0 md:py-0">
          {isLoading ? (
            <EmptyState title="Loading your requests…" />
          ) : isError ? (
            <EmptyState
              title="Couldn't load your requests"
              body={apiErrorMessage(error)}
              action={<Button onClick={() => refetch()}>Try again</Button>}
            />
          ) : reports.length === 0 ? (
            <EmptyState title="Nothing sent yet" body="Requests you send show here with where they're up to." />
          ) : (
            <ul className="divide-y divide-line">
              {reports.map((report) => {
                const meta = REPORT_STATUS_META[report.status];
                return (
                  <li key={report._id} className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-ink">{report.title}</p>
                      <StatusPill label={meta.label} tone={meta.tone} />
                    </div>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      <time dateTime={report.createdAt} title={formatDateTime(report.createdAt)}>
                        {formatDate(report.createdAt)}
                      </time>
                    </p>
                    <p className="mt-2 text-sm whitespace-pre-line text-ink-muted">{report.description}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

function ReportForm() {
  const [create, { isLoading: sending }] = useCreateReportMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ title?: string; description?: string; submit?: string }>({});
  const [sent, setSent] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found: typeof errors = {};
    const { title: titleLimit, description: bodyLimit } = REPORT_LIMITS;
    if (title.trim().length < titleLimit.min) found.title = `Use at least ${titleLimit.min} characters.`;
    if (description.trim().length < bodyLimit.min) found.description = `Use at least ${bodyLimit.min} characters.`;
    setErrors(found);
    setSent(false);
    if (Object.keys(found).length) return;

    try {
      await create({ title: title.trim(), description: description.trim() }).unwrap();
      setTitle("");
      setDescription("");
      setSent(true);
    } catch (problem) {
      setErrors({ submit: apiErrorMessage(problem) });
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <Panel title="Send us a request" description="A problem with an order, a product or the site? Tell us and we'll look into it.">
        <fieldset disabled={sending} className="grid min-w-0 gap-4">
          <legend className="sr-only">Your request</legend>
          <Field label="Subject" error={errors.title}>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={REPORT_LIMITS.title.max}
              placeholder="e.g. Wrong colour delivered"
            />
          </Field>
          <Field label="What happened?" error={errors.description} hint={`${description.length}/${REPORT_LIMITS.description.max}`}>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={REPORT_LIMITS.description.max}
              className="min-h-36"
            />
          </Field>
        </fieldset>

        {errors.submit && (
          <p role="alert" className="mt-3 text-sm font-medium text-danger">
            {errors.submit}
          </p>
        )}

        <div className="mt-5 flex items-center justify-end gap-3">
          {sent && (
            <p role="status" className="text-sm font-medium text-good">
              Sent. We&apos;ll update its status here.
            </p>
          )}
          <Button type="submit" variant="primary" disabled={sending}>
            {sending ? "Sending…" : "Send request"}
          </Button>
        </div>
      </Panel>
    </form>
  );
}
