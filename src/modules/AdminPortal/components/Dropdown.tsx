"use client";

import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/shared/utils/cn";

// The dashboard's dropdown: written like a <select> (the same <option> and
// <optgroup> children, value and onChange(event)), drawn in the site's style
// instead of the operating system's menu. The list opens in a layer over the
// page, so tables and panels never clip it, and it isn't inside any <label>
// (where a click on an option would reopen it).

type Option = { value: string; label: string; disabled: boolean };
type Group = { label?: string; options: Option[] };

const SEARCH_FROM = 9;
const LIST_MAX = 288;

const textOf = (node: ReactNode): string =>
  typeof node === "string" || typeof node === "number"
    ? String(node)
    : Array.isArray(node)
      ? node.map(textOf).join("")
      : isValidElement<{ children?: ReactNode }>(node)
        ? textOf(node.props.children)
        : "";

// The <option>s and <optgroup>s among the children, in order.
const collect = (children: ReactNode): Group[] => {
  const groups: Group[] = [];
  let loose: Group | null = null;
  const walk = (nodes: ReactNode) => {
    Children.forEach(nodes, (node) => {
      if (!isValidElement(node)) return;
      const element = node as ReactElement<{ value?: unknown; children?: ReactNode; disabled?: boolean; label?: string }>;
      if (element.type === Fragment) return walk(element.props.children);
      if (element.type === "option") {
        if (!loose) groups.push((loose = { options: [] }));
        const label = textOf(element.props.children);
        loose.options.push({
          value: element.props.value === undefined ? label : String(element.props.value),
          label,
          disabled: Boolean(element.props.disabled),
        });
      } else if (element.type === "optgroup") {
        loose = null;
        const group: Group = { label: element.props.label, options: [] };
        Children.forEach(element.props.children, (child) => {
          if (isValidElement<{ value?: unknown; children?: ReactNode; disabled?: boolean }>(child) && child.type === "option") {
            const label = textOf(child.props.children);
            group.options.push({
              value: child.props.value === undefined ? label : String(child.props.value),
              label,
              disabled: Boolean(child.props.disabled),
            });
          }
        });
        groups.push(group);
      }
    });
  };
  walk(children);
  return groups;
};

export type DropdownProps = {
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
};

export function Dropdown({
  value,
  defaultValue,
  onChange,
  children,
  disabled,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: DropdownProps) {
  const uid = useId();
  const listId = `${uid}-list`;
  const optionId = (index: number) => `${uid}-option-${index}`;

  const groups = useMemo(() => collect(children), [children]);
  const all = useMemo(() => groups.flatMap((group) => group.options), [groups]);

  const [own, setOwn] = useState(String(defaultValue ?? all[0]?.value ?? ""));
  const current = value === undefined ? own : String(value);
  const chosen = all.find((option) => option.value === current);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [place, setPlace] = useState<CSSProperties>({});
  const trigger = useRef<HTMLButtonElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const searchable = all.length >= SEARCH_FROM;

  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    return groups
      .map((group) => ({ ...group, options: group.options.filter((option) => option.label.toLowerCase().includes(term)) }))
      .filter((group) => group.options.length > 0);
  }, [groups, query]);
  const flat = useMemo(() => shown.flatMap((group) => group.options), [shown]);

  // Under the trigger, or over it when there's no room below.
  const position = () => {
    const box = trigger.current?.getBoundingClientRect();
    if (!box) return;
    const below = window.innerHeight - box.bottom;
    const up = below < Math.min(LIST_MAX, 200) && box.top > below;
    setPlace({
      position: "fixed",
      left: Math.min(box.left, window.innerWidth - Math.max(box.width, 200) - 8),
      minWidth: box.width,
      maxWidth: Math.max(box.width, 320),
      ...(up ? { bottom: window.innerHeight - box.top + 4 } : { top: box.bottom + 4 }),
    });
  };

  const openList = () => {
    if (disabled) return;
    position();
    setQuery("");
    setActive(Math.max(0, all.findIndex((option) => option.value === current)));
    setOpen(true);
  };

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };

  const choose = (option: Option) => {
    if (option.disabled) return;
    if (value === undefined) setOwn(option.value);
    if (option.value !== current) {
      const target = { value: option.value, name: name ?? "" };
      onChange?.({ target, currentTarget: target } as unknown as ChangeEvent<HTMLSelectElement>);
    }
    close(true);
  };

  // Follow the trigger while the page scrolls or resizes; close on a click elsewhere.
  useLayoutEffect(() => {
    if (!open) return;
    const follow = () => position();
    const outside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !layer.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("scroll", follow, true);
    window.addEventListener("resize", follow);
    document.addEventListener("mousedown", outside);
    return () => {
      window.removeEventListener("scroll", follow, true);
      window.removeEventListener("resize", follow);
      document.removeEventListener("mousedown", outside);
    };
  }, [open]);

  useEffect(() => {
    if (open) (searchable ? search.current : list.current)?.focus({ preventScroll: true });
  }, [open, searchable]);

  useEffect(() => {
    if (!open) return;
    list.current?.querySelector(`#${CSS.escape(optionId(active))}`)?.scrollIntoView({ block: "nearest" });
  });

  const onListKey = (event: KeyboardEvent) => {
    const move = (to: number) => {
      event.preventDefault();
      setActive(Math.max(0, Math.min(flat.length - 1, to)));
    };
    if (event.key === "ArrowDown") move(active + 1);
    else if (event.key === "ArrowUp") move(active - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(flat.length - 1);
    else if (event.key === "Enter") {
      event.preventDefault();
      if (flat[active]) choose(flat[active]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") setOpen(false);
  };

  const onTriggerKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openList();
    }
  };

  let index = -1;

  return (
    <>
      <button
        ref={trigger}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onTriggerKey}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-control border bg-surface px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:border-tertiary disabled:cursor-not-allowed disabled:opacity-50",
          open ? "border-tertiary ring-2 ring-tertiary/15" : "border-line-strong hover:border-ink-subtle",
          className,
        )}
      >
        <span className={cn("truncate", chosen ? "text-ink" : "text-ink-subtle")}>{chosen?.label ?? "Choose…"}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-ink-muted transition-transform duration-200", open && "rotate-180")} aria-hidden />
      </button>
      {name && <input type="hidden" name={name} value={current} />}

      {open &&
        createPortal(
          <div
            ref={layer}
            style={place}
            className="z-[60] overflow-hidden rounded-control border border-line bg-surface text-sm shadow-menu motion-safe:animate-[dropdown-in_120ms_ease-out]"
          >
            {searchable && (
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
                  aria-label="Search the list"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onListKey}
                  placeholder="Search…"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
                />
              </div>
            )}
            <ul
              ref={list}
              id={listId}
              role="listbox"
              tabIndex={searchable ? -1 : 0}
              aria-activedescendant={!searchable && flat[active] ? optionId(active) : undefined}
              onKeyDown={searchable ? undefined : onListKey}
              className="overflow-y-auto py-1 focus:outline-none"
              style={{ maxHeight: LIST_MAX }}
            >
              {flat.length === 0 ? (
                <li role="presentation" className="px-3 py-5 text-center text-ink-subtle">
                  No matches
                </li>
              ) : (
                shown.map((group, groupIndex) => (
                  <li key={group.label ?? `group-${groupIndex}`} role="presentation">
                    {group.label && (
                      <p aria-hidden className="px-3 pt-2.5 pb-1 text-[0.6875rem] font-semibold tracking-wider text-ink-subtle uppercase">
                        {group.label}
                      </p>
                    )}
                    <ul role="group" aria-label={group.label}>
                      {group.options.map((option) => {
                        index += 1;
                        const at = index;
                        const selected = option.value === current;
                        return (
                          <li
                            key={`${option.value}-${at}`}
                            id={optionId(at)}
                            role="option"
                            aria-selected={selected}
                            aria-disabled={option.disabled || undefined}
                            onMouseEnter={() => setActive(at)}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => choose(option)}
                            className={cn(
                              "flex cursor-pointer items-center gap-2 px-3 py-2",
                              at === active && !option.disabled && "bg-tertiary-soft",
                              selected ? "font-medium text-tertiary" : "text-ink",
                              option.disabled && "cursor-not-allowed opacity-40",
                            )}
                          >
                            <Check className={cn("size-4 shrink-0", selected ? "opacity-100" : "opacity-0")} aria-hidden />
                            <span className="truncate">{option.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))
              )}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
}
