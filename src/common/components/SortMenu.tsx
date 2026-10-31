"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type Props<Id extends string> = {
  label: string;
  options: { id: Id; label: string }[];
  value: Id;
  onChange: (id: Id) => void;
};

// A sort picker that opens right under itself. A native <select> leaves the
// list to the browser, which on some phones floats it off in a corner.
export function SortMenu<Id extends string>({ label, options, value, onChange }: Props<Id>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const labelId = useId();
  const listId = useId();
  const current = options.find((option) => option.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    list.current?.focus();
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const show = () => {
    setActive(Math.max(0, options.findIndex((option) => option.id === value)));
    setOpen(true);
  };

  const choose = (id: Id) => {
    onChange(id);
    setOpen(false);
    button.current?.focus();
  };

  const onListKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") setActive((index) => Math.min(options.length - 1, index + 1));
    else if (event.key === "ArrowUp") setActive((index) => Math.max(0, index - 1));
    else if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(options.length - 1);
    else if (event.key === "Enter" || event.key === " ") choose(options[active].id);
    else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      if (event.key === "Escape") button.current?.focus();
      return;
    } else return;
    event.preventDefault();
  };

  return (
    <div ref={root} className="flex items-center gap-2 text-ink-muted">
      <span id={labelId} className="shrink-0">
        {label}
      </span>
      <div className="relative">
        <button
          ref={button}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${labelId} ${listId}-value`}
          onClick={() => (open ? setOpen(false) : show())}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              show();
            }
          }}
          className="flex min-w-40 items-center justify-between gap-2 rounded-control border border-line-strong bg-surface p-2 text-left text-ink"
        >
          <span id={`${listId}-value`}>{current?.label}</span>
          <ChevronDown aria-hidden className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <ul
            ref={list}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelId}
            aria-activedescendant={`${listId}-${active}`}
            onKeyDown={onListKey}
            className="absolute right-0 z-30 mt-1 min-w-full overflow-hidden rounded-control border border-line bg-surface py-1 shadow-lg outline-none"
          >
            {options.map((option, index) => {
              const selected = option.id === value;
              return (
                <li
                  key={option.id}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(index)}
                  onClick={() => choose(option.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 whitespace-nowrap",
                    index === active ? "bg-surface-muted" : "",
                    selected ? "font-medium text-ink" : "text-ink-muted",
                  )}
                >
                  <Check aria-hidden className={cn("size-4 shrink-0 text-tertiary", !selected && "invisible")} />
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
