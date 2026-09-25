export type CartData = {
  /** Breadcrumb leaf and page heading. */
  crumbHome: string;
  crumbCart: string;
  title: string;

  selectAll: string;
  /** `{n}` is the number of lines ticked. */
  selectedCount: string;
  color: string;
  remove: string;
  removeOne: string;
  decrease: string;
  increase: string;
  quantity: string;
  each: string;

  summary: string;
  subtotal: string;
  delivery: string;
  deliveryFree: string;
  deliveryNote: string;
  total: string;
  checkout: string;
  /** Shown when every line is unticked — there is nothing to check out. */
  nothingSelected: string;

  emptyTitle: string;
  emptyBody: string;
  emptyAction: string;

  /** Says where the basket actually lives, the way the review form does. */
  storageNote: string;
  clear: string;
  clearConfirm: string;
};
