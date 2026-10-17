"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { CircleAlert, CircleCheck, Download, FileSpreadsheet, Upload, X } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { readSheet, type SheetRow } from "@/shared/libs/admin/excel";
import { cn } from "@/shared/utils/cn";
import { Button } from "./Button";
import { StatusPill } from "./StatusPill";

// One sheet row, checked and ready: what it will do, or why it can't.
export type PlannedRow = {
  row: number;
  label: string;
  action: "create" | "update" | "skip";
  detail?: string;
  error?: string;
  apply?: () => Promise<unknown>;
};

export type Importer = {
  // e.g. "products"
  noun: string;
  // What the sheet needs, in a sentence or two.
  help: string;
  template: () => Promise<void>;
  // Reads the rows against what's in the shop; nothing is saved yet.
  plan: (rows: SheetRow[], headers: string[]) => Promise<PlannedRow[]>;
};

type Failure = { row: number; label: string; message: string };

type Stage =
  | { step: "pick"; problem?: string }
  | { step: "reading" }
  | { step: "review"; file: string; plan: PlannedRow[] }
  | { step: "applying"; done: number; total: number }
  | { step: "done"; applied: number; failures: Failure[] };

const ACTION_PILL = {
  create: { label: "New", tone: "good" },
  update: { label: "Update", tone: "flow-2" },
  skip: { label: "No change", tone: "neutral" },
} as const;

// "Download Excel" for a list, and "Upload Excel" when the list can be filled
// from a sheet: pick a file, review what each row will do, then apply.
export function ExcelActions({ onDownload, importer }: { onDownload: () => Promise<void>; importer?: Importer }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadProblem, setDownloadProblem] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>({ step: "pick" });
  const dialog = useRef<HTMLDialogElement>(null);

  const download = async () => {
    setDownloading(true);
    setDownloadProblem(null);
    try {
      await onDownload();
    } catch (problem) {
      setDownloadProblem(apiErrorMessage(problem, "Couldn't make the Excel file. Please try again."));
    } finally {
      setDownloading(false);
    }
  };

  const open = () => {
    setStage({ step: "pick" });
    dialog.current?.showModal();
  };

  const close = () => {
    if (stage.step === "applying") return;
    dialog.current?.close();
  };

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !importer) return;
    if (!/\.xlsx$/i.test(file.name)) {
      setStage({ step: "pick", problem: "Choose an Excel file (.xlsx)." });
      return;
    }
    setStage({ step: "reading" });
    try {
      const { headers, rows } = await readSheet(file);
      if (rows.length === 0) {
        setStage({ step: "pick", problem: "That sheet has no rows under its headings." });
        return;
      }
      setStage({ step: "review", file: file.name, plan: await importer.plan(rows, headers) });
    } catch (problem) {
      setStage({ step: "pick", problem: apiErrorMessage(problem, "Couldn't read that file. Is it an Excel workbook?") });
    }
  };

  const apply = async (plan: PlannedRow[]) => {
    const todo = plan.filter((each) => !each.error && each.apply && each.action !== "skip");
    const failures: Failure[] = [];
    setStage({ step: "applying", done: 0, total: todo.length });
    for (const [index, each] of todo.entries()) {
      try {
        await each.apply?.();
      } catch (problem) {
        failures.push({ row: each.row, label: each.label, message: apiErrorMessage(problem) });
      }
      setStage({ step: "applying", done: index + 1, total: todo.length });
    }
    setStage({ step: "done", applied: todo.length - failures.length, failures });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={download} disabled={downloading}>
          <Download className="size-4" aria-hidden />
          {downloading ? "Preparing…" : "Download Excel"}
        </Button>
        {importer && (
          <Button onClick={open}>
            <Upload className="size-4" aria-hidden />
            Upload Excel
          </Button>
        )}
        {downloadProblem && (
          <p role="alert" className="w-full text-sm text-danger">
            {downloadProblem}
          </p>
        )}
      </div>

      {importer && (
        <dialog
          ref={dialog}
          onCancel={(event) => {
            if (stage.step === "applying") event.preventDefault();
          }}
          aria-labelledby="excel-import-title"
          className="m-auto w-[min(46rem,calc(100vw-2rem))] rounded-card bg-surface p-0 text-ink shadow-2xl backdrop:bg-inverse-deep/50 backdrop:backdrop-blur-[2px]"
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <h2 id="excel-import-title" className="flex items-center gap-2 font-sans text-base font-bold text-ink">
              <FileSpreadsheet className="size-5 text-good" aria-hidden />
              Upload {importer.noun} from Excel
            </h2>
            <button
              type="button"
              onClick={close}
              disabled={stage.step === "applying"}
              aria-label="Close"
              className="grid size-8 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink disabled:opacity-40"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
            {(stage.step === "pick" || stage.step === "reading") && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-ink-muted">{importer.help}</p>
                <div>
                  <Button size="sm" variant="ghost" onClick={() => importer.template()}>
                    <Download className="size-4" aria-hidden />
                    Download a template
                  </Button>
                </div>
                <label
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-line-strong bg-canvas px-4 py-10 text-center transition-colors hover:border-tertiary hover:bg-tertiary-soft",
                    stage.step === "reading" && "pointer-events-none opacity-60",
                  )}
                >
                  <Upload className="size-6 text-tertiary" aria-hidden />
                  <span className="font-medium text-ink">
                    {stage.step === "reading" ? "Reading the sheet…" : "Choose an Excel file (.xlsx)"}
                  </span>
                  <span className="text-xs text-ink-subtle">Nothing changes until you check the rows and apply them.</span>
                  <input type="file" accept=".xlsx" onChange={pick} className="sr-only" />
                </label>
                {stage.step === "pick" && stage.problem && (
                  <p role="alert" className="text-sm font-medium text-danger">
                    {stage.problem}
                  </p>
                )}
              </div>
            )}

            {stage.step === "review" && <Review stage={stage} onApply={apply} onBack={() => setStage({ step: "pick" })} />}

            {stage.step === "applying" && (
              <div className="flex flex-col gap-3 py-6" role="status">
                <p className="font-medium text-ink">
                  Saving {stage.done} of {stage.total}…
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-tertiary transition-[width] duration-300"
                    style={{ width: `${stage.total ? (stage.done / stage.total) * 100 : 100}%` }}
                  />
                </div>
                <p className="text-xs text-ink-subtle">Keep this open until it&apos;s finished.</p>
              </div>
            )}

            {stage.step === "done" && (
              <div className="flex flex-col gap-4" role="status">
                <p className="flex items-center gap-2 font-medium text-ink">
                  <CircleCheck className="size-5 text-good" aria-hidden />
                  {stage.applied} {stage.applied === 1 ? "row" : "rows"} saved.
                </p>
                {stage.failures.length > 0 && (
                  <div>
                    <p className="flex items-center gap-2 font-medium text-danger">
                      <CircleAlert className="size-5" aria-hidden />
                      {stage.failures.length} couldn&apos;t be saved:
                    </p>
                    <ul className="mt-2 flex flex-col gap-1 text-sm">
                      {stage.failures.map((failure) => (
                        <li key={failure.row} className="rounded-control bg-danger-soft px-3 py-2">
                          <span className="font-medium">
                            Row {failure.row} · {failure.label}:
                          </span>{" "}
                          {failure.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button variant="primary" onClick={close}>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </dialog>
      )}
    </>
  );
}

function Review({
  stage,
  onApply,
  onBack,
}: {
  stage: Extract<Stage, { step: "review" }>;
  onApply: (plan: PlannedRow[]) => void;
  onBack: () => void;
}) {
  const { plan } = stage;
  const count = (action: PlannedRow["action"]) => plan.filter((each) => !each.error && each.action === action).length;
  const errors = plan.filter((each) => each.error).length;
  const ready = count("create") + count("update");

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-muted">
        <span className="font-medium text-ink">{stage.file}</span> · {plan.length} {plan.length === 1 ? "row" : "rows"}
      </p>

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-good-soft px-3 py-1 font-medium text-good">{count("create")} new</span>
        <span className="rounded-full bg-tertiary-soft px-3 py-1 font-medium text-tertiary">{count("update")} to update</span>
        <span className="rounded-full bg-surface-muted px-3 py-1 font-medium text-ink-muted">{count("skip")} unchanged</span>
        {errors > 0 && (
          <span className="rounded-full bg-danger-soft px-3 py-1 font-medium text-danger">{errors} with problems</span>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto rounded-control border border-line">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-surface-muted text-xs text-ink-muted">
            <tr>
              <th className="px-3 py-2 font-semibold">Row</th>
              <th className="px-3 py-2 font-semibold">Item</th>
              <th className="px-3 py-2 font-semibold">What happens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {plan.map((each) => (
              <tr key={each.row} className={each.error ? "bg-danger-soft/50" : undefined}>
                <td className="px-3 py-2 align-top text-ink-subtle tabular-nums">{each.row}</td>
                <td className="px-3 py-2 align-top font-medium text-ink">{each.label}</td>
                <td className="px-3 py-2 align-top">
                  {each.error ? (
                    <span className="text-danger">{each.error}</span>
                  ) : (
                    <span className="flex flex-col items-start gap-1">
                      <StatusPill label={ACTION_PILL[each.action].label} tone={ACTION_PILL[each.action].tone} />
                      {each.detail && <span className="text-xs text-ink-muted">{each.detail}</span>}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors > 0 && <p className="text-sm text-ink-muted">Rows with problems are left out. Fix them in the sheet and upload it again.</p>}

      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="ghost" onClick={onBack}>
          Choose another file
        </Button>
        <Button variant="primary" onClick={() => onApply(plan)} disabled={ready === 0}>
          {ready === 0 ? "Nothing to save" : `Save ${ready} ${ready === 1 ? "row" : "rows"}`}
        </Button>
      </div>
    </div>
  );
}
