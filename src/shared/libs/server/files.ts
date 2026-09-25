/* The shop's writable data on the server's own disk.
 *
 * Everything lives under `storage/`, outside `public/` and out of git: it is
 * what the portal changes at runtime, not what ships with the code. That needs a
 * server with a persistent, writable disk — a VPS or a container with a volume.
 * On a serverless host the folder is read-only or thrown away between requests;
 * the helpers below are the seam to reroute to a database when that day comes. */

import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const STORAGE_ROOT = path.join(process.cwd(), "storage");

/** Parsed JSON, or null when the file is missing or unreadable. */
export const readJson = async (file: string): Promise<unknown> => {
  try {
    return JSON.parse(await readFile(file, "utf8")) as unknown;
  } catch {
    return null;
  }
};

/** Written to a temporary file and renamed over the target, so a crash half-way
 *  through a write leaves the old file rather than a truncated one. */
export const writeJson = async (file: string, value: unknown): Promise<void> => {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${randomBytes(4).toString("hex")}.tmp`;
  await writeFile(temp, JSON.stringify(value, null, 2));
  await rename(temp, file);
};

/** Best effort: a file that is already gone is the outcome we wanted. */
export const removeFile = async (file: string): Promise<void> => {
  try {
    await unlink(file);
  } catch {
    // Already removed, or never written.
  }
};

/** Runs one read-change-write at a time.
 *
 *  Two requests that both read a file before either writes would otherwise each
 *  save their own copy, and the second would silently drop the first one's
 *  change. One queue per file; one process only — which is also the only setup
 *  a local-disk store supports. */
export const createQueue = () => {
  let queue: Promise<unknown> = Promise.resolve();

  return <T>(task: () => Promise<T>): Promise<T> => {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  };
};
