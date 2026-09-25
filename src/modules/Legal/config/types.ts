/** A block inside a policy section. Kept to the three shapes these pages
 *  actually use — prose, a bulleted list, and a small table — rather than a
 *  general rich-text model nobody needs yet. */
export type Block =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] };

export type Section = {
  /** Numbered in the rendered heading when the page asks for it. */
  heading: string;
  blocks: Block[];
};

export type ProsePage = {
  /** Breadcrumb leaf and <h1>. */
  title: string;
  /** One line under the title saying what the page is for. */
  intro: string;
  /** ISO date. Rendered as "Last updated 20 September 2026". */
  updated: string;
  /** Numbers the sections, the way a terms document is usually read. */
  numbered?: boolean;
  sections: Section[];
};
