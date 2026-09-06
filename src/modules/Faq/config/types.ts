import type { ContactAction } from "@/common/components/ContactBand";
import type { FaqGroup } from "@/shared/config/faq";

export type FaqData = {
  title: string;
  /** The root layout already suffixes `<title>` with the site name. */
  metaTitle: string;
  lede: string;
  search: {
    /** Visually hidden — the field carries a placeholder, not a visible label. */
    label: string;
    placeholder: string;
  };
  /** Shown in place of the groups when a search matches nothing. */
  empty: string;
  /** Accessible name for the jump nav. */
  navLabel: string;
  expandAll: string;
  collapseAll: string;
  groups: FaqGroup[];
  contact: {
    title: string;
    body: string;
    actions: ContactAction[];
  };
};
