"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Clock } from "lucide-react";
import { FaqAccordion } from "@/common/components/FaqAccordion";
import { apiErrorMessage } from "@/redux/api/errors";
import { useGetUserQuery, useUpdateUserMutation } from "@/redux/features/user/userApi";
import type { UpdateUserArgs, User } from "@/redux/features/user/user.types";
import { faqGroups } from "@/shared/config/faq";
import { useSession } from "@/shared/libs/session";
import { cn } from "@/shared/utils/cn";
import { initials } from "@/shared/utils/initials";
import { Button, ButtonLink } from "../components/Button";
import { Field, Input } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { ROLE_LABEL } from "../config/access";
import { admin_data } from "../config/constants";
import { AVATAR_ACCEPT, NAME_MAX, checkAvatar, checkName } from "../config/users";

const blurb = (href: string) =>
  admin_data.nav.flatMap((group) => group.items).find((item) => item.href === href)?.blurb;

// ---------------------------------------------------------------------------
// Account Info

export function ProfileScreen() {
  const { user: session } = useSession();
  const { data: user, isLoading, isError, error, refetch } = useGetUserQuery(session?.id ?? "", {
    skip: !session?.id,
  });

  return (
    <>
      <ScreenHeader title="Account Info" blurb={blurb("/account/profile")} />
      {!session?.id ? (
        <Panel>
          <EmptyState
            title="Sign in again to see your details"
            body="This browser remembers your name but not your account. Signing in again links them."
            action={<ButtonLink href="/auth/login" variant="primary">Sign in</ButtonLink>}
          />
        </Panel>
      ) : isLoading ? (
        <Panel>
          <EmptyState title="Loading…" />
        </Panel>
      ) : isError || !user ? (
        <Panel>
          <EmptyState
            title="Couldn't load your details"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        </Panel>
      ) : (
        <ProfileForm key={user.updatedAt} user={user} />
      )}
    </>
  );
}

function ProfileForm({ user }: { user: User }) {
  const { user: session, signIn } = useSession();
  const [update, { isLoading: saving }] = useUpdateUserMutation();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);
  const [errors, setErrors] = useState<{ name?: string; photo?: string; submit?: string }>({});
  const [saved, setSaved] = useState(false);
  const picked = useRef(photo);

  useEffect(() => {
    picked.current = photo;
  }, [photo]);

  useEffect(
    () => () => {
      if (picked.current) URL.revokeObjectURL(picked.current.url);
    },
    [],
  );

  const preview = photo?.url ?? user.profileImage?.url ?? null;

  const choose = (file: File | null) => {
    const problem = file ? checkAvatar(file) : null;
    setErrors((current) => ({ ...current, photo: problem ?? undefined }));
    setPhoto((previous) => {
      if (previous) URL.revokeObjectURL(previous.url);
      return file && !problem ? { file, url: URL.createObjectURL(file) } : null;
    });
    setSaved(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    const problem = checkName(trimmed);
    setErrors({ name: problem ?? undefined, photo: errors.photo });
    if (problem || errors.photo) return;

    const changes: UpdateUserArgs["changes"] = {};
    if (trimmed !== user.name) changes.name = trimmed;
    if (phone.trim() !== (user.phone ?? "")) changes.phone = phone.trim();
    if (photo) changes.profileImage = photo.file;
    if (!Object.keys(changes).length) {
      setSaved(true);
      return;
    }

    try {
      const updated = await update({ id: user._id, changes }).unwrap();
      // Keep the header greeting in step with the new name and phone.
      if (session) signIn({ ...session, name: updated.name, phone: updated.phone ?? undefined });
      setSaved(true);
    } catch (problem) {
      setErrors({ submit: apiErrorMessage(problem) });
    }
  };

  return (
    <form onSubmit={submit} noValidate className="max-w-3xl">
      <Panel>
        <div className="flex items-center gap-4 border-b border-line pb-5">
          <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-muted text-lg font-bold text-ink-muted">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="size-full object-cover" />
            ) : (
              initials(user.name) || "?"
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-sans text-h5 font-bold text-ink">Hello {user.name}</p>
            <p className="text-sm text-ink-muted">{ROLE_LABEL[user.role]} · {user.email}</p>
          </div>
        </div>

        <fieldset disabled={saving} className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
          <legend className="sr-only">Your details</legend>
          <Field label="Name" error={errors.name}>
            <Input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSaved(false);
              }}
              maxLength={NAME_MAX}
              autoComplete="name"
            />
          </Field>
          <Field label="Phone" hint="Optional.">
            <Input
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setSaved(false);
              }}
              autoComplete="tel"
            />
          </Field>
          <Field label="Email" hint="Your email is how you sign in, so it can't be changed here.">
            <Input value={user.email} readOnly className="bg-surface-muted text-ink-muted" />
          </Field>
          <Field label="Photo (optional)" hint="PNG, JPG, WebP or AVIF, up to 5 MB." error={errors.photo}>
            <input
              type="file"
              accept={AVATAR_ACCEPT}
              onChange={(event) => choose(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-muted file:mr-3 file:cursor-pointer file:rounded-control file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-surface-muted"
            />
          </Field>
        </fieldset>
      </Panel>

      {errors.submit && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {errors.submit}
        </p>
      )}

      <div className="mt-5 flex items-center justify-end gap-3">
        {saved && (
          <p role="status" className="text-sm font-medium text-good">
            Saved.
          </p>
        )}
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Sections the backend has no module for yet

const UNAVAILABLE: Record<string, { title: string; body: string }> = {
  "/account/rewards": {
    title: "Reward Points",
    body: "Points you earn on purchases will show here once the store starts a rewards programme.",
  },
};

export function UnavailableScreen({ href }: { href: keyof typeof UNAVAILABLE | string }) {
  const page = UNAVAILABLE[href];
  return (
    <>
      <ScreenHeader title={page?.title ?? "Coming soon"} blurb={blurb(href)} />
      <Panel>
        <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-surface-muted">
            <Clock className="size-5 text-ink-subtle" aria-hidden />
          </span>
          <p className="mt-1 font-sans font-bold text-ink">Not available yet</p>
          <p className="max-w-md text-sm text-ink-muted">{page?.body}</p>
          <ButtonLink href="/" className="mt-2">
            Continue shopping
          </ButtonLink>
        </div>
      </Panel>
    </>
  );
}

// ---------------------------------------------------------------------------
// FAQ

export function AccountFaqScreen() {
  const [group, setGroup] = useState(faqGroups[0]?.id ?? "");
  const shown = faqGroups.find((each) => each.id === group) ?? faqGroups[0];

  return (
    <>
      <ScreenHeader title="FAQ" blurb={blurb("/account/faq")} />
      <div role="group" aria-label="Topics" className="flex flex-wrap gap-2">
        {faqGroups.map((each) => (
          <button
            key={each.id}
            type="button"
            aria-pressed={each.id === shown?.id}
            onClick={() => setGroup(each.id)}
            className={cn(
              "rounded-control border px-3 py-1.5 text-sm transition-colors",
              each.id === shown?.id
                ? "border-tertiary bg-tertiary-soft font-medium text-tertiary"
                : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink",
            )}
          >
            {each.title}
          </button>
        ))}
      </div>
      {shown && (
        <Panel bodyClassName="py-2 md:py-2">
          <FaqAccordion items={shown.items} className="border-t-0" />
        </Panel>
      )}
    </>
  );
}
