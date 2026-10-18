// Product descriptions are HTML from the admin's rich-text editor. Older ones,
// and ones imported from Excel, are plain text: paragraphs split by blank lines.

// The editor's output always opens with a block element; plain text doesn't,
// even when it happens to hold a stray tag.
const STARTS_AS_HTML = /^<(p|h[1-6]|ul|ol|blockquote|pre|hr|img|div)\b/i;

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const plainToHtml = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");

// A description as HTML, whichever way it was written. Not sanitised.
export const toRichText = (text?: string | null): string => {
  if (!text?.trim()) return "";
  return STARTS_AS_HTML.test(text.trim()) ? text : plainToHtml(text);
};
