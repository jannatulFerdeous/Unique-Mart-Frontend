import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { formatDate } from "@/shared/libs/admin/format";
import type { Block, ProsePage } from "../config/types";

/* One renderer for every policy page.
 *
 * They are the same document with different words — a title, a date, and a run
 * of headed sections — so they are one component reading data rather than three
 * near-identical JSX files that drift apart the first time one is edited.
 *
 * A server component: there is nothing interactive here, so nothing ships to
 * the browser but the HTML. */

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind === "text") {
          return (
            <p key={index} className="mt-3 text-ink-muted">
              {block.text}
            </p>
          );
        }

        if (block.kind === "list") {
          return (
            <ul
              key={index}
              className="mt-3 list-disc space-y-1.5 pl-5 text-ink-muted marker:text-line-strong"
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          /* Scrolls rather than squeezing: these tables carry storage keys, and
             a wrapped key is harder to check against a browser's dev tools. */
          <div key={index} className="mt-4 overflow-x-auto">
            <table className="w-full min-w-xl border-collapse text-left text-sm">
              <thead>
                <tr>
                  {block.head.map((cell) => (
                    <th
                      key={cell}
                      scope="col"
                      className="border-b border-line py-2 pr-4 text-xs font-semibold tracking-wide text-ink-muted uppercase"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border-b border-line py-2.5 pr-4 align-top text-ink-muted"
                      >
                        {cellIndex === 0 ? (
                          /* `whitespace-nowrap`, because these are storage keys
                             the reader is meant to match against what their
                             browser shows. A key broken across two lines with a
                             hyphen in it is a key you cannot check. */
                          <code className="font-mono text-xs whitespace-nowrap text-ink">
                            {cell}
                          </code>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

export function Prose({ page }: { page: ProsePage }) {
  return (
    <>
      <ProductBreadcrumb trail={[{ label: "Home", href: "/" }, { label: page.title }]} />

      <div className="container-page py-8">
        {/* Capped at a readable measure. Full-width legal prose on a 1440px
            screen runs to 200 characters a line and nobody finishes it. */}
        <article>
          <h1 className="font-sans font-bold text-ink">{page.title}</h1>
          <p className="mt-2 text-ink-muted">{page.intro}</p>
          <p className="mt-1 text-sm text-ink-subtle">
            Last updated {formatDate(page.updated)}
          </p>

          {/* Jump list. A fifteen-section document is a reference, not a read,
              and people arrive looking for one clause. */}
          {page.sections.length > 5 && (
            <nav aria-label="On this page" className="mt-8 rounded-card border border-line bg-surface p-5">
              <h2 className="font-sans text-sm font-bold text-ink">On this page</h2>
              <ol className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {page.sections.map((section, index) => (
                  <li key={section.heading} className="text-sm">
                    <a
                      href={`#${slug(section.heading)}`}
                      className="text-tertiary hover:underline"
                    >
                      {page.numbered ? `${index + 1}. ` : ""}
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {page.sections.map((section, index) => (
            <section
              key={section.heading}
              id={slug(section.heading)}
              /* Clears the sticky header when a jump link lands here. */
              className="mt-10 scroll-mt-24"
            >
              <h2 className="font-sans font-bold text-ink">
                {page.numbered ? `${index + 1}. ` : ""}
                {section.heading}
              </h2>
              <Blocks blocks={section.blocks} />
            </section>
          ))}
        </article>
      </div>
    </>
  );
}

/** A heading turned into an anchor. Stable as long as the wording is, which is
 *  the right trade for a document whose clauses get linked to. */
const slug = (heading: string): string =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
