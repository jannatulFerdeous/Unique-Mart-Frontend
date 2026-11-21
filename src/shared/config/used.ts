// Used (second-hand) items can't be ordered online: shoppers call or WhatsApp
// the shop instead. A product counts as used when it sits under the
// "2nd Hand Product" menu or its name is marked "(Used)".
export const USED_MAIN_CATEGORY = "2nd-hand-product";

export const isUsedProduct = (name: string, mainCategorySlug?: string) =>
  mainCategorySlug === USED_MAIN_CATEGORY || /\(used\)/i.test(name);
