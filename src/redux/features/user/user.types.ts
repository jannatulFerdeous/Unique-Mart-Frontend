import type { ApiMeta } from "../../api/types";

// Mirror the backend enums in `user.constant.ts`.
export const USER_ROLES = ["super_admin", "admin", "moderator", "customer"] as const;
export const USER_STATUSES = ["active", "blocked", "deleted"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];
export type AuthProviderName = "credentials" | "google" | "apple";

// Mirrors the backend User document (password is never returned).
export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profileImage: { url: string | null; publicId: string | null } | null;
  phone: string | null;
  isEmailVerified: boolean;
  authProvider: { provider: AuthProviderName; providerId: string }[];
  createdAt: string;
  updatedAt: string;
};

export type UserListParams = {
  page: number;
  limit: number;
  searchTerm?: string;
  role?: UserRole;
  status?: UserStatus;
};

export type UserList = { users: User[]; meta: ApiMeta };

export type UserFields = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
};

export type CreateUserArgs = UserFields & { password: string; profileImage?: File };

export type UpdateUserArgs = {
  id: string;
  changes: Partial<UserFields> & { profileImage?: File };
};
