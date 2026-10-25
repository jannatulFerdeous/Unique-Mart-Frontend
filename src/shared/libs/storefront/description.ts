import "server-only";

import sanitizeHtml from "sanitize-html";
import { toRichText } from "@/shared/utils/richText";

// Only what the admin's editor can make. Anything else pasted into a
// description (scripts, styles, event handlers, frames) is dropped before
// it reaches the shop. Server-only, so the sanitiser stays out of the bundle.
const ALIGNABLE = ["p", "h2", "h3", "h4", "h5"];

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...ALIGNABLE,
    "br", "strong", "b", "em", "i", "u", "s", "mark", "sup", "sub", "code", "pre",
    "ul", "ol", "li", "blockquote", "a", "hr", "img",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "loading", "decoding"],
    ol: ["start"],
    // Task lists: <ul data-type="taskList"><li data-type="taskItem" data-checked="true">.
    // Their checkboxes are dropped; the shop draws a tick from data-checked.
    ul: ["data-type"],
    li: ["data-type", "data-checked"],
    ...Object.fromEntries(ALIGNABLE.map((tag) => [tag, ["style"]])),
  },
  // Only the text alignment the editor sets.
  allowedStyles: { "*": { "text-align": [/^(left|right|center|justify)$/] } },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Images only over https: no data: or http: sources.
  allowedSchemesByTag: { img: ["https"] },
  transformTags: {
    // The page's h1 is the product name; the editor's headings start at h2.
    h1: "h2",
    h6: "h5",
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer nofollow" }),
    img: sanitizeHtml.simpleTransform("img", { loading: "lazy", decoding: "async" }),
  },
  // An image whose source was refused would be an empty box.
  exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
};

// A product's description as safe HTML for the shop, or "" when there's none.
export const descriptionHtml = (description?: string | null): string => {
  const html = sanitizeHtml(toRichText(description), OPTIONS);
  return html.includes("<img") || html.replace(/<[^>]*>|&nbsp;/g, "").trim() ? html : "";
};
