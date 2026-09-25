"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus } from "lucide-react";
import {
  addHeroSlide,
  checkImage,
  deleteHeroSlide,
  listHeroSlides,
  reorderHeroSlides,
  resetHeroSlides,
  updateHeroSlide,
} from "@/shared/libs/admin/hero";
import { needsPasscode, rememberPublishCode } from "@/shared/libs/admin/api";
import {
  HERO_ACCEPT,
  HERO_SIZES,
  heroImageUrl,
  isSafeHref,
  type HeroImageSlot,
  type HeroUploadSlide,
} from "@/shared/libs/hero/types";
import { cn } from "@/shared/utils/cn";
import { Button, ButtonLink, buttonClass } from "../components/Button";
import { ConfirmAction } from "../components/ConfirmAction";
import { Field, Input } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { PasscodePanel } from "../components/PasscodePanel";

/* The homepage hero, managed from the portal.
 *
 * The one screen whose edits are not demo data: slides are saved on the server
 * and every change is live for every visitor the moment it succeeds. So there is
 * no draft state and no "save all" — each action is its own request, and the
 * list on screen is always the list the server answered with. */

type Run = (action: () => Promise<HeroUploadSlide[]>, done: string) => Promise<boolean>;

const HREF_HINT = "A page on this site, like /category/iphone, or a full https:// address.";

const sizeHint = (slot: HeroImageSlot) =>
  `${HERO_SIZES[slot].width} × ${HERO_SIZES[slot].height} px. PNG, JPG, WebP or AVIF, up to 5 MB.`;

const formWith = (fields: Record<string, string | File>): FormData => {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  return form;
};

export function HeroBannersScreen() {
  const [slides, setSlides] = useState<HeroUploadSlide[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [askCode, setAskCode] = useState(false);

  useEffect(() => {
    listHeroSlides()
      .then(setSlides)
      .catch((reason: unknown) => {
        setSlides([]);
        setError(reason instanceof Error ? reason.message : "Could not load the slides.");
      });
  }, []);

  const run: Run = async (action, message) => {
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      setSlides(await action());
      setDone(message);
      return true;
    } catch (reason) {
      if (needsPasscode(reason)) setAskCode(true);
      setError(reason instanceof Error ? reason.message : "That did not work. Try again.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const move = (from: number, to: number) => {
    if (!slides) return;
    const order = slides.map((slide) => slide.id);
    [order[from], order[to]] = [order[to], order[from]];
    void run(() => reorderHeroSlides(order), "Order saved.");
  };

  return (
    <>
      <ScreenHeader
        title="Hero banners"
        blurb="The slides across the top of the homepage, and where each one links."
        actions={
          <ButtonLink href="/" target="_blank" rel="noopener">
            <ExternalLink className="size-4" aria-hidden />
            View homepage
          </ButtonLink>
        }
      />

      {askCode && (
        <PasscodePanel
          onSave={(code) => {
            rememberPublishCode(code);
            setAskCode(false);
            setError(null);
            setDone("Passcode saved for this tab. Try that change again.");
          }}
        />
      )}

      {error && (
        <p role="alert" className="rounded-card border border-critical bg-critical-soft px-4 py-3 text-sm text-critical">
          {error}
        </p>
      )}
      {done && !error && (
        <p role="status" className="text-sm font-medium text-good">
          {done}
        </p>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel
          title="Slides"
          description="Shown in this order. Hidden slides stay here, ready to switch back on."
          bodyClassName="py-0 md:py-0"
        >
          {slides === null ? (
            <p className="py-10 text-center text-sm text-ink-muted">Loading slides…</p>
          ) : slides.length === 0 ? (
            <EmptyState
              title="No slides uploaded yet"
              body="The homepage is showing its built-in slides. Add one and the homepage switches to yours."
            />
          ) : (
            /* One fieldset, so a request in flight disables every control at
               once and nobody reorders a list the server is still rewriting. */
            <fieldset disabled={busy} className="min-w-0">
              <legend className="sr-only">Uploaded slides</legend>
              <ol className="divide-y divide-line">
                {slides.map((slide, position) => (
                  <SlideRow
                    key={slide.id}
                    slide={slide}
                    position={position}
                    last={position === slides.length - 1}
                    run={run}
                    onMove={move}
                  />
                ))}
              </ol>
            </fieldset>
          )}
        </Panel>

        <AddSlide busy={busy} run={run} />
      </div>

      {!!slides?.length && (
        <Panel
          title="Go back to the built-in slides"
          description="Deletes every slide above and their images. The homepage returns to the six slides it shipped with."
          className="border-critical"
        >
          <ConfirmAction
            size="md"
            label="Delete all slides"
            describe="every uploaded hero slide"
            onConfirm={() => void run(resetHeroSlides, "All slides deleted. The homepage is back to its built-in slides.")}
          />
        </Panel>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ a row */

function SlideRow({
  slide,
  position,
  last,
  run,
  onMove,
}: {
  slide: HeroUploadSlide;
  position: number;
  last: boolean;
  run: Run;
  onMove: (from: number, to: number) => void;
}) {
  const [href, setHref] = useState(slide.href);
  const [hrefError, setHrefError] = useState<string>();
  const [fileError, setFileError] = useState<string>();

  const n = position + 1;
  const dirty = href.trim() !== slide.href;

  const update = (fields: Record<string, string | File>, message: string) =>
    run(() => updateHeroSlide(slide.id, formWith(fields)), message);

  const saveHref = (event: FormEvent) => {
    event.preventDefault();
    const next = href.trim();
    if (!isSafeHref(next)) {
      setHrefError(HREF_HINT);
      return;
    }
    setHrefError(undefined);
    void update({ href: next }, `Slide ${n} now links to ${next}.`);
  };

  const replace = (slot: HeroImageSlot, file: File | null) => {
    if (!file) return;
    const problem = checkImage(file);
    setFileError(problem ?? undefined);
    if (!problem) void update({ [slot]: file }, `Slide ${n}: ${slot} image replaced.`);
  };

  return (
    <li className="flex flex-col gap-4 py-4 sm:flex-row">
      <div className={cn("flex shrink-0 items-start gap-2 sm:w-64", !slide.enabled && "opacity-50")}>
        <Thumb file={slide.desktop} label={`Slide ${n}, desktop`} className="aspect-64/19 flex-1" />
        {slide.mobile ? (
          <Thumb file={slide.mobile} label={`Slide ${n}, mobile`} className="aspect-10/7 w-16" />
        ) : (
          <span className="grid aspect-10/7 w-16 place-items-center rounded-control border border-dashed border-line-strong px-1 text-center text-[10px] leading-tight text-ink-subtle">
            Uses desktop
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink">
            Slide {n}{" "}
            <span className={cn("font-normal", slide.enabled ? "text-good" : "text-ink-subtle")}>
              · {slide.enabled ? "On the homepage" : "Hidden"}
            </span>
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={position === 0}
              onClick={() => onMove(position, position - 1)}
              aria-label={`Move slide ${n} up`}
            >
              <ArrowUp className="size-4" aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={last}
              onClick={() => onMove(position, position + 1)}
              aria-label={`Move slide ${n} down`}
            >
              <ArrowDown className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        <form onSubmit={saveHref} className="flex items-start gap-2">
          <Field label="Link" error={hrefError} className="min-w-0 flex-1">
            <Input
              value={href}
              onChange={(event) => setHref(event.target.value)}
              placeholder="/offers"
              maxLength={500}
            />
          </Field>
          {dirty && (
            <Button type="submit" variant="primary" className="mt-7">
              Save link
            </Button>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <label className="mr-2 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={slide.enabled}
              onChange={(event) =>
                void update(
                  { enabled: String(event.target.checked) },
                  event.target.checked ? `Slide ${n} is on the homepage.` : `Slide ${n} is hidden.`,
                )
              }
              className="size-4 accent-tertiary"
            />
            Show on homepage
          </label>

          <FileButton label="Replace desktop" onPick={(file) => replace("desktop", file)} />
          <FileButton
            label={slide.mobile ? "Replace mobile" : "Add mobile"}
            onPick={(file) => replace("mobile", file)}
          />
          {slide.mobile && (
            <Button
              size="sm"
              onClick={() =>
                void update({ clearMobile: "true" }, `Slide ${n} now uses its desktop image on phones.`)
              }
            >
              Remove mobile
            </Button>
          )}
          <ConfirmAction
            label="Delete"
            describe={`slide ${n}`}
            onConfirm={() => void run(() => deleteHeroSlide(slide.id), `Slide ${n} deleted.`)}
          />
        </div>

        {fileError && (
          <p role="alert" className="text-xs text-danger">
            {fileError}
          </p>
        )}
      </div>
    </li>
  );
}

function Thumb({ file, label, className }: { file: string; label: string; className?: string }) {
  return (
    <span className={cn("block overflow-hidden rounded-control bg-surface-muted", className)}>
      {/* A plain `img`: this is the uploaded original, shown small, and running
          a portal thumbnail through the optimiser buys nothing. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={heroImageUrl(file)} alt={label} className="h-full w-full object-cover" />
    </span>
  );
}

/** A file picker that looks like a button. The input is visually hidden rather
 *  than `display: none`, so it stays in the tab order and the label shows its
 *  focus ring. */
function FileButton({ label, onPick }: { label: string; onPick: (file: File | null) => void }) {
  return (
    <label className={buttonClass("secondary", "sm", "cursor-pointer has-disabled:pointer-events-none has-disabled:opacity-50 has-focus-visible:outline-2 has-focus-visible:outline-tertiary")}>
      <ImagePlus className="size-3.5" aria-hidden />
      {label}
      <input
        type="file"
        accept={HERO_ACCEPT}
        className="sr-only"
        onChange={(event) => {
          onPick(event.target.files?.[0] ?? null);
          // Cleared, so choosing the same file again still fires a change.
          event.target.value = "";
        }}
      />
    </label>
  );
}

/* --------------------------------------------------------------- add form */

/** A chosen file and a preview URL for it. The URL is revoked whenever it is
 *  replaced and when the form goes away, or every pick leaks the image. */
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

function AddSlide({ busy, run }: { busy: boolean; run: Run }) {
  const [desktop, pickDesktop] = usePicked();
  const [mobile, pickMobile] = usePicked();
  const [href, setHref] = useState("");
  const [errors, setErrors] = useState<Partial<Record<HeroImageSlot | "href", string>>>({});
  /* Bumped after a successful add, to remount the file inputs — a file input's
     value cannot be set back to a file, only cleared. */
  const [round, setRound] = useState(0);

  const choose = (slot: HeroImageSlot, file: File | null) => {
    const problem = file ? checkImage(file) : null;
    setErrors((current) => ({ ...current, [slot]: problem ?? undefined }));
    (slot === "desktop" ? pickDesktop : pickMobile)(problem ? null : file);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const link = href.trim();
    const next = {
      desktop: desktop ? undefined : "Choose the desktop image.",
      href: isSafeHref(link) ? undefined : HREF_HINT,
    };
    setErrors(next);
    if (!desktop || next.href) return;

    const fields: Record<string, string | File> = { href: link, desktop: desktop.file };
    if (mobile) fields.mobile = mobile.file;

    const ok = await run(() => addHeroSlide(formWith(fields)), "Slide added. It is live on the homepage.");
    if (!ok) return;
    pickDesktop(null);
    pickMobile(null);
    setHref("");
    setRound((value) => value + 1);
  };

  return (
    <Panel title="Add a slide" description="New slides go live at the end of the list.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <fieldset disabled={busy} className="flex min-w-0 flex-col gap-4">
          <legend className="sr-only">New slide</legend>

          <ImageField
            key={`desktop-${round}`}
            label="Desktop image"
            hint={sizeHint("desktop")}
            error={errors.desktop}
            preview={desktop?.url}
            aspect="aspect-64/19"
            onPick={(file) => choose("desktop", file)}
          />

          <ImageField
            key={`mobile-${round}`}
            label="Mobile image (optional)"
            hint={`${sizeHint("mobile")} Leave empty to use the desktop image on phones.`}
            error={errors.mobile}
            preview={mobile?.url}
            aspect="aspect-10/7"
            onPick={(file) => choose("mobile", file)}
          />

          <Field label="Link" hint={HREF_HINT} error={errors.href}>
            <Input
              value={href}
              onChange={(event) => setHref(event.target.value)}
              placeholder="/category/iphone"
              maxLength={500}
            />
          </Field>

          <Button type="submit" variant="primary">
            {busy ? "Saving…" : "Add slide"}
          </Button>
        </fieldset>
      </form>
    </Panel>
  );
}

function ImageField({
  label,
  hint,
  error,
  preview,
  aspect,
  onPick,
}: {
  label: string;
  hint: string;
  error?: string;
  preview?: string;
  aspect: string;
  onPick: (file: File | null) => void;
}) {
  return (
    <Field label={label} hint={hint} error={error}>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className={cn("mb-2 w-full rounded-control bg-surface-muted object-cover", aspect)}
        />
      )}
      <input
        type="file"
        accept={HERO_ACCEPT}
        onChange={(event) => onPick(event.target.files?.[0] ?? null)}
        className="block w-full text-sm text-ink-muted file:mr-3 file:cursor-pointer file:rounded-control file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-surface-muted"
      />
    </Field>
  );
}
