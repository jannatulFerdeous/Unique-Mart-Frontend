import type { AdminData } from "./types";

export const admin_data: AdminData = {
  gate: {
    loading: "Opening your dashboard…",
    signInTitle: "Sign in to your dashboard",
    signInBody: "Your orders, addresses and account details, and for staff the store management tools, are all here once you sign in.",
    signIn: "Sign in",
    noAccessTitle: "This page isn't part of your dashboard",
    noAccessBody: "Your account doesn't include this section. Ask an admin if you need it.",
    goHome: "Go to my dashboard",
    back: "Back to the shop",
  },

  shell: {
    brand: "Unique Mart",
    subtitle: "Dashboard",
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
          blurb: "Your store at a glance, and what needs attention today.",
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
      title: "Catalog",
      items: [
        {
          href: "/admin/products",
          label: "Products",
          icon: "products",
          blurb: "Everything for sale: prices, stock, specs, variants and photos.",
        },
        {
          href: "/admin/brands",
          label: "Brands",
          icon: "brands",
          blurb: "Who makes what you sell.",
        },
        {
          href: "/admin/main-categories",
          label: "Main categories",
          icon: "mainCategories",
          blurb: "The top level of the shop, like Electronics or Fashion.",
        },
        {
          href: "/admin/categories",
          label: "Categories",
          icon: "categories",
          blurb: "Aisles inside a main category, like Phones or Watches.",
        },
        {
          href: "/admin/sub-categories",
          label: "Sub-categories",
          icon: "subCategories",
          blurb: "Shelves inside a category, like iPhone inside Phones.",
        },
      ],
    },
    {
      title: "Specs",
      items: [
        {
          href: "/admin/attribute-groups",
          label: "Attribute groups",
          icon: "attributeGroups",
          blurb: "Headings that specs are listed under, like Display or Battery.",
        },
        {
          href: "/admin/attributes",
          label: "Attributes",
          icon: "attributes",
          blurb: "The specs a product can have, like Colour or Storage, and their choices.",
        },
      ],
    },
    {
      title: "Sales",
      items: [
        {
          href: "/admin/orders",
          label: "Orders",
          icon: "orderStatus",
          blurb: "Every customer's order. Open one to move it along, from confirmed to delivered, or cancel it.",
        },
        {
          href: "/admin/payments",
          label: "Payments",
          icon: "payments",
          blurb: "Every payment, online and cash on delivery, with what's been paid, is waiting or was refunded.",
        },
        {
          href: "/admin/refunds",
          label: "Refunds",
          icon: "refunds",
          blurb: "Give money back on a paid order through SSLCommerz, and follow each refund until it lands.",
        },
      ],
    },
    {
      title: "Marketing",
      items: [
        {
          href: "/admin/coupons",
          label: "Coupons",
          icon: "coupons",
          blurb: "Discount codes: how much they take off, what they apply to and when they run.",
        },
        {
          href: "/admin/newsletter",
          label: "Newsletter",
          icon: "newsletter",
          blurb: "Who signed up for the newsletter. Download the list for your mailing tool.",
        },
      ],
    },
    {
      title: "People",
      items: [
        {
          href: "/admin/users",
          label: "Users",
          icon: "users",
          blurb: "Customers and staff accounts, their roles and whether they can sign in.",
        },
        {
          href: "/admin/reviews",
          label: "Reviews",
          icon: "reviews",
          blurb: "Product reviews from shoppers. Nothing shows on the shop until you publish it.",
        },
        {
          href: "/admin/reports",
          label: "Support requests",
          icon: "support",
          blurb: "Problems customers have reported from their account, and where each one is up to.",
        },
      ],
    },
    {
      title: "My account",
      items: [
        { href: "/account/profile", label: "Account Info", icon: "profile", blurb: "Your name, phone number and photo." },
        { href: "/account/orders", label: "My Orders", icon: "orders", blurb: "Everything you've ordered and where it is." },
        { href: "/account/reviews", label: "My Reviews", icon: "reviews", blurb: "Reviews you've written for products." },
        { href: "/account/addresses", label: "Manage Address", icon: "addresses", blurb: "Where your orders are delivered." },
        { href: "/account/support", label: "Support", icon: "support", blurb: "Tell us about a problem and follow our reply." },
        { href: "/account/rewards", label: "Reward Points", icon: "rewards", blurb: "Points you've earned on purchases." },
        { href: "/account/faq", label: "FAQ", icon: "faq", blurb: "Answers to common questions about ordering and delivery." },
      ],
    },
    {
      title: "Store",
      items: [
        {
          href: "/admin/settings",
          label: "Settings",
          icon: "settings",
          blurb: "How your store is set up right now: contact details, delivery, payments and who can open what.",
        },
      ],
    },
  ],

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
