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
  phone: "01355-539041",
  phoneIntl: "+8801355539041",
  email: "uniquesmartbd@gmail.com",
  address: "Kazim Uddin Market, Gangachara Bazar, Gangachara, Rangpur",
  mapUrl: "https://maps.app.goo.gl/6TYVE1ih2m7W2Mds6",
  hours: "Every day, 10am to 9pm",
} as const;

export const telHref = `tel:${site.phoneIntl}`;
export const mailHref = `mailto:${site.email}`;

// WhatsApp chat on the same number, with an optional message already typed in.
export const whatsappHref = (message?: string) =>
  `https://wa.me/${site.phoneIntl.replace(/\D/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
