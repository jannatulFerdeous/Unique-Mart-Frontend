import type { UserRole } from "@/redux/features/user/user.types";

// Who sees which part of the dashboard. Everyone who signs in gets their own
// account pages (/account/...); the store-management pages (/admin/...) depend
// on the role.
//
// The backend can't store per-person permissions yet, so moderators share one
// list: edit MODERATOR_SECTIONS to change what every moderator can open.
//
// This only shapes what the dashboard shows. The backend doesn't check who is
// calling yet, so it is not a security boundary.

export const ACCOUNT_HOME = "/account/profile";
export const ADMIN_HOME = "/admin";

export const MODERATOR_SECTIONS = [
  "/admin/hero-banners",
  "/admin/products",
  "/admin/brands",
  "/admin/main-categories",
  "/admin/categories",
  "/admin/sub-categories",
  "/admin/attribute-groups",
  "/admin/attributes",
];

export const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  moderator: "Moderator",
  customer: "Customer",
};

const STAFF: readonly string[] = ["super_admin", "admin", "moderator"];

export const isStaff = (role?: string) => Boolean(role && STAFF.includes(role));

const within = (pathname: string, section: string) =>
  pathname === section || pathname.startsWith(`${section}/`);

// Whether this role may open this page (or nav link).
export const canOpen = (role: string | undefined, pathname: string): boolean => {
  if (within(pathname, "/account")) return true;
  if (!within(pathname, "/admin")) return true;
  if (role === "super_admin" || role === "admin") return true;
  if (role === "moderator") return MODERATOR_SECTIONS.some((section) => within(pathname, section));
  return false;
};

// Where a signed-in person lands when they open the dashboard.
export const homeFor = (role?: string) =>
  role === "super_admin" || role === "admin"
    ? ADMIN_HOME
    : role === "moderator"
      ? (MODERATOR_SECTIONS[0] ?? ACCOUNT_HOME)
      : ACCOUNT_HOME;
