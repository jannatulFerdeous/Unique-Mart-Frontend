import type { AppDispatch } from "@/redux/store";
import { userApi } from "@/redux/features/user/userApi";
import { USER_ROLES, type User, type UserListParams, type UserRole } from "@/redux/features/user/user.types";
import { downloadSheet, fetchAllPages, fileDate, type SheetColumn, type SheetRow } from "@/shared/libs/admin/excel";
import type { Importer, PlannedRow } from "../../components/ExcelActions";
import { ROLE_LABEL } from "../access";

const PAGE = 100;

const fetchAllUsers = (dispatch: AppDispatch, filters: Omit<UserListParams, "page" | "limit"> = {}) =>
  fetchAllPages(
    async (page) =>
      (
        await dispatch(
          userApi.endpoints.getUsers.initiate({ ...filters, page, limit: PAGE }, { subscribe: false, forceRefetch: true }),
        ).unwrap()
      ).users,
    PAGE,
  );

const STATUS_LABEL: Record<User["status"], string> = { active: "Active", blocked: "Blocked", deleted: "Deleted" };

const COLUMNS: SheetColumn<User>[] = [
  { header: "Name", width: 24, value: (each) => each.name },
  { header: "Email", width: 30, value: (each) => each.email },
  { header: "Phone", width: 16, value: (each) => each.phone ?? "" },
  { header: "Role", width: 13, value: (each) => ROLE_LABEL[each.role] },
  { header: "Status", width: 10, value: (each) => STATUS_LABEL[each.status] },
  { header: "Joined", width: 18, value: (each) => new Date(each.createdAt).toLocaleString("en-GB") },
];

export async function downloadUsers(dispatch: AppDispatch, filters: Omit<UserListParams, "page" | "limit">) {
  const users = await fetchAllUsers(dispatch, filters);
  await downloadSheet(`users-${fileDate()}.xlsx`, "Users", COLUMNS, users);
}

// "Admin", "admin" or "Super admin" → the role.
const toRole = (text: string): UserRole | null =>
  USER_ROLES.find((role) => role === text.toLowerCase().replace(/\s+/g, "_") || ROLE_LABEL[role].toLowerCase() === text.toLowerCase()) ??
  null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Upload: new accounts, one per row. An email that already has an account is skipped.
export const userImporter = (dispatch: AppDispatch): Importer => ({
  noun: "users",
  help:
    "Add many accounts at once. Each row needs “Name”, “Email” and “Password” (6+ characters); “Phone” and “Role” (Customer, Moderator, Admin, Super admin) are optional, Customer by default. Emails that already have an account are skipped.",
  template: () =>
    downloadSheet(`users-template.xlsx`, "Users", [
      { header: "Name", width: 24, value: () => "Rahim Uddin" },
      { header: "Email", width: 30, value: () => "rahim@example.com" },
      { header: "Phone", width: 16, value: () => "01700000000" },
      { header: "Role", width: 13, value: () => "Customer" },
      { header: "Password", width: 16, value: () => "ChangeMe#123" },
    ], [null]),
  plan: async (rows: SheetRow[]) => {
    const existing = new Set((await fetchAllUsers(dispatch)).map((user) => user.email.toLowerCase()));
    const inSheet = new Set<string>();

    return rows.map(({ row, cells }): PlannedRow => {
      const name = cells["Name"] ?? "";
      const email = (cells["Email"] ?? "").toLowerCase();
      const password = cells["Password"] ?? "";
      const label = email || name || "(no email)";
      const role = cells["Role"] ? toRole(cells["Role"]) : "customer";

      if (name.length < 2) return { row, label, action: "skip", error: "Name needs at least 2 characters." };
      if (!EMAIL.test(email)) return { row, label, action: "skip", error: "That isn't an email address." };
      if (existing.has(email)) return { row, label, action: "skip", detail: "Already has an account" };
      if (inSheet.has(email)) return { row, label, action: "skip", error: "This email is in the sheet twice." };
      if (password.length < 6) return { row, label, action: "skip", error: "Password needs at least 6 characters." };
      if (!role) return { row, label, action: "skip", error: `“${cells["Role"]}” isn't a role.` };
      inSheet.add(email);

      return {
        row,
        label,
        action: "create",
        detail: `${name} · ${ROLE_LABEL[role]}`,
        apply: () =>
          dispatch(
            userApi.endpoints.createUser.initiate({ name, email, phone: cells["Phone"] ?? "", role, status: "active", password }),
          ).unwrap(),
      };
    });
  },
});
