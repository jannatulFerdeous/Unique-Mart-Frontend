"use client";

import { Fragment, useState } from "react";
import type { ProductDetail } from "@/shared/config/catalog";
import { cn } from "@/shared/utils/cn";
import { product_details_data } from "../config/constants";

export function ProductTabs({ detail }: { detail?: ProductDetail }) {
  const { labels } = product_details_data;
  // Only offer a tab that has something behind it.
  const tabs = product_details_data.tabs.filter((tab) =>
    tab.id === "specification"
      ? Boolean(detail?.specs?.length)
      : Boolean(detail?.description?.blocks.length),
  );
  const [active, setActive] = useState(tabs[0]?.id ?? "specification");

  if (tabs.length === 0) {
    return <p className="mt-12 text-ink-muted">{labels.noSpecs}</p>;
  }

  return (
    <div className="mt-14">
      {/* WAI-ARIA tabs, the same pattern the home page's brand strip uses. */}
      <div
        role="tablist"
        aria-label="Product information"
        className="flex gap-6 overflow-x-auto border-b border-line"
      >
        {tabs.map((tab) => {
          const current = tab.id === active;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={current}
              aria-controls={`panel-${tab.id}`}
              tabIndex={current ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={cn(
                "-mb-px shrink-0 border-b-2 px-1 pb-3 font-medium transition-colors",
                current
                  ? "border-tertiary text-tertiary"
                  : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {active === "specification" && detail?.specs?.length ? (
        <div
          id="panel-specification"
          role="tabpanel"
          aria-labelledby="tab-specification"
          className="mt-6 overflow-x-auto"
        >
          <table className="w-full border-collapse text-left">
            <tbody>
              {detail.specs.map((group) => (
                // Each group is its own <tbody>-worth of rows headed by a
                // tinted band, matching the reference's grouped table.
                <Fragment key={group.title}>
                  <tr>
                    <th
                      colSpan={2}
                      scope="colgroup"
                      className="bg-tertiary-soft px-4 py-3 font-bold text-tertiary"
                    >
                      {group.title}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr
                      key={`${group.title}-${row.label}`}
                      className="border-b border-line align-top"
                    >
                      <th
                        scope="row"
                        className="w-2/5 px-4 py-3 font-normal text-ink-muted md:w-1/4"
                      >
                        {row.label}
                      </th>
                      <td className="px-4 py-3 text-ink">
                        {row.value.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {active === "description" && detail?.description ? (
        <div
          id="panel-description"
          role="tabpanel"
          aria-labelledby="tab-description"
          className="mt-6"
        >
          <h2 className="font-sans font-bold text-ink">
            {detail.description.title}
          </h2>

          <div className="mt-4 space-y-5 leading-[1.85] text-ink-muted">
            {detail.description.blocks.map((block) => (
              <div key={block.heading ?? block.paragraphs[0]}>
                {block.heading ? (
                  <h3 className="mb-2 font-sans font-bold text-ink">
                    {block.heading}
                  </h3>
                ) : null}
                {block.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
