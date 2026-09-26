export type Block =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
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
