import type { ApiErrorBody } from "./types";

const isApiErrorBody = (data: unknown): data is ApiErrorBody =>
  typeof data === "object" && data !== null && typeof (data as ApiErrorBody).message === "string";

// The backend forwards some errors raw: a failed Zod check arrives as its
// issue list in JSON, a unique-index clash as Mongo's E11000 text.
const readable = (message: string): string => {
  if (message.includes("E11000")) return "Something with that name or SKU already exists.";
  if (!message.trimStart().startsWith("[")) return message;
  try {
    const issues = JSON.parse(message) as { message?: string; path?: (string | number)[] }[];
    const first = issues[0];
    if (!first?.message) return message;
    const field = first.path?.filter((part) => part !== "body").join(".");
    return field ? `${first.message} (${field})` : first.message;
  } catch {
    return message;
  }
};

// Turns an RTK Query error (or anything `unwrap()` throws) into a message people can act on.
export const apiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (typeof error !== "object" || error === null) return fallback;

  if ("status" in error) {
    if (error.status === "FETCH_ERROR") return "Can't reach the server. Check that the backend is running.";
    if (error.status === "TIMEOUT_ERROR") return "The server didn't answer in time. Check that the backend is running, not paused.";
    if ("data" in error && isApiErrorBody(error.data)) return readable(error.data.message);
    return fallback;
  }

  if ("message" in error && typeof error.message === "string") return error.message;
  return fallback;
};
