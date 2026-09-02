import Form from "next/form";
import { Search } from "lucide-react";
import { site } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

export function SearchBar({
  id = "site-search",
  className,
}: {
  id?: string;
  className?: string;
}) {
  return (
    <Form
      action={site.searchPath}
      role="search"
      className={cn("relative flex items-center", className)}
    >
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        name="q"
        type="search"
        autoComplete="off"
        placeholder="Search products"
        className="h-10 w-full rounded-full bg-surface pr-14 pl-6 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-ink-inverse"
      />
      <button
        type="submit"
        aria-label="Search products"
        className="absolute right-1 grid size-8 place-items-center rounded-full text-ink transition-colors hover:bg-surface-muted"
      >
        <Search className="size-4.5" strokeWidth={2.25} aria-hidden />
      </button>
    </Form>
  );
}
