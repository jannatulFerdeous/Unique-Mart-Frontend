"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import {
  useCreateBannerMutation,
  useGetBannerQuery,
  useGetBannersQuery,
  useUpdateBannerMutation,
} from "@/redux/features/banner/bannerApi";
import type { Banner, UpdateBannerArgs } from "@/redux/features/banner/banner.types";
import { clearNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  HERO_ACCEPT,
  HERO_MAX_ACTIVE,
  HREF_HINT,
  HREF_MAX,
  SIZE_HINT,
  TITLE_MAX,
  checkImage,
  checkTitle,
  isSafeHref,
} from "@/shared/libs/hero/types";
import { Button, ButtonLink } from "../components/Button";
import { Field, Input } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";

const LIST_HREF = "/admin/hero-banners";

type Errors = { image?: string; title?: string; href?: string; submit?: string };

// `id` given → edit that banner; no `id` → add a new one.
export function HeroBannerFormScreen({ id }: { id?: string }) {
  const dispatch = useAppDispatch();
  const editing = id !== undefined;

  const list = useGetBannersQuery();
  const single = useGetBannerQuery(id ?? "", { skip: !editing });

  // Opening a form starts a fresh visit; drop any old list message.
  useEffect(() => {
    dispatch(clearNotice());
  }, [dispatch]);

  const banners = list.data ?? [];
  const activeCount = banners.filter((banner) => banner.status === "active").length;
  const nextOrder = banners.reduce((max, banner) => Math.max(max, banner.sortOrder + 1), 0);

  const loading = list.isLoading || (editing && single.isLoading);
  const failed = editing ? single.isError : list.isError;

  return (
    <>
      <ScreenHeader
        title={editing ? "Edit banner" : "Add banner"}
        blurb={
          editing
            ? "Change the image, title, link or visibility of this homepage slide."
            : "New banners are added at the end of the homepage slider."
        }
        actions={
          <ButtonLink href={LIST_HREF}>
            <ArrowLeft className="size-4" aria-hidden />
            All banners
          </ButtonLink>
        }
      />

      {loading ? (
        <Panel>
          <EmptyState title="Loading…" />
        </Panel>
      ) : failed ? (
        <Panel>
          <EmptyState
            title={editing ? "Couldn't load this banner" : "Couldn't reach the server"}
            body={apiErrorMessage(editing ? single.error : list.error)}
            action={
              <Button onClick={() => (editing ? single.refetch() : list.refetch())}>Try again</Button>
            }
          />
        </Panel>
      ) : (
        <BannerForm
          key={single.data?._id ?? "new"}
          banner={editing ? single.data : undefined}
          nextOrder={nextOrder}
          activeCount={activeCount}
        />
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

function BannerForm({
  banner,
  nextOrder,
  activeCount,
}: {
  banner?: Banner;
  nextOrder: number;
  activeCount: number;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [create, { isLoading: creating }] = useCreateBannerMutation();
  const [update, { isLoading: updating }] = useUpdateBannerMutation();

  const wasLive = banner?.status === "active";
  const canShow = wasLive || activeCount < HERO_MAX_ACTIVE;

  const [image, pickImage] = usePicked();
  const [title, setTitle] = useState(banner?.title ?? "");
  const [href, setHref] = useState(banner?.link ?? "");
  const [live, setLive] = useState(banner ? wasLive : canShow);
  const [errors, setErrors] = useState<Errors>({});

  const saving = creating || updating;
  const preview = image?.url ?? banner?.image.url;

  const choose = (file: File | null) => {
    const problem = file ? checkImage(file) : null;
    setErrors((current) => ({ ...current, image: problem ?? undefined }));
    pickImage(problem ? null : file);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextTitle = title.trim();
    const link = href.trim();
    const next: Errors = {
      image: banner || image ? undefined : "Choose the banner image.",
      title: checkTitle(nextTitle) ?? undefined,
      href: isSafeHref(link) ? undefined : HREF_HINT,
    };
    setErrors(next);
    if (next.image || next.title || next.href) return;

    const status = live ? "active" : "inactive";

    try {
      if (banner) {
        const changes: UpdateBannerArgs["changes"] = {};
        if (nextTitle !== banner.title) changes.title = nextTitle;
        if (link !== banner.link) changes.link = link;
        if (status !== banner.status) changes.status = status;
        if (image) changes.image = image.file;

        if (Object.keys(changes).length > 0) await update({ banner, changes }).unwrap();
        dispatch(showNotice({ scope: "banners", tone: "good", text: `"${nextTitle}" saved.` }));
      } else if (image) {
        await create({
          title: nextTitle,
          link,
          status,
          sortOrder: nextOrder,
          image: image.file,
        }).unwrap();
        dispatch(showNotice({ scope: "banners", tone: "good", text: `"${nextTitle}" added.` }));
      }
      router.push(LIST_HREF);
    } catch (problem) {
      setErrors({ submit: apiErrorMessage(problem) });
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <Panel>
        <fieldset disabled={saving} className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <legend className="sr-only">{banner ? "Edit banner" : "New banner"}</legend>

          <Field
            label="Banner image"
            hint={banner ? `${SIZE_HINT} Choose a file only to replace the current image.` : SIZE_HINT}
            error={errors.image}
          >
            <span className="mb-2 block aspect-64/19 w-full overflow-hidden rounded-control border border-dashed border-line-strong bg-surface-muted">
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-full w-full object-cover" />
              )}
            </span>
            <input
              type="file"
              accept={HERO_ACCEPT}
              onChange={(event) => choose(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-muted file:mr-3 file:cursor-pointer file:rounded-control file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-surface-muted"
            />
          </Field>

          <div className="flex min-w-0 flex-col gap-4">
            <Field
              label="Title"
              hint="Describes the banner to search engines and screen readers."
              error={errors.title}
            >
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="iPhone 17 Pro Max, now in stock"
                maxLength={TITLE_MAX}
              />
            </Field>

            <Field label="Link" hint={HREF_HINT} error={errors.href}>
              <Input
                value={href}
                onChange={(event) => setHref(event.target.value)}
                placeholder="/category/iphone"
                maxLength={HREF_MAX}
              />
            </Field>

            <div>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={live}
                  disabled={!canShow}
                  onChange={(event) => setLive(event.target.checked)}
                  className="size-4 accent-tertiary"
                />
                Show on homepage
              </label>
              {!canShow && (
                <p className="mt-1 text-xs text-ink-subtle">
                  {HERO_MAX_ACTIVE} banners are already live. It will be saved as hidden; hide
                  another banner to make room.
                </p>
              )}
            </div>

            {errors.submit && (
              <p role="alert" className="text-sm font-medium text-danger">
                {errors.submit}
              </p>
            )}

            <div className="mt-auto flex flex-wrap justify-end gap-2 pt-2">
              <ButtonLink href={LIST_HREF}>Cancel</ButtonLink>
              <Button type="submit" variant="primary">
                {saving ? (image ? "Uploading…" : "Saving…") : banner ? "Save changes" : "Add banner"}
              </Button>
            </div>
          </div>
        </fieldset>
      </Panel>
    </form>
  );
}
