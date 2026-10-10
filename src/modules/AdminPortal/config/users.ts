import type { AuthProviderName, UserRole, UserStatus } from "@/redux/features/user/user.types";
import type { Tone } from "./types";

export const USERS_HREF = "/admin/users";

export const USERS_PAGE_SIZE = 10;

export const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  moderator: "Moderator",
  customer: "Customer",
};

export const USER_STATUS_META: Record<UserStatus, { label: string; tone: Tone }> = {
  active: { label: "Active", tone: "good" },
  blocked: { label: "Blocked", tone: "serious" },
  deleted: { label: "Deleted", tone: "neutral" },
};

export const PROVIDER_LABEL: Record<AuthProviderName, string> = {
  credentials: "Email",
  google: "Google",
  apple: "Apple",
};

// Same limits the backend validator enforces (user.validation.ts).
export const NAME_MIN = 2;
export const NAME_MAX = 50;
export const PASSWORD_MIN = 6;
export const PASSWORD_MAX = 100;
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_ACCEPT = "image/png,image/jpeg,image/webp,image/avif";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const checkName = (value: string): string | null =>
  value.length < NAME_MIN || value.length > NAME_MAX
    ? `Name must be ${NAME_MIN}–${NAME_MAX} characters.`
    : null;

export const checkEmail = (value: string): string | null =>
  EMAIL.test(value) ? null : "Enter a valid email address, like name@example.com.";

export const checkPassword = (value: string): string | null =>
  value.length < PASSWORD_MIN || value.length > PASSWORD_MAX
    ? `Password must be ${PASSWORD_MIN}–${PASSWORD_MAX} characters.`
    : null;

export const checkAvatar = (file: File): string | null => {
  if (!AVATAR_ACCEPT.split(",").includes(file.type)) return "Choose a PNG, JPG, WebP or AVIF image.";
  if (file.size > AVATAR_MAX_BYTES) return "That image is over 5 MB. Choose a smaller one.";
  return null;
};
