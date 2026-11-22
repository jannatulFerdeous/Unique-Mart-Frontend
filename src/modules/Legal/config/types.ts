export type Block =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  // A sentence that ends in a link to another page: "{before}{label}{after}".
  | { kind: "link"; before: string; label: string; href: string; after?: string }
  | { kind: "table"; head: string[]; rows: string[][] };

export type Section = {
  heading: string;
  blocks: Block[];
};

export type ProsePage = {
  title: string;
  intro: string;
  updated: string;
  numbered?: boolean;
  sections: Section[];
};
