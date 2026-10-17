"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/shared/utils/cn";

// Options, optionally under headings (e.g. districts by division).
export type SearchSelectGroup = { label?: string; options: string[] };

// A dropdown with a search box, in the shop's own style rather than the
// operating system's menu. It draws its own label: inside a <label>, clicks on
// the list would be handed back to the button and reopen it.
export function SearchSelect({
  label,
  value,
  onChange,
  groups,
  placeholder,
  searchPlaceholder,
  emptyText = "No matches",
  hint,
  error,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  groups: SearchSelectGroup[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText?: string;
  hint?: string;
  error?: string;
  className?: string;
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const noteId = `${id}-note`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  // What the search leaves, still grouped, plus the same options in one list
  // for the arrow keys.
  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    return groups
      .map((group) => ({ ...group, options: group.options.filter((option) => option.toLowerCase().includes(term)) }))
      .filter((group) => group.options.length > 0);
  }, [groups, query]);
  const flat = useMemo(() => shown.flatMap((group) => group.options), [shown]);

  const openList = () => {
    setQuery("");
    setActive(Math.max(0, groups.flatMap((group) => group.options).indexOf(value)));
    setOpen(true);
  };

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };

  const choose = (option: string) => {
    onChange(option);
    close(true);
  };

  // Typing goes straight into the search box once the list is open.
  useEffect(() => {
    if (open) search.current?.focus();
  }, [open]);

  // Keep the highlighted option in view while moving with the keys.
  useEffect(() => {
    if (!open) return;
    list.current?.querySelector(`#${CSS.escape(optionId(active))}`)?.scrollIntoView({ block: "nearest" });
  });

  // A click anywhere else closes it.
  useEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  const onSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(flat.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(flat.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (flat[active]) choose(flat[active]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const onTriggerKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openList();
    }
  };

  let index = -1;

  return (
    <div ref={root} className={cn("relative", className)}>
      <span id={labelId} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </span>

      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${labelId} ${id}-value`}
        aria-describedby={error || hint ? noteId : undefined}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onTriggerKey}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-control border bg-surface px-3 py-2 text-left text-sm transition-colors focus:border-tertiary focus:outline-none",
          error ? "border-danger" : open ? "border-tertiary" : "border-line-strong hover:border-ink-subtle",
        )}
      >
        <span id={`${id}-value`} className={cn("truncate", value ? "text-ink" : "text-ink-subtle")}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-ink-muted transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-control border border-line bg-surface shadow-lg">
          <div className="flex items-center gap-2 border-b border-line px-3">
            <Search className="size-4 shrink-0 text-ink-subtle" aria-hidden />
            <input
              ref={search}
              type="text"
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={flat[active] ? optionId(active) : undefined}
              aria-label={searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
              placeholder={searchPlaceholder}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
            />
          </div>

          <ul ref={list} id={listId} role="listbox" aria-labelledby={labelId} className="max-h-64 overflow-y-auto py-1">
            {flat.length === 0 ? (
              <li role="presentation" className="px-3 py-6 text-center text-sm text-ink-subtle">
                {emptyText}
              </li>
            ) : (
              shown.map((group, groupIndex) => (
                <li key={group.label ?? `group-${groupIndex}`} role="presentation">
                  {group.label && (
                    <p
                      aria-hidden
                      className="px-3 pt-2.5 pb-1 text-[11px] font-semibold tracking-wider text-ink-subtle uppercase"
                    >
                      {group.label}
                    </p>
                  )}
                  <ul role="group" aria-label={group.label}>
                    {group.options.map((option) => {
                      index += 1;
                      const at = index;
                      const selected = option === value;
                      return (
                        <li
                          key={option}
                          id={optionId(at)}
                          role="option"
                          aria-selected={selected}
                          onMouseEnter={() => setActive(at)}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => choose(option)}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                            at === active ? "bg-tertiary-soft" : "",
                            selected ? "font-medium text-tertiary" : "text-ink",
                          )}
                        >
                          <Check className={cn("size-4 shrink-0", selected ? "opacity-100" : "opacity-0")} aria-hidden />
                          <span className="truncate">{option}</span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error ? (
        <span id={noteId} className="mt-1 block text-xs text-danger">
          {error}
        </span>
      ) : hint ? (
        <span id={noteId} className="mt-1 block text-xs text-ink-subtle">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
