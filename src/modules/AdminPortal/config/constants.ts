import { DEMO_PASSCODE } from "@/shared/libs/admin/access";
import type { AdminData } from "./types";

export const admin_data: AdminData = {
  gate: {
    eyebrow: "Unique Mart",
    title: "Admin portal",
    body: "Manage the catalogue, orders, payments, reviews and customers.",

    warning:
      "This is a demo gate, not security. The passcode is in the page's own JavaScript, and everything below is demo data held in memory — a reload starts it over. Do not put real customer data behind it.",
    nameLabel: "Your name",
    namePlaceholder: "Store owner",
    codeLabel: "Passcode",
    codePlaceholder: "••••••••",

    hint: "Passcode",
    passcode: DEMO_PASSCODE,
    submit: "Open the portal",
    wrong: "That passcode does not match.",
    back: "Back to the shop",
  },

  shell: {
    brand: "Unique Mart",
    subtitle: "Admin portal",
    viewSite: "View shop",
    signOut: "Sign out",
    menu: "Menu",
    closeMenu: "Close menu",
    signedInAs: "Signed in as",
  },

  nav: [
    {
      title: "Overview",
      items: [
        {
          href: "/admin",
          label: "Dashboard",
          icon: "dashboard",
          exact: true,
          blurb: "Revenue, orders and what needs attention today.",
        },
      ],
    },
    {
      title: "Storefront",
      items: [
        {
          href: "/admin/hero-banners",
          label: "Hero Banners",
          icon: "banners",
          blurb:
            "The slides across the top of the homepage, and where each one links.",
        },
      ],
    },
    {
      title: "Store",
      items: [
        {
          href: "/admin/settings",
          label: "Settings",
          icon: "settings",
          blurb: "Delivery charges, payment methods and contact details.",
        },
      ],
    },
  ],

  orderStatus: {
    pending: { label: "Pending", tone: "flow-1" },
    confirmed: { label: "Confirmed", tone: "flow-2" },
    packed: { label: "Packed", tone: "flow-3" },
    shipped: { label: "Shipped", tone: "flow-4" },
    delivered: { label: "Delivered", tone: "flow-5" },
    cancelled: { label: "Cancelled", tone: "critical" },
    refunded: { label: "Refunded", tone: "warning" },
  },

  paymentStatus: {
    unpaid: { label: "Unpaid", tone: "neutral" },
    pending: { label: "Pending", tone: "warning" },
    paid: { label: "Paid", tone: "good" },
    failed: { label: "Failed", tone: "critical" },
    refunded: { label: "Refunded", tone: "serious" },
  },

  productStatus: {
    live: { label: "Live", tone: "good" },
    draft: { label: "Draft", tone: "neutral" },
    archived: { label: "Archived", tone: "serious" },
  },

  common: {
    search: "Search",
    clear: "Clear",
    all: "All",
    delete: "Delete",
    confirm: "Confirm",
    cancel: "Cancel",
    save: "Save changes",
    saved: "Saved",
    edit: "Edit",
    view: "View",
    close: "Close",
    selected: "{n} selected",
    noResults: "Nothing matches that.",
    rowsShown: "{shown} of {total}",
    previous: "Previous",
    next: "Next",
    page: "Page {n} of {of}",
    table: "Table",
    chart: "Chart",
  },
};

export const PAGE_SIZE = 12;

export const RANGES: { days: number; label: string }[] = [
  { days: 7, label: "Last 7 days" },
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
];
