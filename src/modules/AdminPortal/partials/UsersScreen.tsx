"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, Pencil, Plus, Search } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { selectNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/redux/features/user/userApi";
import {
  USER_ROLES,
  type User,
  type UserRole,
  type UserStatus,
} from "@/redux/features/user/user.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatDate, formatDateTime } from "@/shared/libs/admin/format";
import { cn } from "@/shared/utils/cn";
import { initials } from "@/shared/utils/initials";
import { Button, ButtonLink } from "../components/Button";
import { ConfirmAction } from "../components/ConfirmAction";
import { FilterSelect, Input, Select } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { Table, TableScroll, Td, Th, Tr } from "../components/Table";
import {
  PROVIDER_LABEL,
  ROLE_LABEL,
  USERS_HREF,
  USERS_PAGE_SIZE,
  USER_STATUS_META,
} from "../config/users";

type StatusTab = UserStatus | "all";

const TABS: { value: StatusTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "deleted", label: "Deleted" },
];

const SEARCH_DELAY = 300;

type Report = (tone: "good" | "danger", text: string) => void;

export function UsersScreen() {
  const dispatch = useAppDispatch();
  const notice = useAppSelector(selectNotice("users"));

  const [tab, setTab] = useState<StatusTab>("active");
  const [role, setRole] = useState<UserRole | "">("");
  const [typed, setTyped] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // Wait for a pause in typing before asking the server.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchTerm(typed.trim());
      setPage(1);
    }, SEARCH_DELAY);
    return () => window.clearTimeout(timer);
  }, [typed]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetUsersQuery({
    page,
    limit: USERS_PAGE_SIZE,
    searchTerm,
    role: role || undefined,
    status: tab === "all" ? undefined : tab,
  });

  const users = data?.users ?? [];
  const meta = data?.meta;
  // A full page may mean more pages even if the reported total says otherwise.
  const hasNext = meta ? page < meta.totalPage || users.length === USERS_PAGE_SIZE : false;

  const report: Report = (tone, text) => dispatch(showNotice({ scope: "users", tone, text }));

  const filtered = searchTerm !== "" || role !== "";
  const first = (page - 1) * USERS_PAGE_SIZE + 1;

  return (
    <>
      <ScreenHeader
        title="Users"
        blurb="Customers and staff accounts, their roles and whether they can sign in."
        actions={
          <ButtonLink href={`${USERS_HREF}/new`} variant="primary">
            <Plus className="size-4" aria-hidden />
            Add user
          </ButtonLink>
        }
      />

      {notice && (
        <p
          role={notice.tone === "danger" ? "alert" : "status"}
          className={cn("text-sm font-medium", notice.tone === "good" ? "text-good" : "text-danger")}
        >
          {notice.text}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter by status"
          className="inline-flex flex-wrap gap-1 rounded-control border border-line bg-surface p-1"
        >
          {TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={tab === value}
              onClick={() => {
                setTab(value);
                setPage(1);
              }}
              className={cn(
                "rounded-control px-3 py-1.5 text-sm font-medium transition-colors",
                tab === value
                  ? "bg-inverse text-ink-inverse"
                  : "text-ink-muted hover:bg-surface-muted hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <label className="relative w-full sm:w-72">
            <span className="sr-only">Search users</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle"
              aria-hidden
            />
            <Input
              type="search"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              placeholder="Search name, email or phone"
              className="pl-9"
            />
          </label>

          <FilterSelect
            label="Role"
            value={role}
            onChange={(event) => {
              setRole(event.target.value as UserRole | "");
              setPage(1);
            }}
          >
            <option value="">All roles</option>
            {USER_ROLES.map((value) => (
              <option key={value} value={value}>
                {ROLE_LABEL[value]}
              </option>
            ))}
          </FilterSelect>
        </div>
      </div>

      <Panel bodyClassName="py-0 md:py-0">
        {isLoading ? (
          <EmptyState title="Loading users…" />
        ) : isError ? (
          <EmptyState
            title="Couldn't load users"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : users.length === 0 && page > 1 ? (
          // Blocking or deleting the last users on a page can leave it empty.
          <EmptyState
            title="Nothing left on this page"
            action={<Button onClick={() => setPage(1)}>Back to page 1</Button>}
          />
        ) : users.length === 0 ? (
          <EmptyState
            title={filtered ? "No users match" : "No users here yet"}
            body={
              filtered
                ? "Try a different name, email, phone or role."
                : "Users appear here when they sign up, or when you add one."
            }
          />
        ) : (
          <>
            <TableScroll>
              <Table className={cn("min-w-4xl transition-opacity", isFetching && "opacity-60")}>
                <caption className="sr-only">Users</caption>
                <thead>
                  <tr>
                    <Th className="min-w-64">User</Th>
                    <Th className="w-36">Phone</Th>
                    <Th className="w-44">Role</Th>
                    <Th className="w-28">Status</Th>
                    <Th className="w-28">Joined</Th>
                    <Th className="w-64">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <UserRow key={user._id} user={user} report={report} />
                  ))}
                </tbody>
              </Table>
            </TableScroll>

            <nav
              aria-label="Pages"
              className="-mx-4 flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm md:-mx-5 md:px-5"
            >
              <p className="text-ink-muted">
                Showing {first}–{first + users.length - 1}
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" disabled={page === 1 || isFetching} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="size-4" aria-hidden />
                  Previous
                </Button>
                <span className="px-1 text-ink-muted tabular-nums">Page {page}</span>
                <Button size="sm" disabled={!hasNext || isFetching} onClick={() => setPage(page + 1)}>
                  Next
                  <ChevronRight className="size-4" aria-hidden />
                </Button>
              </div>
            </nav>
          </>
        )}
      </Panel>
    </>
  );
}

function Avatar({ user }: { user: User }) {
  const url = user.profileImage?.url;

  return (
    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-muted text-xs font-semibold text-ink-muted">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(user.name) || "?"
      )}
    </span>
  );
}

function UserRow({ user, report }: { user: User; report: Report }) {
  const [update, { isLoading: updating }] = useUpdateUserMutation();
  const [remove, { isLoading: removing }] = useDeleteUserMutation();
  const busy = updating || removing;
  const status = USER_STATUS_META[user.status];
  const providers = user.authProvider.map(({ provider }) => PROVIDER_LABEL[provider]).join(", ");

  const act = async (action: () => Promise<unknown>, done: string) => {
    try {
      await action();
      report("good", done);
    } catch (problem) {
      report("danger", apiErrorMessage(problem));
    }
  };

  const setStatus = (next: UserStatus, done: string) =>
    act(() => update({ id: user._id, changes: { status: next } }).unwrap(), done);

  return (
    <Tr aria-busy={busy}>
      <Td className="max-w-80 min-w-64">
        <div className="flex items-center gap-3">
          <Avatar user={user} />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{user.name}</p>
            <p className="flex items-center gap-1 truncate text-xs text-ink-muted">
              <span className="truncate">{user.email}</span>
              {user.isEmailVerified && (
                <BadgeCheck className="size-3.5 shrink-0 text-good" aria-label="Email verified" />
              )}
            </p>
            {providers && <p className="text-xs text-ink-subtle">Signs in with {providers}</p>}
          </div>
        </div>
      </Td>
      <Td className="whitespace-nowrap text-ink-muted">{user.phone || "—"}</Td>
      <Td>
        <Select
          aria-label={`Role for ${user.name}`}
          value={user.role}
          disabled={busy}
          onChange={(event) => {
            const next = event.target.value as UserRole;
            act(
              () => update({ id: user._id, changes: { role: next } }).unwrap(),
              `${user.name} is now ${ROLE_LABEL[next]}.`,
            );
          }}
          className="min-w-36 py-1.5"
        >
          {USER_ROLES.map((value) => (
            <option key={value} value={value}>
              {ROLE_LABEL[value]}
            </option>
          ))}
        </Select>
      </Td>
      <Td>
        <StatusPill label={status.label} tone={status.tone} />
      </Td>
      <Td className="whitespace-nowrap text-ink-muted">
        <time dateTime={user.createdAt} title={formatDateTime(user.createdAt)}>
          {formatDate(user.createdAt)}
        </time>
      </Td>
      <Td>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {user.status === "active" && (
            <ConfirmAction
              label="Block"
              describe={user.name}
              onConfirm={() => setStatus("blocked", `${user.name} is blocked and can't sign in.`)}
            />
          )}
          {user.status === "blocked" && (
            <Button size="sm" disabled={busy} onClick={() => setStatus("active", `${user.name} is unblocked.`)}>
              Unblock
            </Button>
          )}
          {user.status === "deleted" ? (
            <Button size="sm" disabled={busy} onClick={() => setStatus("active", `${user.name} is restored.`)}>
              Restore
            </Button>
          ) : (
            <ConfirmAction
              label="Delete"
              describe={user.name}
              onConfirm={() => act(() => remove(user._id).unwrap(), `${user.name} is deleted.`)}
            />
          )}
          <ButtonLink href={`${USERS_HREF}/${user._id}/edit`} size="sm" aria-label={`Edit ${user.name}`}>
            <Pencil className="size-3.5" aria-hidden />
            Edit
          </ButtonLink>
        </div>
      </Td>
    </Tr>
  );
}
