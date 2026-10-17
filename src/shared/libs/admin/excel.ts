"use client";

import type ExcelJS from "exceljs";

// Excel files for the dashboard, written and read in the browser. ExcelJS is
// loaded only when someone downloads or uploads, so it never slows a page.

export type Cell = string | number | boolean | null | undefined;

export type SheetColumn<T> = { header: string; width?: number; value: (row: T) => Cell };

// A row read back from a sheet: its cells by header, and where it was.
export type SheetRow = { row: number; cells: Record<string, string> };

const loadExcel = async (): Promise<typeof ExcelJS> => {
  const mod = await import("exceljs/dist/exceljs.min.js");
  return (mod as unknown as { default?: typeof ExcelJS }).default ?? (mod as unknown as typeof ExcelJS);
};

const BRAND = "FF0171D0";
const BRAND_SOFT = "FFE6F1FB";

const save = (data: ArrayBuffer, filename: string) => {
  const url = URL.createObjectURL(
    new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Today's date for file names, e.g. "2026-10-17".
export const fileDate = () => new Date().toISOString().slice(0, 10);

// Writes one sheet: a bold, frozen header row with filters, then the rows.
export async function downloadSheet<T>(filename: string, sheetName: string, columns: SheetColumn<T>[], rows: T[]) {
  const Excel = await loadExcel();
  const book = new Excel.Workbook();
  book.creator = "Unique Mart";
  const sheet = book.addWorksheet(sheetName, { views: [{ state: "frozen", ySplit: 1 }] });

  sheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.header,
    width: column.width ?? Math.max(12, column.header.length + 4),
  }));
  for (const row of rows) sheet.addRow(columns.map((column) => column.value(row) ?? ""));

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: BRAND } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_SOFT } };
  header.alignment = { vertical: "middle" };
  header.height = 22;
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };

  save(await book.xlsx.writeBuffer(), filename);
}

// Reads the first sheet: row 1 is the headers, every non-empty row after it
// becomes { header: text }. Cell text is what Excel shows, trimmed.
export async function readSheet(file: File): Promise<{ headers: string[]; rows: SheetRow[] }> {
  const Excel = await loadExcel();
  const book = new Excel.Workbook();
  await book.xlsx.load(await file.arrayBuffer());
  const sheet = book.worksheets[0];
  if (!sheet) return { headers: [], rows: [] };

  const headers: string[] = [];
  sheet.getRow(1).eachCell({ includeEmpty: true }, (cell, column) => {
    headers[column - 1] = cell.text.trim();
  });

  const rows: SheetRow[] = [];
  sheet.eachRow((line, number) => {
    if (number === 1) return;
    const cells: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (header) cells[header] = line.getCell(index + 1).text.trim();
    });
    if (Object.values(cells).some(Boolean)) rows.push({ row: number, cells });
  });

  return { headers: headers.filter(Boolean), rows };
}

// Every page of a list, for exports. Stops at the first short page (the
// backend's reported totals can't be trusted), and never runs away.
export async function fetchAllPages<T>(fetchPage: (page: number) => Promise<T[]>, pageSize: number, maxPages = 200) {
  const all: T[] = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const items = await fetchPage(page);
    all.push(...items);
    if (items.length < pageSize) break;
  }
  return all;
}

// "Yes"/"No" both ways.
export const yesNo = (value: boolean) => (value ? "Yes" : "No");
export const isYes = (text: string) => /^(yes|y|true|1)$/i.test(text.trim());
