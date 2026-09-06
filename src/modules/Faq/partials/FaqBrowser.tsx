"use client";

import { useEffect, useId, useState } from "react";
import { FaqAccordion } from "@/common/components/FaqAccordion";
import { cn } from "@/shared/utils/cn";
import { faq_data } from "../config/constants";

export function FaqBrowser() {
  const { groups, search, empty, navLabel, expandAll, collapseAll } = faq_data;
  const inputId = useId();

  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<string[]>([]);
  // Only meaningful while searching, where every match starts open.
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [active, setActive] = useState(groups[0]?.id ?? "");

  const needle = query.trim().toLowerCase();
  const searching = needle.length > 0;

  // Answers are searched as well as questions — people look for "EMI" or
  // "courier", which are words in the answer more often than in the question.
  const visible = groups
    .map((group) => ({
      ...group,
      items: searching
        ? group.items.filter(
            (item) =>
              item.question.toLowerCase().includes(needle) ||
              item.answer.toLowerCase().includes(needle),
          )
        : group.items,
    }))
    .filter((group) => group.items.length > 0);

  const matches = visible.reduce((total, group) => total + group.items.length, 0);
  const allIds = groups.flatMap((group) => group.items.map((item) => item.id));
  const allOpen = allIds.every((id) => openIds.includes(id));
  const visibleIds = visible.map((group) => group.id).join(",");

  // Highlights the topic you are actually reading. The band is the strip just
  // below the sticky header, so a section becomes current once its heading
  // clears the header rather than when it first peeks into view.
  useEffect(() => {
    const sections = visibleIds
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const onscreen = entries.filter((entry) => entry.isIntersecting);
        if (onscreen.length === 0) return;
        const topmost = onscreen.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActive(topmost.target.id);
      },
      { rootMargin: "-140px 0px -65% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [visibleIds]);

  const isOpen = (id: string) =>
    searching ? !collapsed.includes(id) : openIds.includes(id);

  const toggle = (id: string, next: boolean) => {
    if (searching) {
      setCollapsed((prev) =>
        next ? prev.filter((each) => each !== id) : [...prev, id],
      );
      return;
    }
    // Must dedupe: "Expand all" sets `open` on every row, each of which fires
    // its own native toggle event back through here. Appending blindly stored
    // all 23 ids twice, so `allOpen` never became true and the button kept
    // saying "Expand all".
    setOpenIds((prev) => {
      if (!next) return prev.filter((each) => each !== id);
      return prev.includes(id) ? prev : [...prev, id];
    });
  };

  return (
    <section aria-labelledby="faq-heading" className="pt-8">
      <div className="container-page">
        <div className="mx-auto w-full max-w-125">
          <label htmlFor={inputId} className="sr-only">
            {search.label}
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              // A new search starts from every match open again.
              setCollapsed([]);
            }}
            placeholder={search.placeholder}
            autoComplete="off"
            className="w-full rounded-control border border-line-strong bg-surface p-2 text-base text-ink placeholder:text-ink-subtle"
          />
        </div>

        <p role="status" className="sr-only">
          {matches} of {allIds.length} questions shown
        </p>

        {visible.length === 0 ? (
          <p className="py-14 text-center text-ink-muted">{empty}</p>
        ) : (
          <div className="mt-10 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-14">
            {/* top-32 clears the sticky header: 112px at md and up, 104 below. */}
            <nav
              aria-label={navLabel}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <p className="hidden font-bold tracking-wider uppercase text-ink-subtle lg:block">
                {navLabel}
              </p>

              {/* Chips in a centred wrapping row below lg; from lg a ruled list
                  with an accent bar that follows the section you are reading. */}
              <ul className="flex flex-wrap justify-center gap-2 lg:mt-4 lg:block lg:space-y-0.5 lg:border-l lg:border-line">
                {visible.map((group) => {
                  const current = group.id === active;

                  return (
                    <li key={group.id}>
                      <a
                        href={`#${group.id}`}
                        aria-current={current ? "true" : undefined}
                        className={cn(
                          "flex items-center gap-2 text-sm transition-colors",
                          "max-lg:rounded-control max-lg:border max-lg:bg-surface max-lg:px-3 max-lg:py-1.5",
                          // -ml-px lays the bar over the list's own rule, so the
                          // active item replaces it rather than doubling it.
                          "lg:-ml-px lg:border-l-2 lg:py-2 lg:pl-4",
                          current
                            ? "font-medium text-tertiary max-lg:border-tertiary lg:border-l-tertiary"
                            : "text-ink-muted hover:text-tertiary max-lg:border-line lg:border-l-transparent lg:hover:border-l-line-strong",
                        )}
                      >
                        <span className="lg:flex-1">{group.title}</span>
                        <span
                          className={cn(
                            "text-xs tabular-nums",
                            current ? "text-tertiary" : "text-ink-subtle",
                          )}
                        >
                          {group.items.length}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-10 lg:mt-0">
              {/* Pointless mid-search, where everything is already open. */}
              {!searching && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setOpenIds(allOpen ? [] : allIds)}
                    className="text-sm font-medium text-tertiary underline decoration-tertiary/40 underline-offset-4 transition-colors hover:decoration-tertiary"
                  >
                    {allOpen ? collapseAll : expandAll}
                  </button>
                </div>
              )}

              <div className={cn("space-y-12", searching ? "mt-0" : "mt-4")}>
                {visible.map((group) => (
                  <section
                    key={group.id}
                    id={group.id}
                    aria-labelledby={`${group.id}-heading`}
                    className="scroll-mt-32"
                  >
                    {/* Black at rest, accent while this is the section being
                        read — the same `active` the sidebar bar follows, so the
                        two highlights always agree. */}
                    <h2
                      id={`${group.id}-heading`}
                      className={cn(
                        "font-sans font-bold transition-colors duration-300",
                        group.id === active ? "text-tertiary" : "text-ink",
                      )}
                    >
                      {group.title}
                    </h2>

                    <FaqAccordion
                      items={group.items}
                      className="mt-4"
                      isOpen={isOpen}
                      onToggle={toggle}
                    />
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
