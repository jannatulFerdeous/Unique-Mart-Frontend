"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  ChevronDown,
  Code,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Pilcrow,
  Redo2,
  RemoveFormatting,
  SquareCode,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  TextQuote,
  Underline,
  Undo2,
  Unlink,
  Upload,
  X,
} from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useUploadDescriptionImageMutation } from "@/redux/features/upload/uploadApi";
import { cn } from "@/shared/utils/cn";
import { toRichText } from "@/shared/utils/richText";

// "Heading 1–4" are stored as h2–h5: the product page's own h1 is the
// product name, and its h2 heads the description.
const HEADINGS = [
  { level: 2, label: "Heading 1", icon: <Heading1 /> },
  { level: 3, label: "Heading 2", icon: <Heading2 /> },
  { level: 4, label: "Heading 3", icon: <Heading3 /> },
  { level: 5, label: "Heading 4", icon: <Heading4 /> },
] as const;

const ALIGNMENTS = [
  { value: "left", label: "Align left", icon: <TextAlignStart /> },
  { value: "center", label: "Align centre", icon: <TextAlignCenter /> },
  { value: "right", label: "Align right", icon: <TextAlignEnd /> },
  { value: "justify", label: "Justify", icon: <TextAlignJustify /> },
] as const;

// A Word-style editor that reads and writes HTML. Plain-text values (older
// descriptions, Excel imports) open as paragraphs. The shop sanitises what
// it shows, so only the formatting the toolbar offers survives there.
export function RichTextEditor({
  value,
  onChange,
  labelledBy,
  describedBy,
  disabled,
}: {
  value: string;
  onChange: (html: string) => void;
  labelledBy: string;
  describedBy?: string;
  disabled?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: HEADINGS.map((each) => each.level) },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image.configure({ allowBase64: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight,
      Superscript,
      Subscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: toRichText(value),
    // Rendered on the client only; avoids a hydration mismatch.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": labelledBy,
        ...(describedBy && { "aria-describedby": describedBy }),
        class:
          "rich-text min-h-48 px-3 py-2.5 text-sm leading-relaxed text-ink focus:outline-none [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-tertiary",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  return (
    <div
      className={cn(
        "rounded-control border border-line-strong bg-surface focus-within:border-tertiary",
        disabled && "opacity-60",
      )}
    >
      {editor && <Toolbar editor={editor} disabled={disabled} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, disabled }: { editor: Editor; disabled?: boolean }) {
  const [addingImage, setAddingImage] = useState(false);
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      heading: HEADINGS.find(({ level }) => editor.isActive("heading", { level }))?.level ?? null,
      bullet: editor.isActive("bulletList"),
      ordered: editor.isActive("orderedList"),
      task: editor.isActive("taskList"),
      quote: editor.isActive("blockquote"),
      codeBlock: editor.isActive("codeBlock"),
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      underline: editor.isActive("underline"),
      highlight: editor.isActive("highlight"),
      link: editor.isActive("link"),
      superscript: editor.isActive("superscript"),
      subscript: editor.isActive("subscript"),
      align: ALIGNMENTS.find(({ value }) => editor.isActive({ textAlign: value }))?.value ?? null,
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });
  const chain = () => editor.chain().focus();

  const setLink = () => {
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link address", current ?? "https://");
    if (href === null) return;
    if (!href.trim() || href.trim() === "https://") chain().extendMarkRange("link").unsetLink().run();
    else chain().extendMarkRange("link").setLink({ href: href.trim() }).run();
  };

  const listIcon = state.ordered ? <ListOrdered /> : state.task ? <ListTodo /> : <List />;
  const heading = HEADINGS.find(({ level }) => level === state.heading);

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-0.5 rounded-t-control border-b border-line bg-surface-muted px-1.5 py-1"
    >
      <Tool label="Undo" disabled={disabled || !state.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 />
      </Tool>
      <Tool label="Redo" disabled={disabled || !state.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 />
      </Tool>
      <Divider />

      <ToolMenu
        label="Heading"
        icon={heading?.icon ?? <Heading />}
        active={Boolean(heading)}
        disabled={disabled}
        items={[
          { label: "Normal text", icon: <Pilcrow />, active: !heading, run: () => chain().setParagraph().run() },
          ...HEADINGS.map(({ level, label, icon }) => ({
            label,
            icon,
            active: state.heading === level,
            run: () => chain().toggleHeading({ level }).run(),
          })),
        ]}
      />
      <ToolMenu
        label="List"
        icon={listIcon}
        active={state.bullet || state.ordered || state.task}
        disabled={disabled}
        items={[
          { label: "Bullet list", icon: <List />, active: state.bullet, run: () => chain().toggleBulletList().run() },
          {
            label: "Numbered list",
            icon: <ListOrdered />,
            active: state.ordered,
            run: () => chain().toggleOrderedList().run(),
          },
          { label: "Task list", icon: <ListTodo />, active: state.task, run: () => chain().toggleTaskList().run() },
        ]}
      />
      <Tool label="Quote" active={state.quote} disabled={disabled} onClick={() => chain().toggleBlockquote().run()}>
        <TextQuote />
      </Tool>
      <Tool label="Code block" active={state.codeBlock} disabled={disabled} onClick={() => chain().toggleCodeBlock().run()}>
        <SquareCode />
      </Tool>
      <Divider />

      <Tool label="Bold" active={state.bold} disabled={disabled} onClick={() => chain().toggleBold().run()}>
        <Bold />
      </Tool>
      <Tool label="Italic" active={state.italic} disabled={disabled} onClick={() => chain().toggleItalic().run()}>
        <Italic />
      </Tool>
      <Tool label="Strikethrough" active={state.strike} disabled={disabled} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough />
      </Tool>
      <Tool label="Code" active={state.code} disabled={disabled} onClick={() => chain().toggleCode().run()}>
        <Code />
      </Tool>
      <Tool label="Underline" active={state.underline} disabled={disabled} onClick={() => chain().toggleUnderline().run()}>
        <Underline />
      </Tool>
      <Tool label="Highlight" active={state.highlight} disabled={disabled} onClick={() => chain().toggleHighlight().run()}>
        <Highlighter />
      </Tool>
      <Tool label={state.link ? "Edit link" : "Add link"} active={state.link} disabled={disabled} onClick={setLink}>
        <Link2 />
      </Tool>
      {state.link && (
        <Tool label="Remove link" disabled={disabled} onClick={() => chain().extendMarkRange("link").unsetLink().run()}>
          <Unlink />
        </Tool>
      )}
      <Divider />

      <Tool
        label="Superscript"
        active={state.superscript}
        disabled={disabled}
        onClick={() => chain().toggleSuperscript().run()}
      >
        <SuperscriptIcon />
      </Tool>
      <Tool label="Subscript" active={state.subscript} disabled={disabled} onClick={() => chain().toggleSubscript().run()}>
        <SubscriptIcon />
      </Tool>
      <Divider />

      {ALIGNMENTS.map(({ value, label, icon }) => (
        <Tool
          key={value}
          label={label}
          active={state.align === value}
          disabled={disabled}
          onClick={() => (state.align === value ? chain().unsetTextAlign() : chain().setTextAlign(value)).run()}
        >
          {icon}
        </Tool>
      ))}
      <Divider />

      <Tool label="Divider line" disabled={disabled} onClick={() => chain().setHorizontalRule().run()}>
        <Minus />
      </Tool>
      <Tool label="Clear formatting" disabled={disabled} onClick={() => chain().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting />
      </Tool>
      <Divider />

      <button
        type="button"
        title="Add image"
        aria-label="Add image"
        aria-pressed={addingImage}
        disabled={disabled}
        onClick={() => setAddingImage(!addingImage)}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-control px-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
          addingImage && "bg-surface text-tertiary",
        )}
      >
        <ImagePlus aria-hidden />
        Add
      </button>

      {addingImage && (
        <ImagePanel
          onInsert={(src, alt) => {
            chain().setImage({ src, alt: alt || undefined }).run();
            setAddingImage(false);
          }}
          onClose={() => setAddingImage(false)}
        />
      )}
    </div>
  );
}

// A toolbar button that opens a short menu (headings, list types).
function ToolMenu({
  label,
  icon,
  active,
  disabled,
  items,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  disabled?: boolean;
  items: { label: string; icon: ReactNode; active: boolean; run: () => void }[];
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        title={label}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-8 items-center gap-0.5 rounded-control px-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
          (active || open) && "bg-surface text-tertiary",
        )}
      >
        {icon}
        <ChevronDown className="size-3!" aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute top-full left-0 z-20 mt-1 min-w-44 rounded-control border border-line bg-surface p-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitemradio"
              aria-checked={item.active}
              onClick={() => {
                item.run();
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-control px-2.5 py-1.5 text-left text-sm text-ink hover:bg-surface-muted [&_svg]:size-4 [&_svg]:text-ink-muted",
                item.active && "bg-tertiary-soft text-tertiary [&_svg]:text-tertiary",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Upload a photo, or paste the address of one that's already online.
function ImagePanel({ onInsert, onClose }: { onInsert: (src: string, alt: string) => void; onClose: () => void }) {
  const id = useId();
  const picker = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");
  const [alt, setAlt] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [upload, { isLoading: uploading }] = useUploadDescriptionImageMutation();

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setProblem(null);
    try {
      const { url } = await upload(file).unwrap();
      onInsert(url, alt.trim());
    } catch (error) {
      setProblem(apiErrorMessage(error, "Couldn't upload the image. Please try again."));
    } finally {
      if (picker.current) picker.current.value = "";
    }
  };

  // A form inside the product form isn't allowed, so Enter is handled here.
  const insertLink = (event?: FormEvent) => {
    event?.preventDefault();
    const src = link.trim();
    if (!/^https:\/\/\S+$/i.test(src)) {
      setProblem("Paste an image address starting with https://");
      return;
    }
    onInsert(src, alt.trim());
  };

  return (
    <div className="w-full basis-full border-t border-line bg-surface p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink">Add an image</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-7 place-items-center rounded-control text-ink-muted hover:bg-surface-muted hover:text-ink"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-2 grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end">
        <div>
          <input
            ref={picker}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => pick(event.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => picker.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-control bg-tertiary px-3 py-2 text-sm font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover disabled:opacity-60"
          >
            <Upload className="size-4" aria-hidden />
            {uploading ? "Uploading…" : "Upload from computer"}
          </button>
        </div>

        <div>
          <label htmlFor={`${id}-link`} className="mb-1 block text-xs text-ink-subtle">
            Or paste an image address
          </label>
          <div className="flex gap-2">
            <input
              id={`${id}-link`}
              type="url"
              inputMode="url"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && insertLink(event)}
              placeholder="https://…"
              disabled={uploading}
              className="min-w-0 flex-1 rounded-control border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-tertiary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => insertLink()}
              disabled={uploading || !link.trim()}
              className="shrink-0 rounded-control border border-line-strong px-3 py-2 text-sm font-bold text-ink transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-50"
            >
              Insert
            </button>
          </div>
        </div>
      </div>

      <label htmlFor={`${id}-alt`} className="mt-3 mb-1 block text-xs text-ink-subtle">
        What the image shows (optional, read out by screen readers and used by search engines)
      </label>
      <input
        id={`${id}-alt`}
        value={alt}
        onChange={(event) => setAlt(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && event.preventDefault()}
        placeholder="e.g. iPhone 17 Pro in Cosmic Orange, back view"
        disabled={uploading}
        className="w-full rounded-control border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-tertiary focus:outline-none"
      />

      <p className="mt-2 text-xs text-ink-subtle">JPG, PNG, WebP, GIF or AVIF, up to 5 MB.</p>
      {problem && (
        <p role="alert" className="mt-1 text-sm text-danger">
          {problem}
        </p>
      )}
    </div>
  );
}

function Tool({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-control text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
        active && "bg-surface text-tertiary",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-line" />;
}
