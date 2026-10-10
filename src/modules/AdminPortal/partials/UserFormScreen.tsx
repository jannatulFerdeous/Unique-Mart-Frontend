"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { clearNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import {
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/redux/features/user/userApi";
import {
  USER_ROLES,
  USER_STATUSES,
  type UpdateUserArgs,
  type User,
  type UserRole,
  type UserStatus,
} from "@/redux/features/user/user.types";
import { useAppDispatch } from "@/redux/hooks";
import { initials } from "@/shared/utils/initials";
import { Button, ButtonLink } from "../components/Button";
import { Field, Input, Select } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import {
  AVATAR_ACCEPT,
  NAME_MAX,
  PASSWORD_MAX,
  ROLE_LABEL,
  USERS_HREF,
  USER_STATUS_META,
  checkAvatar,
  checkEmail,
  checkName,
  checkPassword,
} from "../config/users";

type Errors = Partial<Record<"name" | "email" | "password" | "avatar" | "submit", string>>;

// `id` given → edit that user; no `id` → add a new one.
export function UserFormScreen({ id }: { id?: string }) {
  const dispatch = useAppDispatch();
  const editing = id !== undefined;
  const { data: user, isLoading, isError, error, refetch } = useGetUserQuery(id ?? "", {
    skip: !editing,
  });

  // Opening a form starts a fresh visit; drop any old list message.
  useEffect(() => {
    dispatch(clearNotice());
  }, [dispatch]);

  return (
    <>
      <ScreenHeader
        title={editing ? "Edit user" : "Add user"}
        blurb={
          editing
            ? "Change this person's details, role or whether they can sign in."
            : "Create an account for a customer or a member of staff."
        }
        actions={
          <ButtonLink href={USERS_HREF}>
            <ArrowLeft className="size-4" aria-hidden />
            All users
          </ButtonLink>
        }
      />

      {editing && isLoading ? (
        <Panel>
          <EmptyState title="Loading…" />
        </Panel>
      ) : editing && isError ? (
        <Panel>
          <EmptyState
            title="Couldn't load this user"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        </Panel>
      ) : (
        <UserForm key={user?._id ?? "new"} user={editing ? user : undefined} />
      )}
    </>
  );
}

function usePicked() {
  const [picked, setPicked] = useState<{ file: File; url: string } | null>(null);
  const current = useRef(picked);

  useEffect(() => {
    current.current = picked;
  }, [picked]);

  useEffect(
    () => () => {
      if (current.current) URL.revokeObjectURL(current.current.url);
    },
    [],
  );

  const pick = (file: File | null) => {
    setPicked((previous) => {
      if (previous) URL.revokeObjectURL(previous.url);
      return file ? { file, url: URL.createObjectURL(file) } : null;
    });
  };

  return [picked, pick] as const;
}

function UserForm({ user }: { user?: User }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [create, { isLoading: creating }] = useCreateUserMutation();
  const [update, { isLoading: updating }] = useUpdateUserMutation();

  const [avatar, pickAvatar] = usePicked();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(user?.role ?? "customer");
  const [status, setStatus] = useState<UserStatus>(user?.status ?? "active");
  const [errors, setErrors] = useState<Errors>({});

  const saving = creating || updating;
  const preview = avatar?.url ?? user?.profileImage?.url ?? null;

  const choose = (file: File | null) => {
    const problem = file ? checkAvatar(file) : null;
    setErrors((current) => ({ ...current, avatar: problem ?? undefined }));
    pickAvatar(problem ? null : file);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const fields = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role,
      status,
    };
    const next: Errors = {
      name: checkName(fields.name) ?? undefined,
      email: checkEmail(fields.email) ?? undefined,
      password: user ? undefined : (checkPassword(password) ?? undefined),
    };
    setErrors(next);
    if (next.name || next.email || next.password) return;

    try {
      if (user) {
        const changes: UpdateUserArgs["changes"] = {};
        if (fields.name !== user.name) changes.name = fields.name;
        if (fields.email !== user.email) changes.email = fields.email;
        if (fields.phone !== (user.phone ?? "")) changes.phone = fields.phone;
        if (role !== user.role) changes.role = role;
        if (status !== user.status) changes.status = status;
        if (avatar) changes.profileImage = avatar.file;

        if (Object.keys(changes).length > 0) await update({ id: user._id, changes }).unwrap();
        dispatch(showNotice({ scope: "users", tone: "good", text: `${fields.name} saved.` }));
      } else {
        await create({ ...fields, password, profileImage: avatar?.file }).unwrap();
        dispatch(showNotice({ scope: "users", tone: "good", text: `${fields.name} added.` }));
      }
      router.push(USERS_HREF);
    } catch (problem) {
      setErrors({ submit: apiErrorMessage(problem) });
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <Panel>
        <fieldset disabled={saving} className="grid min-w-0 gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <legend className="sr-only">{user ? "Edit user" : "New user"}</legend>

          <Field label="Profile photo" hint="Optional. PNG, JPG, WebP or AVIF, up to 5 MB." error={errors.avatar}>
            <span className="mb-3 grid size-28 place-items-center overflow-hidden rounded-full bg-surface-muted text-2xl font-semibold text-ink-muted">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(name) || "?"
              )}
            </span>
            <input
              type="file"
              accept={AVATAR_ACCEPT}
              onChange={(event) => choose(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-muted file:mr-3 file:cursor-pointer file:rounded-control file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-surface-muted"
            />
          </Field>

          <div className="grid min-w-0 content-start gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="off"
                maxLength={NAME_MAX}
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="off"
              />
            </Field>

            <Field label="Phone" hint="Optional.">
              <Input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="01XXXXXXXXX"
                autoComplete="off"
              />
            </Field>

            {user ? (
              <Field label="Password" hint="Passwords can't be changed here. The user resets their own.">
                <Input value="••••••••" disabled readOnly />
              </Field>
            ) : (
              <Field label="Password" hint="At least 6 characters. Share it with the user privately." error={errors.password}>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  maxLength={PASSWORD_MAX}
                />
              </Field>
            )}

            <Field label="Role" hint="Admins and super admins can manage the store.">
              <Select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
                {USER_ROLES.map((value) => (
                  <option key={value} value={value}>
                    {ROLE_LABEL[value]}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Status" hint="Blocked and deleted users can't sign in.">
              <Select value={status} onChange={(event) => setStatus(event.target.value as UserStatus)}>
                {USER_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {USER_STATUS_META[value].label}
                  </option>
                ))}
              </Select>
            </Field>

            {errors.submit && (
              <p role="alert" className="text-sm font-medium text-danger sm:col-span-2">
                {errors.submit}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-2 pt-2 sm:col-span-2">
              <ButtonLink href={USERS_HREF}>Cancel</ButtonLink>
              <Button type="submit" variant="primary">
                {saving ? "Saving…" : user ? "Save changes" : "Add user"}
              </Button>
            </div>
          </div>
        </fieldset>
      </Panel>
    </form>
  );
}
