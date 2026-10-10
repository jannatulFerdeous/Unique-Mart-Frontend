import type { ContactAction } from "@/common/components/ContactBand";
import type { FaqGroup } from "@/shared/config/faq";

export type FaqData = {
  title: string;
  metaTitle: string;
  lede: string;
  search: {
    label: string;
    placeholder: string;
  };
  empty: string;
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
