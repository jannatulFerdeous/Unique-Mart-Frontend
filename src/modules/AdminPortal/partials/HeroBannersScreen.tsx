"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus } from "lucide-react";
import { createStore } from "@/shared/libs/admin/store";
import {
  HERO_ACCEPT,
  HERO_SIZES,
  checkImage,
  isSafeHref,
  type AdminHeroSlide,
  type HeroImageSlot,
} from "@/shared/libs/hero/types";
import { cn } from "@/shared/utils/cn";
import { Button, ButtonLink, buttonClass } from "../components/Button";
import { ConfirmAction } from "../components/ConfirmAction";
import { Field, Input } from "../components/Field";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";

const heroSlides = createStore<AdminHeroSlide[]>(() => []);

type Run = (change: (slides: AdminHeroSlide[]) => AdminHeroSlide[], done: string) => void;

const HREF_HINT = "A page on this site, like /category/iphone, or a full https:// address.";

const sizeHint = (slot: HeroImageSlot) =>
  `${HERO_SIZES[slot].width} × ${HERO_SIZES[slot].height} px. PNG, JPG, WebP or AVIF, up to 5 MB.`;

const release = (url: string | null) => {
  if (url) URL.revokeObjectURL(url);
};

const newSlideId = () => `HS-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;

export function HeroBannersScreen() {
  const slides = heroSlides.use();
  const [done, setDone] = useState<string | null>(null);

  const run: Run = (change, message) => {
    heroSlides.update(change);
    setDone(message);
  };

  const patch = (id: string, fields: Partial<AdminHeroSlide>) => (current: AdminHeroSlide[]) =>
    current.map((slide) => (slide.id === id ? { ...slide, ...fields } : slide));

  const move = (from: number, to: number) => {
    run((current) => {
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    }, "Order saved.");
  };

  const clearAll = () => {
    for (const slide of slides) {
      release(slide.desktop);
      release(slide.mobile);
    }
    run(() => [], "All slides deleted.");
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

      {done && (
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
          {slides.length === 0 ? (
            <EmptyState
              title="No slides uploaded yet"
              body="Slides added here are a preview only. They are not saved and a reload clears them."
            />
          ) : (
            <ol className="divide-y divide-line">
              {slides.map((slide, position) => (
                <SlideRow
                  key={slide.id}
                  slide={slide}
                  position={position}
                  last={position === slides.length - 1}
                  run={run}
                  patch={patch}
                  onMove={move}
                />
              ))}
            </ol>
          )}
        </Panel>

        <AddSlide run={run} />
      </div>

      {slides.length > 0 && (
        <Panel
          title="Remove every slide"
          description="Deletes every slide above and their images."
          className="border-critical"
        >
          <ConfirmAction
            size="md"
            label="Delete all slides"
            describe="every uploaded hero slide"
            onConfirm={clearAll}
          />
        </Panel>
      )}
    </>
  );
}

function SlideRow({
  slide,
  position,
  last,
  run,
  patch,
  onMove,
}: {
  slide: AdminHeroSlide;
  position: number;
  last: boolean;
  run: Run;
  patch: (id: string, fields: Partial<AdminHeroSlide>) => (current: AdminHeroSlide[]) => AdminHeroSlide[];
  onMove: (from: number, to: number) => void;
}) {
  const [href, setHref] = useState(slide.href);
  const [hrefError, setHrefError] = useState<string>();
  const [fileError, setFileError] = useState<string>();

  const n = position + 1;
  const dirty = href.trim() !== slide.href;

  const update = (fields: Partial<AdminHeroSlide>, message: string) =>
    run(patch(slide.id, fields), message);

  const saveHref = (event: FormEvent) => {
    event.preventDefault();
    const next = href.trim();
    if (!isSafeHref(next)) {
      setHrefError(HREF_HINT);
      return;
    }
    setHrefError(undefined);
    update({ href: next }, `Slide ${n} now links to ${next}.`);
  };

  const replace = (slot: HeroImageSlot, file: File | null) => {
    if (!file) return;
    const problem = checkImage(file);
    setFileError(problem ?? undefined);
    if (problem) return;
    release(slide[slot]);
    update({ [slot]: URL.createObjectURL(file) }, `Slide ${n}: ${slot} image replaced.`);
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
                update(
                  { enabled: event.target.checked },
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
              onClick={() => {
                release(slide.mobile);
                update({ mobile: null }, `Slide ${n} now uses its desktop image on phones.`);
              }}
            >
              Remove mobile
            </Button>
          )}
          <ConfirmAction
            label="Delete"
            describe={`slide ${n}`}
            onConfirm={() => {
              release(slide.desktop);
              release(slide.mobile);
              run((current) => current.filter((each) => each.id !== slide.id), `Slide ${n} deleted.`);
            }}
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={file} alt={label} className="h-full w-full object-cover" />
    </span>
  );
}

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
          event.target.value = "";
        }}
      />
    </label>
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

function AddSlide({ run }: { run: Run }) {
  const [desktop, pickDesktop] = usePicked();
  const [mobile, pickMobile] = usePicked();
  const [href, setHref] = useState("");
  const [errors, setErrors] = useState<Partial<Record<HeroImageSlot | "href", string>>>({});
  const [round, setRound] = useState(0);

  const choose = (slot: HeroImageSlot, file: File | null) => {
    const problem = file ? checkImage(file) : null;
    setErrors((current) => ({ ...current, [slot]: problem ?? undefined }));
    (slot === "desktop" ? pickDesktop : pickMobile)(problem ? null : file);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const link = href.trim();
    const next = {
      desktop: desktop ? undefined : "Choose the desktop image.",
      href: isSafeHref(link) ? undefined : HREF_HINT,
    };
    setErrors(next);
    if (!desktop || next.href) return;

    const slide: AdminHeroSlide = {
      id: newSlideId(),
      href: link,
      desktop: URL.createObjectURL(desktop.file),
      mobile: mobile ? URL.createObjectURL(mobile.file) : null,
      enabled: true,
    };

    run((current) => [...current, slide], "Slide added.");
    pickDesktop(null);
    pickMobile(null);
    setHref("");
    setRound((value) => value + 1);
  };

  return (
    <Panel title="Add a slide" description="New slides are added at the end of the list.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <fieldset className="flex min-w-0 flex-col gap-4">
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
            Add slide
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
