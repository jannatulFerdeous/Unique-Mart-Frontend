"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const PANEL_ID = "mobile-search";

// Phones: whether the search bar under the header row is showing. The menu
// button closes it, so the two never stack up.
const MobileSearchContext = createContext<{ open: boolean; setOpen: (open: boolean) => void }>({
  open: false,
  setOpen: () => {},
});

export const useMobileSearch = () => useContext(MobileSearchContext);

export function MobileSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <MobileSearchContext.Provider value={{ open, setOpen }}>{children}</MobileSearchContext.Provider>;
}

// The search button beside the menu button.
export function MobileSearchToggle() {
  const { open, setOpen } = useMobileSearch();
  const Icon = open ? X : Search;

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-label={open ? "Close search" : "Search products"}
      aria-expanded={open}
      aria-controls={PANEL_ID}
      className="grid size-10 shrink-0 place-items-center rounded-control bg-ink-inverse/10 text-ink-inverse transition-colors hover:bg-ink-inverse/20 focus-visible:outline-ink-inverse lg:hidden"
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}

// The search bar, dropping down over the page just under the header row. It
// floats rather than pushing the page down, so nothing below it moves (or
// makes the browser re-scroll) while it opens; only its clip and opacity
// animate.
export function MobileSearchPanel({ children }: { children: ReactNode }) {
  const { open, setOpen } = useMobileSearch();
  const inner = useRef<HTMLDivElement>(null);

  // Opened: straight into typing, without the browser scrolling to the input.
  useEffect(() => {
    if (open) inner.current?.querySelector("input")?.focus({ preventScroll: true });
  }, [open]);

  return (
    <div
      id={PANEL_ID}
      ref={inner}
      inert={!open}
      onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
      className={cn(
        "absolute inset-x-0 top-full bg-inverse shadow-menu transition-[clip-path,opacity] duration-300 ease-out motion-reduce:transition-none lg:hidden",
        open ? "opacity-100 [clip-path:inset(0_0_-2rem_0)]" : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]",
      )}
    >
      <div className="container-page">{children}</div>
    </div>
  );
}
