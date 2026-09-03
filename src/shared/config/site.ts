export const site = {
  name: "Unique Mart",
  descriptor: "Find the best tech",
  tagline: "Gadgets, accessories and everyday tech.",
  since: "2025",
  url: "https://uniquemart.com",
  locale: "en",
  searchPath: "/search",
  newsletterPath: "/newsletter",
  phone: "09612-345678",
  email: "support@uniquemart.com",
} as const;

export const telHref = `tel:${site.phone}`;
export const mailHref = `mailto:${site.email}`;
