// Brands themselves come from the admin (see `toBrandMarks`); these are their addresses.
export const brandsPath = "/brands";

export const brandHref = (slug: string) => `${brandsPath}/${slug}`;
