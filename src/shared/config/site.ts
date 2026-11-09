export const site = {
  name: "Unique & Smart",
  descriptor: "Find the best tech",
  tagline: "Gadgets, accessories and everyday tech.",
  since: "2026",
  url: "https://www.uniquesmartbd.com",
  locale: "en",
  searchPath: "/search",
  newsletterPath: "/newsletter",
  // Shown in the local form (it has to fit the footer's call button); dialled
  // in the international one so it also works from abroad.
  phone: "01770-067000",
  phoneIntl: "+8801770067000",
  email: "uniquesmartbd@gmail.com",
  address: "Kazim Uddin Market, Gangachara Bazar, Gangachara, Rangpur",
  mapUrl: "https://maps.app.goo.gl/6TYVE1ih2m7W2Mds6",
  hours: "Every day, 10am to 9pm",
} as const;

export const telHref = `tel:${site.phoneIntl}`;
export const mailHref = `mailto:${site.email}`;
